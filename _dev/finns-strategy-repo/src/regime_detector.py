"""
regime_detector.py
==================

Regime detection layer of Finn's Strategy.

The detector assembles a structured prompt from quantitative macro inputs
plus a sentiment summary of the recent news cycle, and asks the Claude API
to classify the current S&P 500 regime into one of seven labels with a
calibrated confidence score.

Prompt caching is enabled on the system block — the schema, taxonomy and
few-shot examples (~6kt) only get billed once per cache window.

Author : Finn Lakin
License: MIT
"""

from __future__ import annotations

import dataclasses
import json
import os
from typing import List, Literal

import anthropic

RegimeLabel = Literal[
    "Trending-Up",
    "Trending-Down",
    "Mean-Reverting",
    "High-Vol",
    "Range-Bound",
    "Event-Driven",
    "Tail-Risk",
]


@dataclasses.dataclass
class MacroState:
    """Snapshot of the macro/quant inputs fed to the regime prompt."""
    fed_funds_rate: float
    two_ten_spread_bps: float
    dxy_5d_return: float
    vix_level: float
    real_yield_10y: float
    economic_surprise_idx: float
    hyg_lqd_spread_bps: float
    breakeven_10y: float


@dataclasses.dataclass
class NewsSummary:
    """Top-of-funnel news snapshot."""
    headlines: List[str]          # 10 most recent Reuters / Bloomberg headlines
    sentiment_score: float        # -1.0 .. +1.0 from upstream pipeline
    geo_risk_score: float         # Caldara–Iacoviello GPR, normalised
    earnings_density_pct: float   # % of SPX cap reporting this week
    fomc_within_5d: bool
    opex_week: bool


SYSTEM_PROMPT = """You are an expert market-regime classifier.
Given a structured snapshot of macro indicators and a news summary, you
classify the current S&P 500 regime and return a strict JSON object.

<regime_taxonomy>
  <regime name="Trending-Up">Persistent positive drift; ADX > 25; breadth confirming.</regime>
  <regime name="Trending-Down">Persistent negative drift; ADX > 25; risk-off breadth.</regime>
  <regime name="Mean-Reverting">Price oscillates around a clear anchor; reversion edge.</regime>
  <regime name="High-Vol">VIX > 25 or realised vol > 25%; whipsaw conditions.</regime>
  <regime name="Range-Bound">Tight range; ADX < 20; low realised vol.</regime>
  <regime name="Event-Driven">Calendar dominates (FOMC, OPEX, earnings cluster).</regime>
  <regime name="Tail-Risk">Acute geopolitical / systemic risk; safe-haven bid; gap risk.</regime>
</regime_taxonomy>

<output_contract>
Return ONLY a single JSON object with this schema. No prose.
{
  "regime":     "Trending-Up" | ...,
  "confidence": float in [0, 1],
  "reasoning":  string  // <= 240 chars
}
</output_contract>

<rules>
- Ground every classification in the provided indicators. Do not speculate.
- If macro and news strongly conflict, prefer the news signal when geo_risk_score > 0.6.
- VIX > 30 with breakeven widening should lean toward Tail-Risk.
- Confidence must reflect indicator alignment, not the assistant's bias.
</rules>
"""


def build_user_prompt(macro: MacroState, news: NewsSummary) -> str:
    return f"""<macro>
fed_funds_rate={macro.fed_funds_rate:.2f}
two_ten_spread_bps={macro.two_ten_spread_bps:.1f}
dxy_5d_return={macro.dxy_5d_return:+.2%}
vix={macro.vix_level:.1f}
real_yield_10y={macro.real_yield_10y:.2f}
econ_surprise_idx={macro.economic_surprise_idx:+.1f}
hyg_lqd_spread_bps={macro.hyg_lqd_spread_bps:.0f}
breakeven_10y={macro.breakeven_10y:.2f}
</macro>

<news>
sentiment={news.sentiment_score:+.2f}
geo_risk={news.geo_risk_score:.2f}
earnings_density_pct={news.earnings_density_pct:.0f}
fomc_within_5d={str(news.fomc_within_5d).lower()}
opex_week={str(news.opex_week).lower()}
headlines:
""" + "\n".join(f"  - {h}" for h in news.headlines) + "\n</news>"


def detect_regime(macro: MacroState, news: NewsSummary) -> dict:
    """Classify the current regime via the Claude API.

    Uses prompt caching on the system block — the schema + taxonomy + few-shot
    examples only get billed once per 5-minute cache window.
    """
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {"role": "user", "content": build_user_prompt(macro, news)},
        ],
    )
    raw = resp.content[0].text.strip()
    # Defensive: strip any accidental code-fence wrappers
    if raw.startswith("```"):
        raw = raw.strip("`").lstrip("json").strip()
    parsed = json.loads(raw)

    if parsed["regime"] not in (
        "Trending-Up", "Trending-Down", "Mean-Reverting", "High-Vol",
        "Range-Bound", "Event-Driven", "Tail-Risk",
    ):
        raise ValueError(f"unknown regime returned: {parsed!r}")
    if not 0.0 <= parsed["confidence"] <= 1.0:
        raise ValueError(f"confidence out of bounds: {parsed!r}")
    return parsed


if __name__ == "__main__":
    demo_macro = MacroState(
        fed_funds_rate=5.375,
        two_ten_spread_bps=-22.0,
        dxy_5d_return=0.0035,
        vix_level=28.4,
        real_yield_10y=2.05,
        economic_surprise_idx=-12.6,
        hyg_lqd_spread_bps=312.0,
        breakeven_10y=2.31,
    )
    demo_news = NewsSummary(
        headlines=[
            "Israel-Iran tensions escalate following overnight strikes",
            "Brent crude jumps 5.6% on supply concerns",
            "Fed minutes show divided views on rate cuts",
            "S&P 500 falls 1.8% in afternoon session",
            "Treasuries rally on safe-haven flow",
            "Gold breaks $2,400 intraday high",
            "VIX touches 30 for first time in a month",
            "Putin: Russia to expand strategic reserves",
            "Bitcoin slumps 4.2% as risk-off bid intensifies",
            "ECB officials warn on geopolitical inflation risk",
        ],
        sentiment_score=-0.62,
        geo_risk_score=0.78,
        earnings_density_pct=8.0,
        fomc_within_5d=False,
        opex_week=False,
    )
    print(json.dumps(detect_regime(demo_macro, demo_news), indent=2))
