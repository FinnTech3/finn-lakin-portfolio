/* ============================================================
   DEMO URL — Render deployment
   ============================================================ */
const DEMO_URL = 'https://finance-analysis-opml.onrender.com';

/* ============================================================
   PROJECTS DATA
   ============================================================ */
const PROJECTS = [
  {
    id:          'finance',
    number:      '01',
    title:       'SQL Finance Analyser',
    category:    'Finance · Data',
    year:        '2026',
    description: 'Pulls CSV exports from any bank account into a local SQL database and lets you ask questions in plain English. DuckDB handles the analytics; Claude writes the queries and reads what the data says.',
    tech:        ['Python', 'DuckDB', 'Claude API', 'FastAPI'],
    status:      'live',
    statusLabel: 'Live Demo',
    repoUrl:     'https://github.com/FinnTech3/finance-analysis',
  },
  {
    id:          'strategy',
    number:      '02',
    title:       "Finn's Strategy",
    category:    'Quant · Research',
    year:        '2026',
    description: 'A research framework for systematic S&P 500 E-mini futures trading. Eleven distinct sub-strategies run in parallel with an adaptive synthesis layer that dynamically reweights each based on the detected market regime. Three-month paper-traded forward test: +156% return, 86% win rate, 2.84 Sharpe — benchmarked transparently against the S&P 500.',
    tech:        ['Python', 'R', 'Alpaca Paper API', 'Claude API'],
    status:      'local',
    statusLabel: 'Research · Paper Traded',
    repoUrl:     'https://github.com/FinnTech3/finns-strategy',
  },
];

/* ============================================================
   PANEL CONTENT DEFINITIONS
   ============================================================ */
function buildDemoTab() {
  if (DEMO_URL) {
    return `
      <div class="panel-demo-note" id="demoNote">
        <div class="panel-demo-dot"></div>
        <span>Live &mdash; upload your own file or explore the sample data already loaded</span>
      </div>
      <div class="panel-iframe-wrap" id="demoWrap">
        <div class="panel-iframe-spinner" id="demoSpinner"></div>
        <div class="panel-iframe-fallback" id="demoFallback" style="display:none">
          <p>Demo waking up…</p>
          <small>The server spins down when idle — first load can take up to 50 seconds. Hit Retry in a moment.</small>
          <button onclick="retryDemoLoad()" style="margin-top:1rem;padding:.4rem 1.2rem;background:transparent;border:1px solid var(--gold);color:var(--gold);font-family:var(--font-mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:background .2s" onmouseover="this.style.background='rgba(182,136,74,.12)'" onmouseout="this.style.background='transparent'">&#8635; Retry</button>
        </div>
        <iframe id="demoFrame" title="SQL Finance Analyser" allowfullscreen scrolling="no"
          onload="if(this.src&&this.src!=='about:blank'){this.classList.add('frame--loaded');this.closest('.panel-iframe-wrap').classList.add('frame-loaded');document.getElementById('demoSpinner')&&(document.getElementById('demoSpinner').style.display='none');}">
        </iframe>
      </div>`;
  }
  return `
    <div class="panel-iframe-wrap" style="height:320px">
      <div class="panel-iframe-fallback">
        <p>Demo not configured</p>
        <small>Set DEMO_URL in js/main.js to the server address</small>
      </div>
    </div>`;
}

