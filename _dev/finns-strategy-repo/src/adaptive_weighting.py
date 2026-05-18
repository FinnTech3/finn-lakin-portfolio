"""
adaptive_weighting.py
=====================

The adaptive synthesis layer of Finn's Strategy.

For each of the eleven sub-strategies we hold:
    1. A regime-conditional **prior** weight       (theory + historical Sharpe)
    2. A regime-conditional **rolling Sharpe**     (last 30 trading days)

We combine them via a Bayesian update — the prior carries 70% of the mass at
the start of a regime and decays toward 30% as we accumulate enough in-regime
evidence to trust the empirical estimate.

Author : Finn Lakin
License: MIT
"""

from __future__ import annotations

import dataclasses
from typing import Dict, List

import numpy as np

# ---------------------------------------------------------------------------
# Regime taxonomy (must mirror src.regime_detector.RegimeLabel)
# ---------------------------------------------------------------------------
REGIMES: List[str] = [
    "Trending-Up",
    "Trending-Down",
    "Mean-Reverting",
    "High-Vol",
    "Range-Bound",
    "Event-Driven",
    "Tail-Risk",
]

STRATEGIES: List[str] = [
    "macro_regime_fusion",
    "ict_smart_money",
    "options_flow",
    "trend_following",
    "stat_arb",
    "vwap_reversion",
    "earnings_event",
    "vol_breakout",
    "sector_rotation",
    "tail_risk_hedge",
    "seasonality",
]


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
@dataclasses.dataclass(frozen=True)
class WeightingConfig:
    """How much prior mass to keep vs the empirical update.

    `prior_mass_floor` is the asymptotic share of the prior when we have
    seen `min_obs_for_full_evidence` in-regime observations. It never falls
    further than that — we never let the rolling estimate fully dominate.
    """

    prior_mass_floor: float = 0.30
    prior_mass_ceiling: float = 0.70
    min_obs_for_full_evidence: int = 60
    sharpe_floor: float = -1.0          # clip down-side Sharpe contributions
    sharpe_ceiling: float = 4.0          # clip absurd up-side Sharpe values
    smoothing_eps: float = 1e-9


# Hand-set theoretical priors — informed by sub-strategy design intent.
# Rows = strategy, cols = regime. Values are *unnormalised* Sharpe expectations.
# Higher = strategy is more suited to that regime.
PRIORS: Dict[str, Dict[str, float]] = {
    "macro_regime_fusion": {
        "Trending-Up": 0.9, "Trending-Down": 1.0, "Mean-Reverting": 0.4,
        "High-Vol": 1.1, "Range-Bound": 0.3, "Event-Driven": 1.2, "Tail-Risk": 1.5,
    },
    "ict_smart_money": {
        "Trending-Up": 1.2, "Trending-Down": 1.2, "Mean-Reverting": 0.3,
        "High-Vol": 0.7, "Range-Bound": 0.4, "Event-Driven": 0.6, "Tail-Risk": 0.2,
    },
    "options_flow": {
        "Trending-Up": 0.6, "Trending-Down": 0.6, "Mean-Reverting": 0.5,
        "High-Vol": 0.9, "Range-Bound": 0.5, "Event-Driven": 1.1, "Tail-Risk": 0.6,
    },
    "trend_following": {
        "Trending-Up": 1.3, "Trending-Down": 1.3, "Mean-Reverting": -0.6,
        "High-Vol": 0.4, "Range-Bound": -0.4, "Event-Driven": 0.1, "Tail-Risk": -0.2,
    },
    "stat_arb": {
        "Trending-Up": -0.2, "Trending-Down": -0.2, "Mean-Reverting": 1.4,
        "High-Vol": 0.3, "Range-Bound": 0.9, "Event-Driven": 0.1, "Tail-Risk": -0.6,
    },
    "vwap_reversion": {
        "Trending-Up": -0.1, "Trending-Down": -0.1, "Mean-Reverting": 0.8,
        "High-Vol": -0.2, "Range-Bound": 1.2, "Event-Driven": -0.1, "Tail-Risk": -0.4,
    },
    "earnings_event": {
        "Trending-Up": 0.4, "Trending-Down": 0.4, "Mean-Reverting": 0.3,
        "High-Vol": 0.7, "Range-Bound": 0.2, "Event-Driven": 1.5, "Tail-Risk": 0.0,
    },
    "vol_breakout": {
        "Trending-Up": 0.5, "Trending-Down": 0.5, "Mean-Reverting": -0.4,
        "High-Vol": 1.4, "Range-Bound": -0.2, "Event-Driven": 0.7, "Tail-Risk": 1.1,
    },
    "sector_rotation": {
        "Trending-Up": 0.6, "Trending-Down": 0.4, "Mean-Reverting": 0.3,
        "High-Vol": 0.2, "Range-Bound": 0.4, "Event-Driven": 0.4, "Tail-Risk": 0.0,
    },
    "tail_risk_hedge": {
        "Trending-Up": -0.3, "Trending-Down": 0.2, "Mean-Reverting": -0.2,
        "High-Vol": 0.6, "Range-Bound": -0.4, "Event-Driven": 0.2, "Tail-Risk": 2.5,
    },
    "seasonality": {
        "Trending-Up": 0.3, "Trending-Down": 0.3, "Mean-Reverting": 0.2,
        "High-Vol": -0.1, "Range-Bound": 0.4, "Event-Driven": -0.2, "Tail-Risk": -0.6,
    },
}


