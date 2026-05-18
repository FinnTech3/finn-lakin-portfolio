"""
position_sizer.py
=================

Risk-first position sizing.

Sizing rule
-----------
    contracts = (risk_budget * NAV) / (ATR_20 * contract_multiplier * corr_adj)

Constraints
-----------
    * max single-trade risk = 2.0% of NAV
    * daily realised loss limit = -4.0% of NAV (circuit breaker; halt trading)
    * concurrent open positions = 2
    * if VIX > 30: half the computed size
    * if regime == "Tail-Risk": cap notional at 25% of NAV

Author : Finn Lakin
License: MIT
"""

from __future__ import annotations

import dataclasses
from typing import Literal


@dataclasses.dataclass(frozen=True)
class RiskConfig:
    max_risk_per_trade: float = 0.02      # 2% of NAV
    daily_loss_limit: float = -0.04        # -4% of NAV
    max_concurrent_positions: int = 2
    vix_size_halving_threshold: float = 30.0
    tail_risk_notional_cap: float = 0.25   # 25% of NAV


# ES E-mini = $50 per index point
ES_CONTRACT_MULTIPLIER = 50.0


def compute_position(
    *,
    signal: float,                       # ∈ [-1, 1] from aggregate_signal
    nav: float,                          # current account NAV (USD)
    atr_20: float,                       # 20-period ATR on ES (in points)
    vix: float,                          # current VIX level
    regime: str,                          # active regime label
    open_positions: int,                  # how many trades are already on
    realised_pnl_today_pct: float,        # signed % vs NAV at SOD
    correlation_adjustment: float = 1.0,  # 1.0 = no other correlated trade open
    cfg: RiskConfig = RiskConfig(),
) -> dict:
    """
    Returns
    -------
    dict with:
        action:           "ENTER" | "SKIP" | "HALT"
        side:             "long" | "short" | None
        contracts:        int   (signed: +long / -short / 0)
        notional_usd:     float
        reason:           short human-readable reason for the decision
    """
    # ---- 1. Circuit breakers ------------------------------------------------
    if realised_pnl_today_pct <= cfg.daily_loss_limit:
        return _decision("HALT", None, 0, 0.0, "daily loss limit hit")

    if open_positions >= cfg.max_concurrent_positions:
        return _decision("SKIP", None, 0, 0.0, "max concurrent positions reached")

    if abs(signal) < 0.10:
        return _decision("SKIP", None, 0, 0.0, "signal below action threshold")

    # ---- 2. Theoretical contract count from vol target ---------------------
    risk_dollars = cfg.max_risk_per_trade * nav * abs(signal)
    per_contract_risk = atr_20 * ES_CONTRACT_MULTIPLIER * correlation_adjustment
    contracts = int(risk_dollars // max(per_contract_risk, 1.0))

    if contracts < 1:
        return _decision("SKIP", None, 0, 0.0, "computed size < 1 contract")

    # ---- 3. Regime / vol overlays -----------------------------------------
    if vix > cfg.vix_size_halving_threshold:
        contracts = max(1, contracts // 2)

    side: Literal["long", "short"] = "long" if signal > 0 else "short"
    notional = contracts * ES_CONTRACT_MULTIPLIER * (atr_20 * 100)  # rough notional proxy

    if regime == "Tail-Risk":
        max_notional = cfg.tail_risk_notional_cap * nav
        if notional > max_notional:
            contracts = max(1, int(max_notional / max(notional / contracts, 1.0)))
            notional = contracts * ES_CONTRACT_MULTIPLIER * (atr_20 * 100)

    signed_contracts = contracts if side == "long" else -contracts
    return _decision("ENTER", side, signed_contracts, notional, "ok")


def _decision(action, side, contracts, notional, reason):
    return {
        "action": action,
        "side": side,
        "contracts": contracts,
        "notional_usd": round(notional, 2),
        "reason": reason,
    }


if __name__ == "__main__":
    out = compute_position(
        signal=-0.83, nav=12_500.0, atr_20=58.0, vix=31.4, regime="Tail-Risk",
        open_positions=0, realised_pnl_today_pct=0.0,
    )
    print(out)