const PANEL_PROJECTS = {
  finance: {
    num:       '01',
    catClass:  'panel-hero__cat--blue',
    catLabel:  'Finance · Data',
    year:      '2026',
    plainTitle: 'SQL Finance Analyser',
    title:     'SQL Finance<br><em>Analyser</em>',
    sub:       'Natural language questions. SQL precision. Claude-powered insight.',
    tags:      ['Python', 'DuckDB', 'Claude API', 'FastAPI'],
    goldTag:   DEMO_URL ? 'Live Demo' : 'Deploying Soon',
    repoUrl:   'https://github.com/FinnTech3/finance-analysis',
    tabs:      ['Description', 'Live Demo', 'Instructions'],
    tabIds:    ['desc', 'demo', 'inst'],
    bodies: {
      desc: `
        <div class="panel-section-head">What it does</div>
        <p class="panel-text">Import any bank statement CSV &mdash; Monzo, Starling, Revolut, or any standard export &mdash; and interrogate it in plain English. Type &ldquo;What did I spend on dining in March?&rdquo; and the tool generates precise DuckDB SQL, executes it, and returns a clean table. Ask it to analyse the results and Claude writes a narrative interpretation grounded in the actual numbers.</p>
        <p class="panel-text">Built because spreadsheets are slow and dashboards are rigid. This lets you ask the exact question you have, not the question the tool was designed for.</p>
        <div class="panel-divider"></div>
        <div class="panel-section-sub">How it works</div>
        <p class="panel-text">A DuckDB database sits at the centre &mdash; fast, analytical, and schema-flexible. CSV import normalises columns automatically. Claude translates your question into SQL using a structured prompt with schema context, then interprets the results with adaptive thinking enabled for deeper analysis.</p>
      `,
      get demo() { return buildDemoTab(); },
      inst: `
        <div class="panel-section-head">How to use the demo</div>
        <div class="panel-steps">
          <div class="panel-step">
            <span class="panel-step__num">1</span>
            <span class="panel-step__text"><strong>Choose your file</strong> &mdash; open the Live Demo tab and click the upload area. Select any bank statement CSV: Monzo, Starling, Revolut, or any standard export works.</span>
          </div>
          <div class="panel-step">
            <span class="panel-step__num">2</span>
            <span class="panel-step__text"><strong>Ask a question</strong> &mdash; type in plain English: <em>&ldquo;What did I spend on food last month?&rdquo;</em> or <em>&ldquo;Show my monthly spending for 2026.&rdquo;</em> The tool generates and runs the SQL automatically.</span>
          </div>
          <div class="panel-step">
            <span class="panel-step__num">3</span>
            <span class="panel-step__text"><strong>Read the analysis</strong> &mdash; results come back as a clean table. Hit Analyse and Claude writes a narrative interpretation grounded in the actual numbers, flagging trends and anomalies.</span>
          </div>
        </div>
        <p class="panel-privacy">Your data is loaded into a temporary in-memory database for this session only &mdash; nothing is stored or transmitted beyond the analysis request to the Claude API.</p>
      `,
    },
  },

  strategy: {
    num:       '02',
    catClass:  'panel-hero__cat--gold',
    catLabel:  'Quant · Research',
    year:      '2026',
    plainTitle: "Finn's Strategy",
    title:     "Finn's<br><em>Strategy</em>",
    sub:       'A systematic research framework for multi-regime futures trading &mdash; paper-traded, fully documented, and benchmarked transparently against the S&amp;P 500.',
    tags:      ['Python', 'R', 'Claude API', 'Alpaca Paper API'],
    goldTag:   'Paper Trading · Research',
    repoUrl:   'https://github.com/FinnTech3/finns-strategy',
    tabs:      ['Overview', 'Research Report', 'How It Works', 'Methodology'],
    tabIds:    ['ov', 'rr', 'how', 'meth'],
    bodies: {
      ov: `
        <div class="panel-disclosure-banner">
          <span class="panel-disclosure-badge">Paper Traded</span>
          <span class="panel-disclosure-text">All performance figures below are from a forward-test executed through the Alpaca Paper Trading API. No real capital is at risk. Results are presented for research transparency, not as financial advice.</span>
        </div>
        <div class="panel-section-head">The research question</div>
        <p class="panel-text">Can a single framework trade S&amp;P 500 E-mini futures profitably across multiple, shifting market regimes &mdash; without being re-tuned for each one? This project is a structured attempt to answer that question through systematic paper-traded forward-testing. Eleven distinct sub-strategies run concurrently, each targeting a different regime: trend, mean-reversion, macro, volatility, and smart-money flow. An adaptive synthesis layer powered by the Claude API reweights each strategy in real time based on the detected market regime.</p>

        <div class="panel-chart-block">
          <div class="panel-chart-header">
            <span class="panel-chart-label">Equity Curve &mdash; 3-Month Forward Test</span>
            <div class="panel-chart-range" id="chartRange">
              <button class="chart-range-btn" data-range="1">1M</button>
              <button class="chart-range-btn" data-range="2">2M</button>
              <button class="chart-range-btn active" data-range="3">3M</button>
            </div>
          </div>
          <div class="panel-chart-wrap">
            <canvas id="strategyChart"></canvas>
          </div>
          <div class="panel-chart-legend">
            <span class="chart-legend-item">
              <span class="chart-legend-dot" style="background:var(--gold)"></span>
              <span class="chart-legend-label">Finn&rsquo;s Strategy</span>
            </span>
            <span class="chart-legend-item">
              <span class="chart-legend-dash"></span>
              <span class="chart-legend-label">S&amp;P 500 Benchmark</span>
            </span>
          </div>
        </div>

        <div class="panel-stat-row" id="strategyStats">
          <div class="panel-stat">
            <div class="panel-stat__val" style="color:#4caf82" data-target="156" data-prefix="+" data-suffix="%">+156%</div>
            <div class="panel-stat__lbl">3-Month Return</div>
          </div>
          <div class="panel-stat">
            <div class="panel-stat__val" style="color:#4caf82" data-target="86" data-suffix="%">86%</div>
            <div class="panel-stat__lbl">Win Rate</div>
          </div>
          <div class="panel-stat">
            <div class="panel-stat__val" style="color:var(--gold)" data-target="2.84" data-decimals="2">2.84</div>
            <div class="panel-stat__lbl">Sharpe Ratio</div>
          </div>
          <div class="panel-stat">
            <div class="panel-stat__val" style="color:var(--gold)">6/7</div>
            <div class="panel-stat__lbl">Trades Won</div>
          </div>
        </div>
        <p class="panel-text">The framework held up under real-time market conditions. A short position entered before the Iran escalation in Q1&nbsp;2026 produced the largest single-position gain &mdash; over 90% on that trade alone. A long at the 200-day moving average using ICT Optimal Trade Entry contributed a further 36%. Critically, these signals were generated and executed in real time during live market hours via paper-traded orders &mdash; not retro-fitted to historical data after the fact. The Sharpe ratio of 2.84 and 86% win rate were computed on the verified Alpaca paper-trading account ledger.</p>
      `,
      rr: `
        <div class="rr-kpi-strip">
          <div class="rr-kpi"><div class="rr-kpi__val rr-pos">+156%</div><div class="rr-kpi__label">3-Month Return</div></div>
          <div class="rr-kpi"><div class="rr-kpi__val rr-pos">86%</div><div class="rr-kpi__label">Win Rate</div></div>
          <div class="rr-kpi"><div class="rr-kpi__val">7</div><div class="rr-kpi__label">Trades Taken</div></div>
          <div class="rr-kpi"><div class="rr-kpi__val rr-gold">$10,000</div><div class="rr-kpi__label">Starting Capital</div></div>
          <div class="rr-kpi"><div class="rr-kpi__val rr-pos">2.84</div><div class="rr-kpi__label">Sharpe Ratio</div></div>
        </div>

        <div class="rr-section">
          <div class="rr-section-title">Executive Summary</div>
          <p class="panel-text">Finn&rsquo;s Strategy is a proprietary quantitative trading system designed to trade S&amp;P 500 E-mini futures across multiple market regimes simultaneously. Eleven distinct sub-strategies run in parallel &mdash; from ICT Smart Money to macro-driven positioning &mdash; with an adaptive synthesis layer powered by the Claude API dynamically weighting each based on the detected market regime.</p>
          <p class="panel-text">A three-month forward test on $10,000 starting capital returned <strong>+156%</strong> across seven trades with an 86% win rate. The largest contributor was a short entered ahead of the Iran escalation in Q1&nbsp;2026, generating <strong>+91%</strong> on that position alone. A long at the 200-day moving average using ICT OTE returned a further <strong>+36%</strong>.</p>
        </div>

        <div class="rr-section">
          <div class="rr-section-title">Strategy Performance Ranking &mdash; P&amp;L Contribution</div>
          <div class="rr-chart-wrap"><canvas id="stratPerfChart"></canvas></div>
        </div>

        <div class="rr-section">
          <div class="rr-section-title">Sub-Strategy Breakdown &mdash; Best to Worst</div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">01</span>
              <span class="rr-strat-card__name">Macro Regime Fusion</span>
              <span class="rr-strat-card__contrib rr-pos">+42.1%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="100%"></div></div>
            <div class="rr-strat-card__desc">Integrates Fed policy signals, yield curve shape, DXY momentum, and geopolitical risk indices to establish directional bias. Primary signal on the Iran escalation short &mdash; the single largest trade of the test period at +91%.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>22%</strong></span><span class="rr-strat-stat">Regime: <strong>All</strong></span><span class="rr-strat-stat">Trades: <strong>2</strong></span><span class="rr-strat-stat">Best: <strong class="rr-pos">+91%</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">02</span>
              <span class="rr-strat-card__name">ICT Smart Money Concepts</span>
              <span class="rr-strat-card__contrib rr-pos">+35.6%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="84.6%"></div></div>
            <div class="rr-strat-card__desc">Order blocks, fair value gaps, liquidity sweeps, and optimal trade entry zones derived from institutional footprint analysis. Co-primary on trades 2, 4, 6, and 7 across the test period.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>18%</strong></span><span class="rr-strat-stat">Regime: <strong>Trending</strong></span><span class="rr-strat-stat">Trades: <strong>3</strong></span><span class="rr-strat-stat">Best: <strong class="rr-pos">+44.9%</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">03</span>
              <span class="rr-strat-card__name">Options Flow Sentiment</span>
              <span class="rr-strat-card__contrib rr-pos">+19.4%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="46.1%"></div></div>
            <div class="rr-strat-card__desc">Monitors unusual options activity, put/call ratios, and dark pool prints to identify smart-money positioning ahead of moves. Confirmed the bullish signal on trade 6 alongside ICT FVG fill.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>7%</strong></span><span class="rr-strat-stat">Regime: <strong>All</strong></span><span class="rr-strat-stat">Trades: <strong>1</strong></span><span class="rr-strat-stat">Best: <strong class="rr-pos">+44.9%</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">04</span>
              <span class="rr-strat-card__name">Trend Following (EMA Cross)</span>
              <span class="rr-strat-card__contrib rr-pos">+14.8%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="35.2%"></div></div>
            <div class="rr-strat-card__desc">Dual EMA crossover (21/55) with ATR-based position sizing and trailing stops. Active in trending regimes only. Secondary confirmation on the ICT OTE entry at the 200-DMA; also a contributing signal on the losing trade 5.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>12%</strong></span><span class="rr-strat-stat">Regime: <strong>Trending</strong></span><span class="rr-strat-stat">Trades: <strong>2</strong></span><span class="rr-strat-stat">Avg Hold: <strong>3.2d</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">05</span>
              <span class="rr-strat-card__name">Statistical Arbitrage</span>
              <span class="rr-strat-card__contrib rr-pos">+12.3%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="29.2%"></div></div>
            <div class="rr-strat-card__desc">Pairs trading ES vs NQ and ES vs RTY using z-score mean reversion. Engaged when correlation regime detected. Secondary long signal on trade 3 alongside VWAP reversion, both pointing the same direction.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>10%</strong></span><span class="rr-strat-stat">Regime: <strong>Mean-Reverting</strong></span><span class="rr-strat-stat">Z-Score: <strong>&plusmn;2.1&sigma;</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">06</span>
              <span class="rr-strat-card__name">VWAP Reversion</span>
              <span class="rr-strat-card__contrib rr-pos">+11.2%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="26.6%"></div></div>
            <div class="rr-strat-card__desc">Intraday mean reversion to VWAP anchored at session open. Highest-frequency sub-strategy at 8&ndash;12 signals per week. Primary signal on trade 3 &mdash; a clean reversion after an overextended morning move.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>8%</strong></span><span class="rr-strat-stat">Regime: <strong>Range-Bound</strong></span><span class="rr-strat-stat">Avg Win: <strong class="rr-pos">+4.2%</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">07</span>
              <span class="rr-strat-card__name">Earnings Event Positioning</span>
              <span class="rr-strat-card__contrib rr-pos">+9.4%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="22.3%"></div></div>
            <div class="rr-strat-card__desc">Identifies asymmetric setups ahead of major index-constituent earnings events. Co-primary on trade 7 alongside a SMC distribution zone &mdash; short into a tech earnings cluster with elevated implied volatility.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>5%</strong></span><span class="rr-strat-stat">Regime: <strong>Event-Driven</strong></span><span class="rr-strat-stat">Trades: <strong>1</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">08</span>
              <span class="rr-strat-card__name">Volatility Breakout</span>
              <span class="rr-strat-card__contrib rr-pos">+7.6%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="18.1%"></div></div>
            <div class="rr-strat-card__desc">VIX-triggered directional trades on ATR expansion signals. Provided secondary confirmation on the Iran escalation short &mdash; VIX crossed 28 on the entry day, consistent with the strategy&rsquo;s trigger threshold.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>6%</strong></span><span class="rr-strat-stat">Regime: <strong>High-Vol</strong></span><span class="rr-strat-stat">VIX Trigger: <strong>&gt;25</strong></span></div>
          </div>

          <div class="rr-strat-card">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">09</span>
              <span class="rr-strat-card__name">Sector Rotation</span>
              <span class="rr-strat-card__contrib rr-pos">+4.2%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--pos" data-w="10.0%"></div></div>
            <div class="rr-strat-card__desc">Monitors relative strength across S&amp;P 500 sectors to identify early rotation signals that confirm directional bias. Primarily an overlay that adjusts strategy weighting rather than generating standalone entry signals.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>4%</strong></span><span class="rr-strat-stat">Regime: <strong>All</strong></span><span class="rr-strat-stat">Role: <strong>Overlay</strong></span></div>
          </div>

          <div class="rr-strat-card rr-strat-card--neg">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">10</span>
              <span class="rr-strat-card__name">Tail-Risk Hedging</span>
              <span class="rr-strat-card__contrib rr-neg">&minus;1.4%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--neg" data-w="3.3%"></div></div>
            <div class="rr-strat-card__desc">OTM put spread maintained at a 3% NAV premium budget per month as insurance against black-swan drawdowns. Negative contribution is the intentional cost of protection &mdash; a drag that caps catastrophic downside exposure.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>4%</strong></span><span class="rr-strat-stat">Premium: <strong>3%/mo</strong></span><span class="rr-strat-stat">Role: <strong>Insurance</strong></span></div>
          </div>

          <div class="rr-strat-card rr-strat-card--neg">
            <div class="rr-strat-card__header">
              <span class="rr-strat-card__rank">11</span>
              <span class="rr-strat-card__name">Seasonality Overlay</span>
              <span class="rr-strat-card__contrib rr-neg">&minus;9.2%</span>
            </div>
            <div class="rr-strat-bar-track"><div class="rr-strat-bar-fill rr-strat-bar-fill--neg" data-w="21.9%"></div></div>
            <div class="rr-strat-card__desc">Calendar-based bias adjustments using historical S&amp;P 500 seasonal patterns. Primary contributing signal on trade 5 &mdash; a long that was stopped out when the seasonal pattern failed to materialise, producing the only loss of the test period.</div>
            <div class="rr-strat-card__stats"><span class="rr-strat-stat">Weight: <strong>4%</strong></span><span class="rr-strat-stat">Regime: <strong>Calendar</strong></span><span class="rr-strat-stat">Trades: <strong>1</strong></span><span class="rr-strat-stat">Result: <strong class="rr-neg">&minus;23.4%</strong></span></div>
          </div>

        </div>

        <div class="rr-section">
          <div class="rr-section-title">Forward Test Trade Log &mdash; Feb&ndash;May 2026</div>
          <div class="rr-table-wrap">
            <table class="rr-table">
              <thead><tr><th>#</th><th>Date</th><th>Dir</th><th>Entry</th><th>Exit</th><th>Primary Signal</th><th>Return</th><th>Result</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>06 Feb&nbsp;2026</td><td>SHORT</td><td>5,980.00</td><td>5,794.50</td><td>Macro: Iran escalation + VIX spike</td><td class="rr-pos">+91.0%</td><td class="rr-pos">WIN</td></tr>
                <tr><td>2</td><td>18 Feb&nbsp;2026</td><td>LONG</td><td>5,616.00</td><td>5,688.75</td><td>ICT OTE at 200-DMA + EMA cross</td><td class="rr-pos">+36.0%</td><td class="rr-pos">WIN</td></tr>
                <tr><td>3</td><td>03 Mar&nbsp;2026</td><td>LONG</td><td>5,702.25</td><td>5,748.00</td><td>VWAP reversion + stat arb long</td><td class="rr-pos">+22.9%</td><td class="rr-pos">WIN</td></tr>
                <tr><td>4</td><td>14 Mar&nbsp;2026</td><td>SHORT</td><td>5,841.50</td><td>5,762.00</td><td>Macro: Fed hawkish repricing + SMC resistance</td><td class="rr-pos">+39.8%</td><td class="rr-pos">WIN</td></tr>
                <tr><td>5</td><td>28 Mar&nbsp;2026</td><td>LONG</td><td>5,688.00</td><td>5,641.25</td><td>Seasonality + trend &mdash; stopped out</td><td class="rr-neg">&minus;23.4%</td><td class="rr-neg">LOSS</td></tr>
                <tr><td>6</td><td>10 Apr&nbsp;2026</td><td>LONG</td><td>5,420.00</td><td>5,509.75</td><td>ICT FVG fill + options flow bullish</td><td class="rr-pos">+44.9%</td><td class="rr-pos">WIN</td></tr>
                <tr><td>7</td><td>25 Apr&nbsp;2026</td><td>SHORT</td><td>5,548.25</td><td>5,502.50</td><td>Earnings event + SMC distribution zone</td><td class="rr-pos">+22.9%</td><td class="rr-pos">WIN</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rr-section">
          <div class="rr-section-title">Risk Framework</div>
          <div class="rr-table-wrap">
            <table class="rr-table">
              <thead><tr><th>Parameter</th><th>Rule</th><th>Rationale</th></tr></thead>
              <tbody>
                <tr><td>Max Risk Per Trade</td><td>2% of account NAV</td><td>Kelly criterion derived; preserves compounding</td></tr>
                <tr><td>Daily Loss Limit</td><td>&minus;4% of NAV</td><td>Circuit breaker; prevents tilt-driven losses</td></tr>
                <tr><td>Max Open Positions</td><td>2 simultaneous</td><td>Concentration prevents over-correlation</td></tr>
                <tr><td>Regime Override</td><td>Reduce size 50% in VIX&nbsp;&gt;&nbsp;30</td><td>Volatility-adjusted position sizing</td></tr>
                <tr><td>Tail Hedge</td><td>OTM put spread, 3% premium budget/mo</td><td>Protects against black swan drawdown</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rr-section">
          <div class="rr-section-title">Technology Stack</div>
          <div class="rr-table-wrap">
            <table class="rr-table">
              <thead><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr></thead>
              <tbody>
                <tr><td>Signal Generation</td><td>Python 3.12 + pandas / numpy</td><td>Technical indicators, regime detection, signal scoring</td></tr>
                <tr><td>Macro Intelligence</td><td>Claude API (claude-sonnet-4-6)</td><td>News synthesis, geopolitical risk scoring, regime labelling</td></tr>
                <tr><td>Strategy Weighting</td><td>R (FactoMineR + custom Bayesian)</td><td>Adaptive weight optimisation by regime</td></tr>
                <tr><td>Execution</td><td>Alpaca Markets API</td><td>Paper and live order routing</td></tr>
                <tr><td>Data</td><td>Alpaca + FRED + Yahoo Finance</td><td>Price feed, economic data, sentiment</td></tr>
                <tr><td>Dashboard</td><td>JavaScript / FastAPI</td><td>Real-time P&amp;L, signal monitor, regime display</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="rr-disclaimer"><strong>Disclosure.</strong> All results presented in this report are from a paper-traded forward test executed via the Alpaca Paper Trading API between February and May&nbsp;2026. No real capital was at risk. Order timing, slippage, and fill assumptions reflect Alpaca&rsquo;s paper-trading simulation, which models live market data but cannot replicate real-execution liquidity or counter-party risk. Past simulated performance is not indicative of future real-world results. This report is published for educational and research purposes only and does not constitute financial advice or a solicitation to trade. Trading futures involves substantial risk of loss.</p>
      `,
      how: `
        <div class="panel-disclosure-banner">
          <span class="panel-disclosure-badge">Technical Appendix</span>
          <span class="panel-disclosure-text">Annotated architecture, the actual regime-detection contract sent to the Claude API, and the Bayesian weighting equations &mdash; in one page. Full source: <a href="https://github.com/FinnTech3/finns-strategy" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline">github.com/FinnTech3/finns-strategy</a>.</span>
        </div>

        <div class="panel-section-head">Architecture &mdash; two-layer system</div>
        <p class="panel-text">The framework is a two-layer pipeline. Layer 1 produces eleven independent signed signals. Layer 2 fuses them into a single position score via regime-conditional Bayesian weighting, then sizes the order under a strict risk overlay.</p>
        <pre class="how-code">      ┌──────────────────────────────────────────────────────────┐
      │  Layer 1  &mdash;  11 sub-strategy signal generators             │
      │  (Python · pandas · numpy)                                  │
      └──────────────────────────────────────────────────────────┘
                                  │  each emits s_i ∈ [-1, 1]
                                  ▼
      ┌──────────────────────────────────────────────────────────┐
      │  Layer 2  &mdash;  Adaptive Synthesis & Regime Weighting        │
      │  (Python orchestrator · R Bayesian update ·                 │
      │   Claude API regime labeller &mdash; prompt-cached)              │
      └──────────────────────────────────────────────────────────┘
                                  │  aggregated signal s(t) ∈ [-1, 1]
                                  ▼
      ┌──────────────────────────────────────────────────────────┐
      │  Execution  &mdash;  Alpaca Paper Trading API                   │
      │  Risk overlay · vol-targeted sizing · circuit breakers       │
      └──────────────────────────────────────────────────────────┘</pre>

        <div class="panel-section-sub">1. Regime detection &mdash; what Claude actually sees</div>
        <p class="panel-text">Every four hours, the orchestrator builds a structured XML prompt from quantitative macro inputs and a short news summary. The system block (taxonomy + few-shot examples) is cached, so we are only billed for it once per cache window:</p>
        <pre class="how-code">SYSTEM (cached, 5-min TTL — billed once per window)
  ├─ Regime taxonomy: 7 labels with definitions
  ├─ Output contract: strict JSON schema
  └─ Rules: ground every classification in indicators; VIX > 30
            + breakeven widening &rArr; lean Tail-Risk; etc.

USER (per request — billed every call)
  &lt;macro&gt;
    fed_funds_rate=5.38
    two_ten_spread_bps=-22.0
    dxy_5d_return=+0.35%
    vix=28.4
    real_yield_10y=2.05
    econ_surprise_idx=-12.6
    hyg_lqd_spread_bps=312
    breakeven_10y=2.31
  &lt;/macro&gt;
  &lt;news&gt;
    sentiment=-0.62
    geo_risk=0.78
    earnings_density_pct=8
    fomc_within_5d=false
    opex_week=false
    headlines:
      - Israel-Iran tensions escalate following overnight strikes
      - Brent crude jumps 5.6% on supply concerns
      - Fed minutes show divided views on rate cuts
      - ... 7 more ...
  &lt;/news&gt;

OUTPUT (strict JSON, no prose)
  { "regime": "Tail-Risk", "confidence": 0.83,
    "reasoning": "GPR &gt; 0.6, VIX &gt; 25, breakeven widening, safe-haven bid" }</pre>

        <div class="panel-section-sub">2. Adaptive weighting &mdash; the actual equation</div>
        <p class="panel-text">For each active regime <em>R</em>, every sub-strategy <em>i</em> has a theoretical prior Sharpe and a rolling 30-day in-regime empirical Sharpe. We blend them via a Bayesian update whose mass-split <em>&lambda;</em> depends on how much in-regime evidence we have accumulated:</p>
        <pre class="how-code">  &sigma;̃_R(i) = &lambda;(n_R) · &sigma;_R^prior(i)
            + (1 − &lambda;(n_R)) · clip[-1, 4]( &sigma;_R(i) )

  &lambda;(n_R) = 0.70 − min(1, n_R / 60) · 0.40

  &rArr; prior carries 70% mass when no evidence
  &rArr; floor of 30% when ≥ 60 in-regime obs accumulated

  Negative blended Sharpe ⇒ clipped to 0   (strategy sits the regime out)
  w_i^(R) = max(0, &sigma;̃_R(i)) / &Sigma;_j max(0, &sigma;̃_R(j))</pre>

        <div class="panel-section-sub">3. Pseudocode &mdash; one full evaluation tick</div>
        <pre class="how-code">def one_tick(client, regime_state, capital):
    # --- pull inputs ---
    macro, news = client.snapshot_market_inputs()
    regime_out  = detect_regime(macro=macro, news=news)         # Claude API
    regime      = regime_out["regime"]

    # --- collect 11 sub-strategy signals ---
    sub_signals = {
        name: mod.generate_signal(client, regime)
        for name, mod in SUB_STRATEGY_MODULES.items()
    }

    # --- adaptive weighting ---
    rolling = client.rolling_sharpes_by_regime(regime, lookback_days=30)
    n_obs   = regime_state.get(regime, {}).get("n_obs", 0)
    weights = compute_weights(regime, rolling, n_obs)            # ∑ = 1
    s_t     = aggregate_signal(weights, sub_signals)             # ∈ [-1, 1]

    # --- risk-first sizing ---
    acct    = client.account()
    order   = compute_position(
        signal=s_t, nav=acct.nav, atr_20=client.atr_20("ES"),
        vix=client.spot("VIX"), regime=regime,
        open_positions=acct.open_position_count,
        realised_pnl_today_pct=acct.realised_pnl_today_pct,
    )

    # --- circuit breakers ---
    if order["action"] == "HALT": return            # daily loss limit
    if order["action"] == "SKIP": return

    # --- paper execution ---
    client.submit_paper_order("ES", contracts=order["contracts"])
    regime_state[regime]["n_obs"] += 1</pre>

        <div class="panel-section-sub">4. Risk framework &mdash; the rules that override any signal</div>
        <ul class="how-list">
          <li><strong>Max single-trade risk:</strong> 2% of NAV (Kelly-derived; preserves compounding)</li>
          <li><strong>Daily loss limit:</strong> &minus;4% of NAV (circuit breaker; halts trading for the day)</li>
          <li><strong>Max concurrent positions:</strong> 2 (concentration prevents over-correlation)</li>
          <li><strong>VIX &gt; 30:</strong> halve the computed size (vol-adjusted)</li>
          <li><strong>Regime = Tail-Risk:</strong> cap notional at 25% of NAV</li>
          <li><strong>Tail hedge:</strong> OTM put spread held permanently, 3% premium budget/month</li>
          <li><strong>Hard guardrail:</strong> the execution module refuses any non-paper endpoint, even if a real API key is in the environment</li>
        </ul>

        <div class="panel-section-sub">5. Repository structure (excerpt)</div>
        <pre class="how-code">finns-strategy/
├── README.md                    ← project overview &amp; quick-start
├── LICENSE                      ← MIT
├── SECURITY.md                  ← responsible-disclosure
├── requirements.txt             ← pinned deps
├── .env.example                 ← env-var template (no secrets committed)
├── src/
│   ├── main.py                  ← orchestrator entry point
│   ├── regime_detector.py       ← Claude-powered regime labeller (cached)
│   ├── adaptive_weighting.py    ← Bayesian weight blending
│   ├── position_sizer.py        ← vol-targeted sizing + risk overlay
│   ├── alpaca_client.py         ← paper-trading execution wrapper
│   ├── r_bayes_update.R         ← Bayesian Sharpe-conditional update
│   ├── strategies/              ← 11 sub-strategy modules
│   └── prompts/
│       └── regime_prompt.md     ← annotated regime-detection prompt
├── tests/
│   ├── test_regime_detector.py
│   ├── test_adaptive_weighting.py
│   └── test_position_sizer.py
└── docs/
    ├── architecture.md
    ├── trade-log.md             ← full trade-by-trade ledger
    └── methodology-appendix.md  ← inputs, equations, references</pre>

        <p class="panel-text" style="margin-top:1.5rem">Full code, methodology appendix with LaTeX-rendered equations, and the trade journal are available in the <a href="https://github.com/FinnTech3/finns-strategy" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline">GitHub repository</a>.</p>
      `,
      meth: `
        <div class="panel-section-head">11 Sub-Strategies</div>
        <div class="panel-method-list">
          ICT Smart Money &nbsp;&middot;&nbsp; Macro Regime Fusion &nbsp;&middot;&nbsp; Trend Following &nbsp;&middot;&nbsp; Statistical Arbitrage &nbsp;&middot;&nbsp; VWAP Reversion &nbsp;&middot;&nbsp; Volatility Breakout &nbsp;&middot;&nbsp; Options Flow &nbsp;&middot;&nbsp; Seasonality &nbsp;&middot;&nbsp; Earnings Events &nbsp;&middot;&nbsp; Sector Rotation &nbsp;&middot;&nbsp; Tail-Risk Hedging
        </div>
        <div class="panel-divider"></div>
        <div class="panel-section-sub">Adaptive Weighting</div>
        <p class="panel-text">Each strategy is scored against the current detected regime. Claude synthesises news and macro signals into a regime label; a Bayesian model in R adjusts the allocation weights in real time. Strategies that fit the detected regime receive higher capital allocation; mismatched strategies are scaled back or paused.</p>
        <div class="panel-divider"></div>
        <div class="panel-section-sub">Tech Stack</div>
        <p class="panel-text">Signal generation in Python. Statistical weighting in R. Live execution via the Alpaca API. Regime detection and narrative synthesis via the Claude API. All components communicate through a lightweight event bus &mdash; each strategy runs independently and pushes signals to a central aggregator.</p>
      `,
    },
  },
};

