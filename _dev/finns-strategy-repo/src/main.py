"""
main.py — Finn's Strategy orchestrator.

Single entry point that wires the framework together for a paper-trading run:

    regime_detector  ->  (sub-strategy signals)  ->  adaptive_weighting
                                                   |
                                                   v
                                          aggregate_signal -> position_sizer
                                                                  |
                                                                  v
                                                       alpaca_client (paper)

Author : Finn Lakin
License: MIT
"""

from __future__ import annotations

import argparse
import logging
import time
from typing import Dict

from . import adaptive_weighting as aw
from . import position_sizer as ps
from . import regime_detector as rd
from .alpaca_client import AlpacaPaperClient
from .strategies import (
    earnings_event, ict_smart_money, macro_regime_fusion, options_flow,
    sector_rotation, seasonality, stat_arb, tail_risk_hedge, trend_following,
    vol_breakout, vwap_reversion,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("finns-strategy")

SUB_STRATEGY_MODULES = {
    "macro_regime_fusion": macro_regime_fusion,
    "ict_smart_money":     ict_smart_money,
    "options_flow":        options_flow,
    "trend_following":     trend_following,
    "stat_arb":            stat_arb,
    "vwap_reversion":      vwap_reversion,
    "earnings_event":      earnings_event,
    "vol_breakout":        vol_breakout,
    "sector_rotation":     sector_rotation,
    "tail_risk_hedge":     tail_risk_hedge,
    "seasonality":         seasonality,
}


def one_tick(client: AlpacaPaperClient, regime_state: dict, capital: float) -> None:
    macro, news = client.snapshot_market_inputs()
    regime_out = rd.detect_regime(macro=macro, news=news)
    regime = regime_out["regime"]
    log.info("regime=%s confidence=%.2f", regime, regime_out["confidence"])

    # Collect sub-strategy signals (each module exposes .generate_signal())
    sub_signals: Dict[str, float] = {
        name: mod.generate_signal(client=client, regime=regime)
        for name, mod in SUB_STRATEGY_MODULES.items()
    }

    # Refresh rolling Sharpe by regime from the strategy ledger
    rolling = client.rolling_sharpes_by_regime(regime, lookback_days=30)
    n_obs_in_regime = regime_state.get(regime, {}).get("n_obs", 0)
    weights = aw.compute_weights(
        regime=regime,
        rolling_sharpes_in_regime=rolling,
        n_obs_in_regime=n_obs_in_regime,
    )
    log.info("weights = %s", {k: round(v, 3) for k, v in weights.items() if v > 1e-3})

    aggregated = aw.aggregate_signal(weights, sub_signals)
    log.info("aggregated_signal=%+0.3f", aggregated)

    account = client.account()
    decision = ps.compute_position(
        signal=aggregated,
        nav=account.nav,
        atr_20=client.atr_20("ES"),
        vix=client.spot("VIX"),
        regime=regime,
        open_positions=account.open_position_count,
        realised_pnl_today_pct=account.realised_pnl_today_pct,
    )
    log.info("decision=%s", decision)

    if decision["action"] == "ENTER" and decision["contracts"] != 0:
        client.submit_paper_order(symbol="ES", contracts=decision["contracts"])

    regime_state.setdefault(regime, {"n_obs": 0})
    regime_state[regime]["n_obs"] += 1


def main() -> None:
    p = argparse.ArgumentParser(description="Finn's Strategy — paper-trading orchestrator")
    p.add_argument("--mode", choices=["paper"], required=True,
                   help="only 'paper' is supported; this framework never places real orders")
    p.add_argument("--capital", type=float, default=10_000.0)
    p.add_argument("--tick-seconds", type=int, default=4 * 3600,
                   help="seconds between regime / signal evaluations")
    args = p.parse_args()

    if args.mode != "paper":
        raise SystemExit("This framework is paper-only. Refusing to run in real mode.")

    client = AlpacaPaperClient(initial_capital=args.capital)
    regime_state: dict = {}

    log.info("starting paper-trading loop: capital=$%.0f  tick=%ss", args.capital, args.tick_seconds)
    while True:
        try:
            one_tick(client, regime_state, args.capital)
        except Exception:  # noqa: BLE001 — top-level loop must keep going
            log.exception("tick failed; sleeping then retrying")
        time.sleep(args.tick_seconds)


if __name__ == "__main__":
    main()
