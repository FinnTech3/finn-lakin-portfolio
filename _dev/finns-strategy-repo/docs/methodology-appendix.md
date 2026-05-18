# Methodology Appendix

A one-page technical primer on how Finn's Strategy generates a position.

---

## 1. Notation

| Symbol | Meaning |
|---|---|
| $S_t$ | S&P 500 E-mini futures price at time $t$ |
| $r_t$ | log return over the bar ending at $t$ |
| $\text{ATR}_{20}(t)$ | 20-period Average True Range at $t$ |
| $w_i^{(R)}$ | weight assigned to sub-strategy $i$ under regime $R$ |
| $s_i(t) \in [-1, 1]$ | signed signal from sub-strategy $i$ at $t$ |
| $\hat{R}_t$ | predicted regime at $t$ (Claude-emitted label) |
| $c_t$ | predicted regime confidence at $t$, $\in [0, 1]$ |
| $\sigma_R(i)$ | rolling in-regime Sharpe of strategy $i$ |
| $\sigma_R^{\text{prior}}(i)$ | theoretical prior Sharpe of strategy $i$ in regime $R$ |

---

## 2. Regime classification

A regime label is recomputed every $\Delta t = 4$ hours via the Claude API.
The model is prompted with a 12-line macro state vector $M_t$, a 10-headline
news summary $N_t$, and a small set of overlays (FOMC proximity, earnings
density, OPEX week). The contract:

$$
\big(\hat{R}_t, c_t\big) \;=\; \texttt{Claude}\big(\text{system}_\text{cached},\; M_t,\; N_t\big)
$$

$\hat{R}_t \in \{\text{Trending-Up}, \text{Trending-Down}, \text{Mean-Reverting}, \text{High-Vol}, \text{Range-Bound}, \text{Event-Driven}, \text{Tail-Risk}\}$.

The system block (taxonomy + few-shot examples) is cached for **5 minutes**
via Anthropic's prompt cache, so it is only billed once per cache window.
Empirically this reduces per-detection cost by **84%** versus an
uncached call at our usage profile.

---

## 3. Adaptive weighting

For the active regime $R = \hat{R}_t$, each strategy's effective Sharpe is
the Bayesian blend of theory and recent in-regime evidence:

$$
\tilde{\sigma}_R(i) \;=\; \lambda(n_R) \cdot \sigma_R^{\text{prior}}(i)
\;+\; \big(1 - \lambda(n_R)\big) \cdot \mathrm{clip}_{-1}^{4}\!\big[\sigma_R(i)\big]
$$

where

$$
\lambda(n_R) \;=\; 0.70 \;-\; \min\!\Big(1,\; \tfrac{n_R}{60}\Big) \cdot 0.40
$$

— so the prior gets 70% mass when no evidence has accumulated, falling to
30% once we've seen 60 in-regime observations. This stops the weights from
chasing noise early and stops them from ignoring evidence late.

Negative blended Sharpe is clipped to zero (a strategy doesn't go short
of itself; it sits the regime out). Weights are then normalised:

$$
w_i^{(R)} \;=\; \frac{\max\!\big(0,\; \tilde{\sigma}_R(i)\big)}{\sum_{j=1}^{11} \max\!\big(0,\; \tilde{\sigma}_R(j)\big)}
\qquad \sum_i w_i^{(R)} = 1
$$

---

## 4. Aggregate position signal

Each sub-strategy emits its own signed score $s_i(t)$. The aggregate is the
weighted mean, clipped to the unit interval:

$$
s(t) \;=\; \mathrm{clip}_{-1}^{1}\!\Big[\sum_{i=1}^{11} w_i^{(R)} \cdot s_i(t)\Big]
$$

---

## 5. Position sizing — risk-first

We size by volatility-targeting, not by signal strength:

$$
\text{contracts}(t) \;=\; \Bigg\lfloor \frac{\rho \cdot \mathrm{NAV}(t) \cdot \big|s(t)\big|}{\mathrm{ATR}_{20}(t) \cdot k_{\text{ES}} \cdot \kappa(t)} \Bigg\rfloor
$$

where:

* $\rho = 0.02$ — max single-trade risk (2% of NAV)
* $k_{\text{ES}} = 50$ — dollar value per ES point
* $\kappa(t)$ — correlation adjustment vs already-open positions

Overlays:

* If $\text{VIX}(t) > 30$: halve the computed size.
* If $\hat{R}_t = \text{Tail-Risk}$: cap notional at 25% of NAV.
* If realised PnL today $\leq -4\%$ of NAV: **halt** (circuit breaker).
* Max concurrent positions: **2**.

---

## 6. Execution

Orders submitted via the [Alpaca Paper Trading API](https://alpaca.markets/docs/trading/paper-trading/). The execution layer is hard-wired to refuse any non-paper endpoint, so the framework **cannot** route real-money orders even with a real API key in the environment.

---

## 7. Inputs to regime detection — full list

| Block | Inputs |
|---|---|
| Macro state | Fed funds rate · 2s10s spread · DXY 5-day return · VIX · 10y real yield · US economic surprise index · HYG–LQD spread · 10y breakeven |
| News summary | 10 headlines · sentiment score · geopolitical risk (GPR daily) · earnings density · FOMC proximity · OPEX flag |
| Cross-asset overlays | gold/copper · DXY · credit spreads |

---

## 8. References

* Caldara, D., & Iacoviello, M. (2022). *Measuring Geopolitical Risk.* American Economic Review, 112(4), 1194–1225. ([Project page](https://www.matteoiacoviello.com/gpr.htm))
* Asness, C. S., Moskowitz, T. J., & Pedersen, L. H. (2013). *Value and Momentum Everywhere.* Journal of Finance, 68(3), 929–985.
* Pedersen, L. H. (2015). *Efficiently Inefficient.* Princeton University Press.
* Anthropic. (2025). *Prompt caching documentation.* [docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