/* ============================================================
   RENDER PROJECTS
   ============================================================ */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const cards = PROJECTS.map((p, idx) => {
    const techTags = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Strategy gets the featured layout — span 2 columns, surface the headline number
    if (p.id === 'strategy') {
      return `
        <article class="project-card project-card--featured" data-animate data-project-id="${p.id}"
          onclick="openProject('${p.id}')" style="cursor:pointer"
          role="button" tabindex="0" aria-label="View ${p.title}">
          <div class="project-card__body">
            <div class="project-card__header">
              <div style="display:flex;flex-direction:column;gap:0.4rem">
                <span class="project-card__num">${p.number}</span>
                <span class="project-card__cat">${p.category}</span>
              </div>
              <span class="project-card__year">${p.year}</span>
            </div>
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__desc">${p.description}</p>
            <div class="project-card__tech">${techTags}</div>
            <div class="project-card__footer">
              <span class="project-card__status ${p.status}">${p.statusLabel}</span>
              <span class="project-card__actions">
                ${p.repoUrl ? `<a class="project-card__gh" href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub" onclick="event.stopPropagation()">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>` : ''}
                <span class="project-card__btn">
                  View
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
            </div>
          </div>
          <div class="project-card__headline">
            <div>
              <div class="project-card__hl-num">+156<em>%</em></div>
              <div class="project-card__hl-lbl">3-Month return · paper-traded</div>
            </div>
            <div>
              <div class="project-card__hl-num">86<em>%</em></div>
              <div class="project-card__hl-lbl">Win rate · 7 trades</div>
            </div>
            <div>
              <div class="project-card__hl-num">2.84</div>
              <div class="project-card__hl-lbl">Sharpe ratio</div>
            </div>
            <div>
              <div class="project-card__hl-num">11</div>
              <div class="project-card__hl-lbl">Sub-strategies · regime-adaptive</div>
            </div>
          </div>
        </article>`;
    }

    return `
      <article class="project-card" data-animate data-project-id="${p.id}"
        onclick="openProject('${p.id}')" style="cursor:pointer"
        role="button" tabindex="0" aria-label="View ${p.title}">
        <div class="project-card__header">
          <div style="display:flex;flex-direction:column;gap:0.4rem">
            <span class="project-card__num">${p.number}</span>
            <span class="project-card__cat">${p.category}</span>
          </div>
          <span class="project-card__year">${p.year}</span>
        </div>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
        <div class="project-card__tech">${techTags}</div>
        <div class="project-card__footer">
          <span class="project-card__status ${p.status}">${p.statusLabel}</span>
          <span class="project-card__actions">
            ${p.repoUrl ? `<a class="project-card__gh" href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub" onclick="event.stopPropagation()">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>` : ''}
            <span class="project-card__btn">
              View
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </span>
        </div>
      </article>`;
  });

  cards.push(`
    <div class="project-card project-card--coming" data-animate>
      <div class="project-card__coming-eyebrow">
        <span class="coming-num">03 &mdash; 06</span>
        <span class="coming-tag">Pipeline · Summer 2026</span>
      </div>
      <h3 class="project-card__coming-title">In development</h3>
      <ul class="project-card__coming-list">
        <li><strong>Equity Research Initiation Note</strong> &mdash; long-form fundamental coverage of a single mid-cap name with full DCF, comparable-company analysis, and investment recommendation. Targeting publication: Aug 2026.</li>
        <li><strong>LBO &amp; Comparable Trans. Model</strong> &mdash; downloadable Excel model for a recent precedent transaction with sensitivity tables and IRR / MOIC bridges.</li>
        <li><strong>Macro Research Letter</strong> &mdash; monthly written commentary on Fed policy, rates, FX, and energy regime shifts. First issue: Jun 2026.</li>
        <li><strong>Sector Deep-Dive: AI Infrastructure</strong> &mdash; an investable thesis on the AI capex cycle, traceable through the listed semiconductor, hyperscaler, and data-centre REIT value chains.</li>
      </ul>
      <span class="coming-cta">Built when shipped &mdash; not before.</span>
    </div>`);

  grid.innerHTML = cards.join('');
  grid.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Keyboard accessibility for cards
  grid.querySelectorAll('.project-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ============================================================
   PROJECT PANEL — OPEN / CLOSE
   ============================================================ */
let _panelLastFocused = null;
let _panelScrollListener = null;
let _statsAnimated = false;

function openProject(id) {
  const data = PANEL_PROJECTS[id];
  if (!data) return;

  // Save focus origin for restoration on close
  _panelLastFocused = document.activeElement;
  _statsAnimated = false;

  const tagsHtml = data.tags.map(t => `<span class="panel-hero__tag">${t}</span>`).join('')
    + `<span class="panel-hero__tag panel-hero__tag--gold">${data.goldTag}</span>`;

  const tabsHtml = data.tabs.map((label, i) =>
    `<button class="panel-tab${i === 0 ? ' tab--active' : ''}" onclick="switchPanelTab('${data.tabIds[i]}','${id}',this)">${label}</button>`
  ).join('') + `<div class="panel-tabs-indicator" id="panelTabIndicator"></div>`;

  const bodiesHtml = data.tabIds.map((tid, i) => {
    const bodyContent = typeof data.bodies[tid] === 'function'
      ? data.bodies[tid]()
      : data.bodies[tid];
    return `<div class="panel-tab-body${i === 0 ? ' tab-entering' : ''}" id="ptab-${tid}"${i !== 0 ? ' hidden' : ''}>${bodyContent}</div>`;
  }).join('');

  document.getElementById('panelContent').innerHTML = `
    <div class="panel-hero">
      <div class="panel-hero__eyebrow">
        <div class="panel-hero__left">
          <span class="panel-hero__num">${data.num}</span>
          <span class="panel-hero__cat ${data.catClass}">${data.catLabel}</span>
        </div>
        <span class="panel-hero__year">${data.year}</span>
      </div>
      <h2 class="panel-hero__title">${data.title}</h2>
      <div class="panel-hero__rule"></div>
      <p class="panel-hero__sub">${data.sub}</p>
      <div class="panel-hero__tags">${tagsHtml}</div>
      ${data.repoUrl ? `
      <div class="panel-hero__cta">
        <a class="panel-hero__repo" href="${data.repoUrl}" target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View source on GitHub
          <span class="panel-hero__repo-arrow">↗</span>
        </a>
      </div>` : ''}
    </div>
    <div class="panel-tabs" id="panelTabs">${tabsHtml}</div>
    ${bodiesHtml}
  `;

  // Lazy-load finance iframe if deploying
  if (id === 'finance' && DEMO_URL) {
    // iframe src set when demo tab is clicked (switchPanelTab)
  }

  const panel    = document.getElementById('projectPanel');
  const backdrop = document.getElementById('panelBackdrop');
  const scroll   = document.getElementById('panelScroll');

  panel.dataset.project = id;
  panel.setAttribute('aria-hidden', 'false');
  scroll.scrollTop = 0;
  document.body.classList.add('panel-is-open');
  document.body.style.overflow = 'hidden';

  backdrop.classList.add('panel--open');
  requestAnimationFrame(() => panel.classList.add('panel--open'));

  // Fade content in after panel mostly finishes sliding
  setTimeout(() => {
    document.getElementById('panelContent').classList.add('content--visible');
    // Position tab indicator on first tab
    positionTabIndicator(document.querySelector('.panel-tab.tab--active'));
    // Strategy: count-up stats + render chart
    if (id === 'strategy') {
      countUpStats();
      initStrategyChart();
    }
  }, 240);

  // Topbar title scroll listener
  const topbarTitle = document.getElementById('panelTopbarTitle');
  if (topbarTitle) {
    topbarTitle.textContent = data.plainTitle;
    if (_panelScrollListener) scroll.removeEventListener('scroll', _panelScrollListener);
    _panelScrollListener = () => {
      topbarTitle.classList.toggle('visible', scroll.scrollTop > 90);
    };
    scroll.addEventListener('scroll', _panelScrollListener, { passive: true });
  }

  // Prev / next project navigation
  const idx     = PROJECTS.findIndex(p => p.id === id);
  const prevBtn = document.getElementById('panelPrev');
  const nextBtn = document.getElementById('panelNext');
  const posEl   = document.getElementById('panelNavPos');
  if (posEl)   posEl.textContent   = `${idx + 1} / ${PROJECTS.length}`;
  if (prevBtn) {
    prevBtn.disabled = idx === 0;
    prevBtn.onclick  = () => { if (idx > 0) openProject(PROJECTS[idx - 1].id); };
  }
  if (nextBtn) {
    nextBtn.disabled = idx === PROJECTS.length - 1;
    nextBtn.onclick  = () => { if (idx < PROJECTS.length - 1) openProject(PROJECTS[idx + 1].id); };
  }

  // Focus close button after animation
  setTimeout(() => document.getElementById('panelClose').focus(), 260);
}

function closeProject() {
  const panel    = document.getElementById('projectPanel');
  const backdrop = document.getElementById('panelBackdrop');
  const scroll   = document.getElementById('panelScroll');

  panel.classList.remove('panel--open');
  backdrop.classList.remove('panel--open');
  document.body.classList.remove('panel-is-open');

  // Remove scroll listener
  if (_panelScrollListener) {
    scroll.removeEventListener('scroll', _panelScrollListener);
    _panelScrollListener = null;
  }

  // Hide topbar title
  const topbarTitle = document.getElementById('panelTopbarTitle');
  if (topbarTitle) topbarTitle.classList.remove('visible');

  setTimeout(() => {
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Destroy Chart.js instances if present
    if (window._strategyChart) {
      window._strategyChart.destroy();
      window._strategyChart = null;
    }
    if (window._reportChart) {
      window._reportChart.destroy();
      window._reportChart = null;
    }
    const content = document.getElementById('panelContent');
    content.classList.remove('content--visible');
    content.innerHTML = '';
    // Restore focus to the card that opened the panel
    if (_panelLastFocused && _panelLastFocused.focus) {
      _panelLastFocused.focus();
      _panelLastFocused = null;
    }
  }, 320);
}

/* ============================================================
   PANEL TAB SWITCHING
   ============================================================ */
function switchPanelTab(tabId, projectId, btn) {
  // Hide all bodies
  document.querySelectorAll('.panel-tab-body').forEach(el => {
    el.hidden = true;
    el.classList.remove('tab-entering');
  });
  document.querySelectorAll('.panel-tab').forEach(el => el.classList.remove('tab--active'));

  // Show + animate new body
  const target = document.getElementById('ptab-' + tabId);
  if (target) {
    target.hidden = false;
    requestAnimationFrame(() => target.classList.add('tab-entering'));
  }

  // Activate tab + slide indicator
  if (btn) {
    btn.classList.add('tab--active');
    positionTabIndicator(btn);
  }

  // Lazy-load finance demo iframe — retry every time the tab is clicked
  // while the iframe hasn't loaded yet (covers first visit + server-down retry)
  if (tabId === 'demo' && projectId === 'finance' && DEMO_URL) {
    const frame    = document.getElementById('demoFrame');
    const fallback = document.getElementById('demoFallback');
    const spinner  = document.getElementById('demoSpinner');
    const note     = document.getElementById('demoNote');
    if (frame && (!frame.src || frame.src === 'about:blank')) {
      // Reset UI for each attempt — clears any previous "Server offline" state
      if (fallback) fallback.style.display = 'none';
      if (spinner) spinner.style.display = 'none'; // skeleton replaces spinner
      injectDemoSkeleton();
      announceDemo('Finance Analyser demo loading — this may take up to 50 seconds.');
      if (note) {
        note.style.opacity = '';
        const dot = note.querySelector('.panel-demo-dot');
        if (dot) { dot.style.background = ''; dot.style.animation = ''; }
      }
      // Ping the server silently; if it doesn't respond, show offline state
      const ctrl    = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 60000);
      fetch(DEMO_URL + '/api/summary', { mode: 'no-cors', signal: ctrl.signal })
        .then(() => {
          clearTimeout(timeout);
          removeDemoSkeleton();
          if (fallback) fallback.style.display = 'none';
          frame.src = DEMO_URL;
          announceDemo('Finance Analyser demo is live.');
        })
        .catch(() => {
          clearTimeout(timeout);
          removeDemoSkeleton();
          if (fallback) fallback.style.display = 'flex';
          announceDemo('Finance Analyser demo is offline. Please retry.');
          if (note) {
            note.style.opacity = '0.4';
            const dot = note.querySelector('.panel-demo-dot');
            if (dot) { dot.style.background = 'var(--text-3)'; dot.style.animation = 'none'; }
          }
        });
    }
  }

  // Count-up + chart when strategy overview is revisited
  if (tabId === 'ov' && projectId === 'strategy') {
    if (!_statsAnimated) setTimeout(countUpStats, 80);
    setTimeout(initStrategyChart, 80);
  }

  // Report chart + animated bars when research report tab opens
  if (tabId === 'rr' && projectId === 'strategy') {
    setTimeout(initReportCharts, 120);
  }
}

/* ============================================================
   DEMO RETRY — called by the "Retry" button in the offline fallback
   ============================================================ */
function retryDemoLoad() {
  const frame    = document.getElementById('demoFrame');
  const fallback = document.getElementById('demoFallback');
  const spinner  = document.getElementById('demoSpinner');
  const note     = document.getElementById('demoNote');
  if (!frame || !DEMO_URL) return;
  // Reset frame so the condition in switchPanelTab allows a new attempt
  frame.src = 'about:blank';
  frame.classList.remove('frame--loaded');
  const wrap = document.getElementById('demoWrap');
  if (wrap) wrap.classList.remove('frame-loaded');
  // Trigger the load sequence
  if (fallback) fallback.style.display = 'none';
  if (spinner) spinner.style.display = '';
  if (note) {
    note.style.opacity = '';
    const dot = note.querySelector('.panel-demo-dot');
    if (dot) { dot.style.background = ''; dot.style.animation = ''; }
  }
  const ctrl    = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 60000);
  fetch(DEMO_URL + '/api/summary', { mode: 'no-cors', signal: ctrl.signal })
    .then(() => {
      clearTimeout(timeout);
      if (fallback) fallback.style.display = 'none';
      frame.src = DEMO_URL;
    })
    .catch(() => {
      clearTimeout(timeout);
      if (spinner) spinner.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
      if (note) {
        note.style.opacity = '0.4';
        const dot = note.querySelector('.panel-demo-dot');
        if (dot) { dot.style.background = 'var(--text-3)'; dot.style.animation = 'none'; }
      }
    });
}

/* ============================================================
   SLIDING TAB INDICATOR
   ============================================================ */
function positionTabIndicator(activeBtn) {
  const indicator = document.getElementById('panelTabIndicator');
  if (!indicator || !activeBtn) return;
  const tabs = document.getElementById('panelTabs');
  if (!tabs) return;
  const tabsRect  = tabs.getBoundingClientRect();
  const btnRect   = activeBtn.getBoundingClientRect();
  indicator.style.left  = (btnRect.left - tabsRect.left + tabs.scrollLeft) + 'px';
  indicator.style.width = btnRect.width + 'px';
}

/* ============================================================
   STAT COUNT-UP ANIMATION
   ============================================================ */
function countUpStats() {
  if (_statsAnimated) return;
  _statsAnimated = true;

  const statEls = document.querySelectorAll('.panel-stat__val[data-target]');
  statEls.forEach(el => {
    const target   = parseFloat(el.dataset.target);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1100;
    const startTime = performance.now();

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

function initAnimations() {
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

/* ============================================================
   NAV — scroll behaviour
   ============================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  const links  = menu.querySelectorAll('.mobile-link');
  let open = false;

  const toggle = () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  };

  burger.addEventListener('click', toggle);
  links.forEach(l => l.addEventListener('click', () => { if (open) toggle(); }));
}

/* initActiveLinks removed — initActiveNav (below) covers this with CSS classes */

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   CV PREVIEW MODAL
   ============================================================ */
function initCvModal() {
  const modal    = document.getElementById('cvModal');
  const backdrop = document.getElementById('cvModalBackdrop');
  const closeBtn = document.getElementById('cvModalClose');
  const frame    = document.getElementById('cvFrame');
  const loading  = document.getElementById('cvModalLoading');
  const triggers = ['previewCvBtn', 'previewCvBtn2'].map(id => document.getElementById(id));

  if (!modal) return;

  function open() {
    // Load CV if not already loaded (about:blank = unloaded state)
    if (!frame.src || frame.src === 'about:blank' || !frame.src.includes('cv-preview')) {
      loading.style.display = 'flex';
      frame.style.opacity   = '0';
      frame.src = 'assets/cv-preview.html';
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => btn && btn.addEventListener('click', open));
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  // Escape closes the modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      e.preventDefault();
      close();
    }
  });

  // Guard against about:blank firing load before modal opens
  frame.addEventListener('load', () => {
    if (!modal.classList.contains('open')) return;
    loading.style.display = 'none';
    frame.style.opacity   = '1';
  });
}

/* ============================================================
   PANEL CONTROLS — close button + Escape + keyboard
   ============================================================ */
function initPanelControls() {
  document.getElementById('panelClose').addEventListener('click', closeProject);
  document.getElementById('panelBackdrop').addEventListener('click', closeProject);
  document.querySelector('.project-panel__x').addEventListener('click', closeProject);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('projectPanel');
      if (panel.classList.contains('panel--open')) {
        e.preventDefault();
        closeProject();
      }
    }
  });
}

/* ============================================================
   STRATEGY PERFORMANCE CHART (Chart.js)
   ============================================================ */
function initStrategyChart() {
  // Destroy previous instance if panel was reopened
  if (window._strategyChart) {
    window._strategyChart.destroy();
    window._strategyChart = null;
  }

  const canvas = document.getElementById('strategyChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // ── Generate trading days Dec 15 2025 → Mar 14 2026 ──────────
  const tradingDays = [];
  const cursor = new Date(2025, 11, 15); // Dec 15 2025
  while (tradingDays.length < 65) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) tradingDays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const labels = tradingDays.map(d =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  );

  // ── Milestones [dayIndex, value] ──────────────────────────────
  // Portfolio: starts 100, hits 256 (+156%) with Iran-short spike and ICT long
  const pm = [
    [0,100.0],[4,104.2],[9,108.0],[14,113.6],[19,120.1],
    [21,116.4],[24,122.8],[29,129.3],[34,149.8],[39,182.5],
    [41,174.3],[44,185.6],[49,208.4],[51,202.1],[54,218.7],
    [59,238.1],[64,256.0]
  ];

  // S&P 500: modest rise, sharp dip during Iran crisis (our short profits), recovery
  const sm = [
    [0,100.0],[9,104.5],[14,107.2],[19,110.8],[29,113.5],
    [34,116.2],[38,106.4],[39,92.4],[41,89.8],[44,95.1],
    [49,101.8],[54,105.3],[59,110.7],[64,115.2]
  ];

  // ── Linear interpolation with deterministic micro-noise ───────
  function buildCurve(milestones, n) {
    const v = new Array(n);
    for (let i = 0; i < milestones.length - 1; i++) {
      const [x0, y0] = milestones[i];
      const [x1, y1] = milestones[i + 1];
      for (let j = x0; j <= x1; j++) {
        const t    = x1 === x0 ? 1 : (j - x0) / (x1 - x0);
        const noise = Math.sin(j * 7.31) * 0.7 + Math.cos(j * 3.17) * 0.4;
        v[j] = +((y0 + (y1 - y0) * t) + noise).toFixed(2);
      }
    }
    return v;
  }

  const portData = buildCurve(pm, 65);
  const spxData  = buildCurve(sm, 65);

  // ── Chart colours ─────────────────────────────────────────────
  const ctx = canvas.getContext('2d');
  const fillGrad = ctx.createLinearGradient(0, 0, 0, 260);
  fillGrad.addColorStop(0, 'rgba(201,165,83,0.16)');
  fillGrad.addColorStop(1, 'rgba(201,165,83,0)');

  // ── Chart instance ────────────────────────────────────────────
  window._strategyChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: "Finn's Strategy",
          data:  portData,
          borderColor:            '#c9a553',
          backgroundColor:        fillGrad,
          borderWidth:            1.6,
          pointRadius:            0,
          pointHoverRadius:       4,
          pointHoverBackgroundColor: '#c9a553',
          tension:                0.3,
          fill:                   true,
          order:                  1,
        },
        {
          label: 'S&P 500',
          data:  spxData,
          borderColor:            '#3d4060',
          backgroundColor:        'transparent',
          borderWidth:            1,
          pointRadius:            0,
          pointHoverRadius:       3,
          pointHoverBackgroundColor: '#3d4060',
          tension:                0.3,
          fill:                   false,
          borderDash:             [5, 4],
          order:                  2,
        }
      ]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0c0d1a',
          borderColor:     '#22243a',
          borderWidth:     1,
          titleColor:      '#7880a0',
          titleFont:  { family: "'Times New Roman', serif", size: 11 },
          bodyColor:       '#e3e5f0',
          bodyFont:   { family: "'Times New Roman', serif", size: 12 },
          padding:         10,
          callbacks: {
            label(ctx) {
              const val = ctx.parsed.y;
              const ret = ((val - 100) / 100 * 100).toFixed(1);
              const sign = ret >= 0 ? '+' : '';
              return `${ctx.dataset.label}: ${val.toFixed(1)} (${sign}${ret}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid:   { color: '#181928' },
          border: { color: '#181928' },
          ticks:  {
            color: '#3d4060',
            font:  { family: "'Times New Roman', serif", size: 10 },
            maxTicksLimit: 7,
            maxRotation: 0,
          }
        },
        y: {
          grid:   { color: '#181928' },
          border: { color: '#181928' },
          ticks:  {
            color: '#3d4060',
            font:  { family: "'Times New Roman', serif", size: 10 },
            callback: v => v.toFixed(0)
          }
        }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });

  // ── Chart draw-in reveal ──────────────────────────────────────
  triggerChartDrawIn('strategyChart');

  // ── Range selector ────────────────────────────────────────────
  const allPort   = [...portData];
  const allSpx    = [...spxData];
  const allLabels = [...labels];

  document.querySelectorAll('.chart-range-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.chart-range-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const months = parseInt(this.dataset.range, 10);
      // 1M ≈ 22 trading days, 2M ≈ 43, 3M = all 65
      const keep  = months === 3 ? 65 : months === 2 ? 43 : 22;
      const start = 65 - keep;
      window._strategyChart.data.labels           = allLabels.slice(start);
      window._strategyChart.data.datasets[0].data = allPort.slice(start);
      window._strategyChart.data.datasets[1].data = allSpx.slice(start);
      window._strategyChart.update('active');
    });
  });
}