# ---------------------------------------------------------------------------
# Core API
# ---------------------------------------------------------------------------
def compute_weights(
    regime: str,
    rolling_sharpes_in_regime: Dict[str, float],
    n_obs_in_regime: int,
    cfg: WeightingConfig = WeightingConfig(),
) -> Dict[str, float]:
    """
    Compute normalised, regime-conditional weights w₁…w₁₁ that sum to 1.

    Parameters
    ----------
    regime : one of REGIMES
    rolling_sharpes_in_regime :
        {strategy_name: realised_30d_Sharpe_in_this_regime}
        Strategies missing from the dict are treated as Sharpe=0.
    n_obs_in_regime :
        How many in-regime observations have accumulated. Drives how much
        the empirical Sharpe dominates the theoretical prior.

    Returns
    -------
    dict[str, float] — strategy -> weight (∑ = 1.0, all weights ≥ 0)
    """
    if regime not in REGIMES:
        raise ValueError(f"unknown regime: {regime!r}")

    # ---- 1. Bayesian mass split between prior and evidence -----------------
    progress = min(1.0, n_obs_in_regime / cfg.min_obs_for_full_evidence)
    prior_mass = cfg.prior_mass_ceiling - progress * (
        cfg.prior_mass_ceiling - cfg.prior_mass_floor
    )
    evidence_mass = 1.0 - prior_mass

    # ---- 2. Per-strategy blended Sharpe -----------------------------------
    blended: Dict[str, float] = {}
    for s in STRATEGIES:
        prior_sharpe = PRIORS[s][regime]
        emp_sharpe = float(rolling_sharpes_in_regime.get(s, 0.0))
        emp_sharpe = np.clip(emp_sharpe, cfg.sharpe_floor, cfg.sharpe_ceiling)
        blended[s] = prior_mass * prior_sharpe + evidence_mass * emp_sharpe

    # ---- 3. Softmax with negative-Sharpe floor at zero --------------------
    # Strategies whose blended Sharpe is < 0 get zero weight (no shorting our
    # own sub-strategies — they sit out the regime instead).
    raw = {s: max(0.0, v) for s, v in blended.items()}
    total = sum(raw.values())

    if total < cfg.smoothing_eps:
        # Pathological case: every strategy is negative for this regime.
        # Fall back to equal weight across tail_risk_hedge and macro only.
        return {
            s: (0.5 if s in ("tail_risk_hedge", "macro_regime_fusion") else 0.0)
            for s in STRATEGIES
        }

    return {s: v / total for s, v in raw.items()}


# ---------------------------------------------------------------------------
# Aggregation: sub-strategy signals -> single position score
# ---------------------------------------------------------------------------
def aggregate_signal(
    weights: Dict[str, float], sub_signals: Dict[str, float]
) -> float:
    """
    Combine per-strategy signed scores into a single position score ∈ [-1, 1].

    sub_signals are expected to be already clipped to [-1, 1] inside each
    strategy module. We simply take the weighted average.
    """
    return float(
        np.clip(
            sum(weights[s] * sub_signals.get(s, 0.0) for s in STRATEGIES), -1.0, 1.0,
        )
    )


if __name__ == "__main__":
    # Worked example: high-vol regime, 14 in-regime observations
    demo_rolling = {
        "macro_regime_fusion": 1.6,
        "vol_breakout": 1.9,
        "tail_risk_hedge": 0.5,
        "trend_following": 0.4,
        "vwap_reversion": -0.3,
    }
    w = compute_weights(regime="High-Vol", rolling_sharpes_in_regime=demo_rolling,
                        n_obs_in_regime=14)
    print("regime: High-Vol  n_obs=14")
    for k, v in sorted(w.items(), key=lambda kv: -kv[1]):
        bar = "█" * int(round(v * 40))
        print(f"  {k:25s}  {v:6.2%}  {bar}")
