# Finn's Strategy — Multi-Regime Futures Research Framework

> **A research framework for systematic S&P 500 E-mini futures trading.**
> Eleven distinct sub-strategies run concurrently; an adaptive synthesis layer
> dynamically reweights them in response to the detected market regime.
> Paper-traded via the Alpaca Paper API. **No real capital at risk.**

[![status](https://img.shields.io/badge/status-paper--traded-c9a553)](#)
[![license](https://img.shields.io/badge/license-MIT-7880a0)](#license)
[![python](https://img.shields.io/badge/python-3.12-3776AB)](#)
[![claude](https://img.shields.io/badge/claude--sonnet--4.6-API-c9a553)](#)

---

## Disclosure

All performance figures referenced in this repository derive from a **paper-traded** forward test executed via the [Alpaca Paper Trading API](https://alpaca.markets/docs/trading/paper-trading/). No real capital is at risk. Order timing, slippage and fill assumptions reflect Alpaca's paper-trading simulation, which models live market data but cannot replicate real-execution liquidity or counter-party risk. Past simulated performance is not indicative of future real-world results. This repository is published for **educational and research purposes only** and does not constitute financial advice or a solicitation to trade. Trading futures involves substantial risk of loss.

---

## Headline result — 3-month paper-traded forward test (Feb–May 2026)

| Metric | Value | Notes |
|---|---:|---|
| Net return | **+156%** | Time-weighted; computed on Alpaca paper-account ledger |
| Win rate | **86%** | 6 wins / 7 trades |
| Sharpe ratio | **2.84** | Annualised, daily PnL series |
| Largest single trade | **+91%** | Short — Iran escalation, Q1 2026 |
| Benchmark | **S&P 500** | Reported as excess return |

Detailed trade log: [`docs/trade-log.md`](docs/trade-log.md)

---

## How it works (one page)

The framework is a **two-layer system**:

```
      ┌──────────────────────────────────────────────────┐
      │  Layer 1 — Eleven sub-strategy signal generators │
      │  (Python · pandas · numpy)                        │
      └──────────────────────────────────────────────────┘
                              │
                              ▼ each emits a signed score ∈ [-1, 1]
      ┌──────────────────────────────────────────────────┐
      │  Layer 2 — Adaptive Synthesis & Regime Weighting │
      │  (Python orchestrator · R Bayesian weights ·     │
      │   Claude API regime labeller, prompt-cached)      │
      └──────────────────────────────────────────────────┘
                              │
                              ▼ aggregated position signal
      ┌──────────────────────────────────────────────────┐
      │  Execution — Alpaca Paper Trading API            │
      │  Risk overlay · position sizing · fill capture    │
      └──────────────────────────────────────────────────┘
```

### Regime detection — what the Claude API actually sees

A regime label is recomputed every 4 hours from a structured prompt that includes:

1. **Macro state vector** — Fed funds rate, 2s10s spread, DXY momentum, VIX level, real-yield spread, current US economic-surprise index
2. **Recent news synthesis** — top 10 Reuters/Bloomberg headlines in the last 24h, processed by Claude for sentiment and category
3. **Geopolitical risk score** — Caldara–Iacoviello GPR daily index, normalised
4. **Cross-asset signals** — gold/copper ratio, credit spreads (HYG–LQD), 10y breakeven, dollar safe-haven flow
5. **Calendar context** — earnings density, FOMC proximity, OPEX week flag

The model returns a JSON object with one of seven regimes — `Trending-Up`, `Trending-Down`, `Mean-Reverting`, `High-Vol`, `Range-Bound`, `Event-Driven`, `Tail-Risk` — and a confidence score.

See [`src/regime_detector.py`](src/regime_detector.py) and [`docs/regime-prompt.md`](docs/regime-prompt.md).

### Adaptive weighting — how each sub-strategy's weight is set

For each detected regime, each sub-strategy has a **prior weight** (set from theory and historical regime-conditional Sharpe). A Bayesian update is applied based on each sub-strategy's rolling 30-day risk-adjusted contribution, conditioned on regime. The output is a normalised vector of weights w₁…w₁₁ that sums to 1.0.

See [`src/adaptive_weighting.py`](src/adaptive_weighting.py) and [`src/r_bayes_update.R`](src/r_bayes_update.R).

### Position sizing — risk-first, never the other way round

The aggregated position signal is converted to contract size via volatility-targeting: position size = (risk_budget × NAV) ÷ (ATR_20 × contract_multiplier × correlation_adjustment). Max single-trade risk capped at 2% of NAV. Daily drawdown circuit breaker at −4% of NAV.

See [`src/position_sizer.py`](src/position_sizer.py).

---

## Repository layout

```
finns-strategy/
├── README.md                            ← this file
├── LICENSE                              ← MIT
├── SECURITY.md                          ← responsible-disclosure policy
├── requirements.txt                     ← Python deps
├── .env.example                         ← env-var template (no secrets committed)
├── pyproject.toml                       ← packaging
├── src/
│   ├── __init__.py
│   ├── main.py                          ← orchestrator entry point
│   ├── regime_detector.py               ← Claude-powered regime labeller
│   ├── adaptive_weighting.py            ← Bayesian weight blending
│   ├── position_sizer.py                ← vol-targeted sizing + risk overlay
│   ├── alpaca_client.py                 ← paper-trading execution wrapper
│   ├── strategies/                       ← eleven sub-strategy modules
│   │   ├── macro_regime_fusion.py
│   │   ├── ict_smart_money.py
│   │   ├── options_flow.py
│   │   ├── trend_following.py
│   │   ├── stat_arb.py
│   │   ├── vwap_reversion.py
│   │   ├── earnings_event.py
│   │   ├── vol_breakout.py
│   │   ├── sector_rotation.py
│   │   ├── tail_risk_hedge.py
│   │   └── seasonality.py
│   ├── r_bayes_update.R                  ← Bayesian regime-conditional weight update
│   └── prompts/
│       ├── regime_prompt.md              ← XML-structured regime-detection prompt
│       └── post_trade_review.md          ← post-trade narrative review prompt
├── tests/
│   ├── test_regime_detector.py
│   ├── test_adaptive_weighting.py
│   └── test_position_sizer.py
└── docs/
    ├── architecture.md                  ← deeper architectural deep-dive
    ├── trade-log.md                     ← full trade-by-trade ledger
    ├── regime-prompt.md                 ← annotated regime-detection prompt
    └── methodology-appendix.md          ← inputs, equations, references
```

---

## Quick-start (paper trading only)

```bash
git clone https://github.com/FinnTech3/finns-strategy.git
cd finns-strategy
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env       # then add your ALPACA_PAPER_KEY / ANTHROPIC_API_KEY
python -m src.main --mode paper --capital 10000
```

The framework will not place real orders. It is hard-wired to refuse any non-paper endpoint.

---

## License

MIT — see [LICENSE](LICENSE).

## Contact

Finn Lakin · [lakin.finn@gmail.com](mailto:lakin.finn@gmail.com) · [linkedin.com/in/finnlakin](https://www.linkedin.com/in/finnlakin/)