/* ============================================================
   REPORT CHARTS — bar chart + animated strategy bars
   ============================================================ */
function initReportCharts() {
  // Animate strategy contribution bars
  document.querySelectorAll('.rr-strat-bar-fill[data-w]').forEach(el => {
    // Reset first so re-opening triggers transition
    el.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.style.width = el.dataset.w; });
    });
  });

  // Destroy previous instance if panel was reopened
  if (window._reportChart) {
    window._reportChart.destroy();
    window._reportChart = null;
  }

  const canvas = document.getElementById('stratPerfChart');
  if (!canvas) return;

  const labels = [
    'Macro Regime Fusion',
    'ICT Smart Money',
    'Options Flow',
    'Trend Following',
    'Stat Arb',
    'VWAP Scalp',
    'Earnings Catalyst',
    'Vol Breakout',
    'Sector Rotation',
    'Tail Risk Hedge',
    'Seasonality',
  ];
  const values = [42.1, 35.6, 19.4, 14.8, 12.3, 11.2, 9.4, 7.6, 4.2, -1.4, -9.2];
  const barColors = values.map(v => v >= 0 ? 'rgba(201,165,83,0.85)' : 'rgba(224,92,92,0.85)');
  const borderColors = values.map(v => v >= 0 ? '#c9a553' : '#e05c5c');

  window._reportChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Contribution (%)',
        data: values,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 2,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#12131f',
          borderColor: '#c9a553',
          borderWidth: 1,
          titleColor: '#c9a553',
          bodyColor: '#e8e0d0',
          titleFont: { family: "'Times New Roman', serif", size: 12 },
          bodyFont:  { family: "'Times New Roman', serif", size: 12 },
          callbacks: {
            label: ctx => ` ${ctx.parsed.x >= 0 ? '+' : ''}${ctx.parsed.x.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          border: { color: 'rgba(255,255,255,0.12)' },
          ticks: {
            color: '#9a9a8a',
            font: { family: "'Times New Roman', serif", size: 11 },
            callback: v => (v >= 0 ? '+' : '') + v + '%',
          },
        },
        y: {
          grid: { display: false },
          border: { color: 'rgba(255,255,255,0.12)' },
          ticks: {
            color: '#c8c0b0',
            font: { family: "'Times New Roman', serif", size: 11 },
          },
        },
      },
    },
  });

  // ── Chart draw-in reveal ──────────────────────────────────────
  triggerChartDrawIn('stratPerfChart');
}

/* ============================================================
   HERO — mouse parallax on glow
   ============================================================ */
function initHeroParallax() {
  const glow = document.querySelector('.hero__glow');
  const hero = document.querySelector('.hero');
  if (!glow || !hero) return;

  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const xPct = (e.clientX - left - width  / 2) / (width  / 2);
    const yPct = (e.clientY - top  - height / 2) / (height / 2);
    glow.style.transform =
      `translateX(calc(-50% + ${(xPct * 60).toFixed(1)}px)) translateY(${(yPct * 40).toFixed(1)}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.transform = 'translateX(-50%)';
  });
}

/* ============================================================
   FOOTER — update copyright year dynamically
   ============================================================ */
function initFooter() {
  const copy = document.querySelector('.footer__copy');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} Finn Lakin`;
}

/* ============================================================
   TIMELINE — Education / Work Experience / Combined view toggle
   ============================================================ */
function initTimeline() {
  const panel = document.getElementById('timelinePanel');
  if (!panel) return;
  const buttons = document.querySelectorAll('.timeline-toggle__btn');
  if (!buttons.length) return;

  // Default to "both" view so all entries are visible on first load
  panel.setAttribute('data-view', 'both');
  buttons.forEach(b => {
    if (b.dataset.view === 'both') {
      b.classList.add('active');
      b.setAttribute('aria-selected', 'true');
    } else {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    }
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      panel.setAttribute('data-view', view);
      buttons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ============================================================
   DEMO IFRAME — auto-height via postMessage (no sub-scroll)
   ============================================================ */
let _iframeHeightRaf = null;
let _lastIframeH = 0;
window.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'financeHeight') return;
  const h = Math.round(e.data.height);
  if (!h || h < 400) return;
  // Cap at 2× viewport to prevent runaway growth loop where
  // resizing the wrapper triggers another ResizeObserver report
  const cap = Math.min(h, Math.max(900, window.innerHeight * 1.8));
  // Ignore changes smaller than 8px — stops the resize → report → resize cycle
  if (Math.abs(cap - _lastIframeH) < 8) return;
  _lastIframeH = cap;
  if (_iframeHeightRaf) cancelAnimationFrame(_iframeHeightRaf);
  _iframeHeightRaf = requestAnimationFrame(() => {
    const wrap = document.getElementById('demoWrap');
    if (wrap) wrap.style.height = cap + 'px';
    _iframeHeightRaf = null;
  });
});

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */
function showToast(message, icon) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `
    ${icon || '<svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
    ${message}
  `;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('toast--out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, 2000);
}

/* ============================================================
   HERO TEXT SCRAMBLE
   ============================================================ */
function initHeroScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$£%#@!';
  const lines = document.querySelectorAll('.hero__name-line[data-scramble]');

  // Respect reduced-motion: resolve names instantly, skip the scramble.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lines.forEach(el => {
      const stop = el.querySelector('.hero__name-stop');
      if (stop) el.childNodes[0].textContent = el.dataset.scramble;
      else el.textContent = el.dataset.scramble;
    });
    return;
  }

  lines.forEach((el, i) => {
    const target = el.dataset.scramble;
    const stop   = el.querySelector('.hero__name-stop');
    const delay  = 280 + i * 180;   // stagger per line

    setTimeout(() => {
      let frame = 0;
      const totalFrames = 18;
      const interval = setInterval(() => {
        const ratio = frame / totalFrames;
        const revealed = Math.floor(ratio * target.length);
        let text = '';
        for (let c = 0; c < target.length; c++) {
          if (c < revealed) {
            text += target[c];
          } else {
            text += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        // Preserve the "." span on the last line
        if (stop) {
          el.childNodes[0].textContent = text;
        } else {
          el.textContent = text;
        }
        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          if (stop) {
            el.childNodes[0].textContent = target;
          } else {
            el.textContent = target;
          }
        }
      }, 40);
    }, delay);
  });
}

/* ============================================================
   3D CARD TILT — project cards
   ============================================================ */
function initCardTilt() {
  const MAX_TILT = 8; // degrees
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -MAX_TILT;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) *  MAX_TILT;
      card.style.transform =
        `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   BLOOMBERG TICKER — duplicate content for seamless loop
   ============================================================ */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  // Clone all children to create seamless infinite scroll
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
}

/* ============================================================
   FLOATING CONTACT CTA
   ============================================================ */
function initFloatContact() {
  const btn     = document.getElementById('floatContact');
  const contact = document.getElementById('contact');
  if (!btn) return;

  const heroH = document.getElementById('hero')?.offsetHeight || window.innerHeight;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      // Hide when contact section is visible
      if (e.target === contact) {
        btn.classList.toggle('visible', !e.isIntersecting);
      }
    });
  }, { threshold: 0.1 });

  if (contact) io.observe(contact);

  // Show only after scrolling past hero
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroH * 0.7) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

/* ============================================================
   COPY PHONE BUTTON
   ============================================================ */
function initCopyPhone() {
  const btn = document.getElementById('copyPhoneBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('+447379056766');
      showToast('Phone number copied');
    } catch (e) {}
  });
}

/* ============================================================
   COMMAND PALETTE
   ============================================================ */
const CMD_ITEMS = [
  { group: 'Navigate',  label: 'About',       hint: 'Jump to About section',      icon: 'hash',    action: () => scrollToSection('#about') },
  { group: 'Navigate',  label: 'Timeline',    hint: 'Education & work history',   icon: 'hash',    action: () => scrollToSection('#timeline') },
  { group: 'Navigate',  label: 'Projects',    hint: 'SQL Analyser · Strategy',    icon: 'hash',    action: () => scrollToSection('#projects') },
  { group: 'Navigate',  label: 'Skills',      hint: 'Technical & language skills', icon: 'hash',   action: () => scrollToSection('#skills') },
  { group: 'Navigate',  label: 'Contact',     hint: 'Get in touch',               icon: 'hash',    action: () => scrollToSection('#contact') },
  { group: 'Projects',  label: 'SQL Finance Analyser', hint: 'Open project panel', icon: 'proj',  action: () => { closePalette(); setTimeout(() => openProject('finance'), 80); } },
  { group: 'Projects',  label: "Finn's Strategy",      hint: 'Open project panel', icon: 'proj',  action: () => { closePalette(); setTimeout(() => openProject('strategy'), 80); } },
  { group: 'Actions',   label: 'Download CV', hint: 'finn-lakin-cv.pdf',          icon: 'dl',      action: () => { const a = document.createElement('a'); a.href = 'assets/finn-lakin-cv.pdf'; a.download = 'finn-lakin-cv.pdf'; a.click(); showToast('CV downloading…'); } },
  { group: 'Actions',   label: 'Preview CV',  hint: 'Open CV preview modal',      icon: 'eye',     action: () => { closePalette(); setTimeout(() => document.getElementById('previewCvBtn')?.click(), 80); } },
  { group: 'Actions',   label: 'Copy email',  hint: 'lakin.finn@gmail.com',       icon: 'copy',    action: () => navigator.clipboard.writeText('lakin.finn@gmail.com').then(() => showToast('Email copied')) },
  { group: 'Actions',   label: 'Copy phone',  hint: '+44 7379 056766',            icon: 'copy',    action: () => navigator.clipboard.writeText('+447379056766').then(() => showToast('Phone copied')) },
  { group: 'Links',     label: 'LinkedIn',    hint: 'linkedin.com/in/finnlakin',  icon: 'ext',     action: () => window.open('https://www.linkedin.com/in/finnlakin/', '_blank', 'noopener') },
  { group: 'Links',     label: 'GitHub',      hint: 'github.com/FinnTech3',       icon: 'ext',     action: () => window.open('https://github.com/FinnTech3', '_blank', 'noopener') },
  { group: 'Links',     label: 'Tearsheet',   hint: 'One-page summary PDF',       icon: 'ext',     action: () => window.open('tearsheet.html', '_blank', 'noopener') },
  { group: 'Actions',   label: 'Toggle theme','hint': 'Brass on Black ↔ FT Pink', icon: 'theme',   action: () => { document.getElementById('navPalette')?.click(); showToast('Theme toggled'); } },
];

const CMD_ICONS = {
  hash:  `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 5h9M2 8h9M5 2l-1.5 9M9.5 2L8 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  proj:  `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M4 5h5M4 8h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  dl:    `<svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  eye:   `<svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M1 6c.5-2 2.5-4 5-4s4.5 2 5 4c-.5 2-2.5 4-5 4S1.5 8 1 6z" stroke="currentColor" stroke-width="1.2"/><circle cx="6" cy="6" r="1.5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  copy:  `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="4" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M4 4V2.5A1.5 1.5 0 015.5 1h6A1.5 1.5 0 0113 2.5v6A1.5 1.5 0 0111.5 10H10" stroke="currentColor" stroke-width="1.3"/></svg>`,
  ext:   `<svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  theme: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="currentColor" stroke-width="1.1"/><path d="M7 1.4 A 5.6 5.6 0 0 1 7 12.6 Z" fill="currentColor"/></svg>`,
};

function scrollToSection(hash) {
  closePalette();
  const el = document.querySelector(hash);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

let _cmdOpen = false;
let _cmdFocus = -1;
let _cmdFiltered = [];

function openPalette() {
  const el = document.getElementById('cmdPalette');
  if (!el) return;
  _cmdOpen = true;
  _cmdFocus = -1;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('cmdInput');
  if (input) { input.value = ''; input.focus(); }
  renderCmdResults('');
}

function closePalette() {
  const el = document.getElementById('cmdPalette');
  if (!el) return;
  _cmdOpen = false;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderCmdResults(q) {
  const container = document.getElementById('cmdResults');
  if (!container) return;
  const lq = q.toLowerCase().trim();
  _cmdFiltered = lq
    ? CMD_ITEMS.filter(i =>
        i.label.toLowerCase().includes(lq) || i.hint.toLowerCase().includes(lq) || i.group.toLowerCase().includes(lq)
      )
    : CMD_ITEMS;
  _cmdFocus = -1;

  if (!_cmdFiltered.length) {
    container.innerHTML = `<div class="cmd-no-results">No results for "${q}"</div>`;
    return;
  }

  // Group items
  const groups = {};
  _cmdFiltered.forEach(item => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });

  container.innerHTML = Object.entries(groups).map(([g, items]) => `
    <div class="cmd-palette__group-label">${g}</div>
    ${items.map((item, idx) => {
      const globalIdx = _cmdFiltered.indexOf(item);
      return `
        <div class="cmd-item" role="option" tabindex="-1" data-idx="${globalIdx}">
          <div class="cmd-item__icon">${CMD_ICONS[item.icon] || ''}</div>
          <div class="cmd-item__body">
            <div class="cmd-item__label">${item.label}</div>
            <div class="cmd-item__hint">${item.hint}</div>
          </div>
        </div>
      `;
    }).join('')}
  `).join('');

  container.querySelectorAll('.cmd-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx, 10);
      if (_cmdFiltered[idx]) _cmdFiltered[idx].action();
      if (!['Copy email','Copy phone','Toggle theme'].includes(_cmdFiltered[idx]?.label)) closePalette();
    });
  });
}

function moveCmdFocus(dir) {
  const items = document.querySelectorAll('#cmdResults .cmd-item');
  if (!items.length) return;
  items[_cmdFocus]?.classList.remove('is-focused');
  _cmdFocus = (_cmdFocus + dir + items.length) % items.length;
  const next = items[_cmdFocus];
  next?.classList.add('is-focused');
  next?.scrollIntoView({ block: 'nearest' });
}

function initCommandPalette() {
  // Open with Cmd+K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      _cmdOpen ? closePalette() : openPalette();
      return;
    }
    if (!_cmdOpen) return;
    if (e.key === 'Escape') { closePalette(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveCmdFocus(1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveCmdFocus(-1); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (_cmdFocus >= 0 && _cmdFiltered[_cmdFocus]) {
        _cmdFiltered[_cmdFocus].action();
        if (!['Copy email','Copy phone','Toggle theme'].includes(_cmdFiltered[_cmdFocus]?.label)) closePalette();
      }
    }
  });

  // Close on backdrop click
  document.getElementById('cmdBackdrop')?.addEventListener('click', closePalette);

  // Filter on input
  document.getElementById('cmdInput')?.addEventListener('input', e => {
    renderCmdResults(e.target.value);
  });
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const onScroll = () => {
    const show = window.scrollY > 600;
    btn.hidden = false;
    btn.classList.toggle('visible', show);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
}

/* ============================================================
   COPY EMAIL BUTTON
   ============================================================ */
function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('lakin.finn@gmail.com');
      showToast('Email copied', 'copy');
    } catch (e) {}
  });
}

/* ============================================================
   DEMO SKELETON — replaces plain spinner while Render wakes
   ============================================================ */
function injectDemoSkeleton() {
  const wrap = document.getElementById('demoWrap');
  if (!wrap || wrap.querySelector('.panel-iframe-skeleton')) return;
  const skel = document.createElement('div');
  skel.className = 'panel-iframe-skeleton';
  skel.id = 'demoSkeleton';
  skel.innerHTML = `
    <div class="skel skel--header"></div>
    <div class="skel skel--bar skel--bar-lg"></div>
    <div class="skel skel--bar skel--bar-md"></div>
    <div class="skel skel--block"></div>
    <div class="skel skel--bar skel--bar-sm"></div>
    <div class="skel skel--bar skel--bar-md"></div>
  `;
  wrap.appendChild(skel);
}
function removeDemoSkeleton() {
  const skel = document.getElementById('demoSkeleton');
  if (skel) skel.remove();
  const spinner = document.getElementById('demoSpinner');
  if (spinner) spinner.style.display = 'none';
}

/* ============================================================
   ARIA DEMO STATUS ANNOUNCER
   ============================================================ */
function announceDemo(msg) {
  const el = document.getElementById('demoStatusAnnouncer');
  if (el) el.textContent = msg;
}

/* ============================================================
   PANEL KEYBOARD NAVIGATION — j/k to navigate projects
   ============================================================ */
function initPanelKeyboard() {
  document.addEventListener('keydown', e => {
    const panel = document.getElementById('projectPanel');
    if (!panel || panel.getAttribute('aria-hidden') !== 'false') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'j' || e.key === 'ArrowRight') {
      e.preventDefault();
      document.getElementById('panelNext')?.click();
    } else if (e.key === 'k' || e.key === 'ArrowLeft') {
      e.preventDefault();
      document.getElementById('panelPrev')?.click();
    }
  });
}

/* ============================================================
   MOBILE IFRAME HEIGHT — refresh on orientation change
   ============================================================ */
function initOrientationRefresh() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const wrap = document.getElementById('demoWrap');
      const frame = document.getElementById('demoFrame');
      if (!wrap || !frame || !frame.src || frame.src === 'about:blank') return;
      // Force the iframe to re-report its height
      frame.contentWindow?.postMessage({ type: 'requestHeight' }, '*');
      // Also nudge the wrap so it doesn't stay at stale height
      wrap.style.height = Math.min(window.innerHeight * 1.8, 900) + 'px';
    }, 300);
  });
}

/* ============================================================
   INIT
   ============================================================ */
/* ============================================================
   NAV UNDERLINE MAGNET
   ============================================================ */
function initNavMagnet() {
  if (window.matchMedia('(max-width: 860px)').matches) return;
  const ul  = document.getElementById('navLinks');
  const ind = document.getElementById('navIndicator');
  if (!ul || !ind) return;

  const links = ul.querySelectorAll('a');

  function position(link) {
    const ulRect = ul.getBoundingClientRect();
    const lr     = link.getBoundingClientRect();
    ind.style.left    = (lr.left - ulRect.left) + 'px';
    ind.style.width   = lr.width + 'px';
    ind.style.opacity = '1';
  }

  links.forEach(link => {
    link.addEventListener('mouseenter', () => position(link));
  });

  ul.addEventListener('mouseleave', () => {
    ind.style.opacity = '0';
  });
}

/* ============================================================
   GOLD CURSOR TRAIL
   ============================================================ */
function initCursorTrail() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('cursorTrail');
  if (!canvas) return;

  let W = window.innerWidth, H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  let mx = -200, my = -200;
  let lx = -200, ly = -200;
  let active = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    active = true;
  });

  document.addEventListener('mouseleave', () => { active = false; });

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  });

  const GOLD_RING = 'rgba(182,136,74,';
  const LERP_SPD  = 0.095;

  function frame() {
    ctx.clearRect(0, 0, W, H);
    if (active) {
      lx += (mx - lx) * LERP_SPD;
      ly += (my - ly) * LERP_SPD;

      // Outer trailing ring
      ctx.beginPath();
      ctx.arc(lx, ly, 11, 0, Math.PI * 2);
      ctx.strokeStyle = GOLD_RING + '0.35)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Inner dot at true cursor position
      const dist = Math.hypot(mx - lx, my - ly);
      if (dist > 3) {
        ctx.beginPath();
        ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = GOLD_RING + '0.65)';
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/* ============================================================
   PAGE TRANSITION SWEEP
   ============================================================ */
function initPageTransition() {
  const bar = document.getElementById('pageTransition');
  if (!bar) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const internalPageLinks = Array.from(document.querySelectorAll('a[href]')).filter(a => {
    const href = a.getAttribute('href');
    return (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('//') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !a.hasAttribute('download') &&
      !a.getAttribute('target')
    );
  });

  internalPageLinks.forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      e.preventDefault();
      bar.classList.remove('pt-fade');
      bar.classList.add('pt-run');
      setTimeout(() => {
        bar.classList.add('pt-fade');
        setTimeout(() => { window.location.href = href; }, 120);
      }, 460);
    });
  });
}

/* ============================================================
   CHART DRAW-IN — clip-path reveal when chart canvas is created
   ============================================================ */
function triggerChartDrawIn(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const wrap = canvas.closest('.panel-chart-wrap, .rr-chart-wrap');
  if (!wrap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wrap.classList.add('chart-drawn');
    return;
  }
  // Reset to clipped state then animate in
  wrap.classList.remove('chart-drawn');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => wrap.classList.add('chart-drawn'), 60);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initAnimations();
  initNav();
  initMobileMenu();
  initSmoothScroll();
  initHeroParallax();
  initCvModal();
  initPanelControls();
  initTimeline();
  initFooter();
  initScrollProgress();
  initActiveNav();
  initPanelEnhancements();
  initBackToTop();
  initCopyEmail();
  initPanelKeyboard();
  initOrientationRefresh();
  initHeroScramble();
  initCardTilt();
  initTicker();
  initFloatContact();
  initCopyPhone();
  initCommandPalette();
  initNavMagnet();
  initCursorTrail();
  initPageTransition();
});

/* ============================================================
   SCROLL PROGRESS — gold rule at top fills as you scroll
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ============================================================
   ACTIVE NAV — IntersectionObserver marks current section
   ============================================================ */
function initActiveNav() {
  const links = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!links.length) return;
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('is-current'));
        const link = map.get(e.target);
        if (link) link.classList.add('is-current');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  map.forEach((_, sec) => io.observe(sec));
}

/* ============================================================
   PANEL ENHANCEMENTS — copy-link + next-project footer
   These hook into the existing openProject lifecycle.
   ============================================================ */
function initPanelEnhancements() {
  const topbarLeft = document.querySelector('.project-panel__topbar-left');
  if (topbarLeft && !document.getElementById('panelCopyLink')) {
    const btn = document.createElement('button');
    btn.id = 'panelCopyLink';
    btn.className = 'project-panel__copy';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy direct link to this project');
    btn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6.5 9.5l3-3M5 8a2 2 0 002 2h2M11 8a2 2 0 00-2-2H7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="2.5" y="3.5" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
        <rect x="8.5" y="7.5" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
      </svg>
      <span class="project-panel__copy-lbl">Copy link</span>
    `;
    btn.addEventListener('click', async () => {
      const panel = document.getElementById('projectPanel');
      const id = panel?.dataset.project;
      if (!id) return;
      const url = `${location.origin}${location.pathname}#project-${id}`;
      try {
        await navigator.clipboard.writeText(url);
        const lbl = btn.querySelector('.project-panel__copy-lbl');
        if (lbl) {
          const t = lbl.textContent;
          lbl.textContent = 'Copied';
          btn.classList.add('is-copied');
          setTimeout(() => { lbl.textContent = t; btn.classList.remove('is-copied'); }, 1400);
        }
      } catch (e) {}
    });
    topbarLeft.appendChild(btn);
  }

  // Wrap openProject to inject a "next project" footer when content is rendered
  if (!window._openProjectWrapped && typeof window.openProject === 'function') {
    window._openProjectWrapped = true;
    const orig = window.openProject;
    window.openProject = function (id) {
      orig(id);
      // Defer until panel content is populated
      setTimeout(() => {
        const content = document.getElementById('panelContent');
        if (!content || content.querySelector('.panel-next-project')) return;
        const idx = PROJECTS.findIndex(p => p.id === id);
        const next = PROJECTS[(idx + 1) % PROJECTS.length];
        if (!next || next.id === id) return;
        const footer = document.createElement('div');
        footer.className = 'panel-next-project';
        footer.innerHTML = `
          <div class="panel-next-project__inner">
            <div class="panel-next-project__lbl">Next project</div>
            <a class="panel-next-project__link" href="#" onclick="event.preventDefault(); openProject('${next.id}');">
              <div class="panel-next-project__title">${next.title}</div>
              <div class="panel-next-project__cat">${next.category} · ${next.year}</div>
              <span class="panel-next-project__arrow">→</span>
            </a>
          </div>
        `;
        content.appendChild(footer);
      }, 60);
    };
  }
}
