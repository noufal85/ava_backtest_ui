# Page Wireframes & Design Specifications

## 1. Dashboard

The main landing page providing a portfolio overview at a glance.

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Navbar: Logo | Search | Notifications | Settings        │
├──────┬───────────────────────────────────────────────────┤
│      │  Dashboard                    [1W] [1M] [3M] [1Y]│
│  S   │                                                   │
│  i   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│  d   │  │+23.4%│ │ 1.82 │ │-8.3% │ │  12  │            │
│  e   │  │Return│ │Sharpe│ │MaxDD │ │Active│            │
│  b   │  └──────┘ └──────┘ └──────┘ └──────┘            │
│  a   │                                                   │
│  r   │  ┌─────────────────────────────┐ ┌──────────────┐│
│      │  │                             │ │ Active       ││
│  📊  │  │    Equity Curve Chart       │ │ Backtests    ││
│  📈  │  │    (with benchmark)         │ │              ││
│  🔧  │  │                             │ │ ■ strat_1 72%││
│  📋  │  │                             │ │ ■ strat_2 45%││
│  ⚙️  │  └─────────────────────────────┘ └──────────────┘│
│      │                                                   │
│      │  ┌──────────────────┐ ┌────────────────────────┐ │
│      │  │ Strategy         │ │ Recent Backtests       │ │
│      │  │ Leaderboard      │ │                        │ │
│      │  │ 1. BB Mean Rev   │ │ ema_cross  ✅ +12.3%  │ │
│      │  │ 2. EMA Cross     │ │ rsi_mom    ✅ +8.1%   │ │
│      │  │ 3. RSI Momentum  │ │ macd_div   ❌ failed  │ │
│      │  └──────────────────┘ └────────────────────────┘ │
└──────┴───────────────────────────────────────────────────┘
```

### Key Features
- Real-time metrics cards with trend indicators (↑/↓)
- Interactive equity curve with benchmark overlay (S&P 500)
- Drawdown toggle on chart
- Active backtest progress bars with WebSocket updates
- Strategy leaderboard sorted by Sharpe ratio
- Recent backtests with quick-access to results

---

## 2. Strategy Catalog

Browse, search, and filter available strategies.

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Strategy Catalog                                       │
│                                                         │
│  🔍 Search strategies...   [All] [Trend] [Mean Rev]    │
│                            [Momentum] [Multi-Factor]    │
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────┐│
│  │ EMA Crossover   │ │ BB Mean Revert  │ │ RSI Mom   ││
│  │ v2.0.0          │ │ v2.1.0          │ │ v2.0.0    ││
│  │                 │ │                 │ │           ││
│  │ Avg: +23.4%     │ │ Avg: +18.7%     │ │ Avg: +15%  ││
│  │ Sharpe: 1.82    │ │ Sharpe: 1.54    │ │ Sharpe: 1.3││
│  │ Runs: 47        │ │ Runs: 32        │ │ Runs: 21  ││
│  │                 │ │                 │ │           ││
│  │ [trend] [daily] │ │ [mean_rev]      │ │ [momentum]││
│  │ [Configure →]   │ │ [Configure →]   │ │ [Config →]││
│  └─────────────────┘ └─────────────────┘ └───────────┘│
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────┐│
│  │ MACD Divergence │ │ Gap Fade        │ │ ORB       ││
│  │ ...             │ │ ...             │ │ ...       ││
│  └─────────────────┘ └─────────────────┘ └───────────┘│
└────────────────────────────────────────────────────────┘
```

### Key Features
- Grid layout with strategy cards
- Search with autocomplete
- Category filters (tag-based)
- Average performance metrics on each card
- Click to navigate to Strategy Builder

---

## 3. Backtest Runner (Strategy Builder)

Configure and launch backtests with a step-by-step workflow.

### Layout — Parameters Tab
```
┌──────────────────────────────────────────────────────┐
│  EMA Crossover v2.0.0                                │
│  "EMA crossover with confirmation"                    │
│  [trend] [daily] [classic]     Version: 2.0.0        │
│                                                       │
│  [Parameters] [Backtest Setup] [Preview & Run]        │
│  ─────────────────────────────────────────────────    │
│                                                       │
│  Strategy Parameters                                  │
│  ┌────────────────────┐ ┌────────────────────┐       │
│  │ Fast EMA Period    │ │ Slow EMA Period    │       │
│  │ [  9  ] ▲▼        │ │ [  21 ] ▲▼        │       │
│  │ Range: 3-50        │ │ Range: 10-200      │       │
│  └────────────────────┘ └────────────────────┘       │
│                                                       │
│  Parameter Presets                                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│  │ Aggressive │ │ Default    │ │ Conservative│       │
│  │ 5/13       │ │ 9/21       │ │ 13/50      │       │
│  │ [Apply]    │ │ [Applied ✓]│ │ [Apply]    │       │
│  └────────────┘ └────────────┘ └────────────┘       │
└──────────────────────────────────────────────────────┘
```

### Layout — Preview & Run Tab
```
┌──────────────────────────────────────────────────────┐
│  [Parameters] [Backtest Setup] [Preview & Run]        │
│  ─────────────────────────────────────────────────    │
│                                                       │
│  ┌─────────────────────────┐ ┌──────────────────┐    │
│  │ Configuration Summary   │ │ Estimated        │    │
│  │                         │ │                  │    │
│  │ Strategy: ema_crossover │ │ Duration: ~3.5m  │    │
│  │ Version: 2.0.0          │ │                  │    │
│  │ Fast: 9, Slow: 21       │ │ CPU: ████░░ 65% │    │
│  │ Capital: $100,000        │ │ RAM: ███░░░ 40% │    │
│  │ Universe: sp500_liquid   │ │                  │    │
│  │ Period: 2020-2024        │ │ ┌──────────────┐│    │
│  │ Sizing: Kelly (max 25%) │ │ │  [Validate]  ││    │
│  │ Risk: Trailing 2%       │ │ │              ││    │
│  │                         │ │ │ [▶ Run Test] ││    │
│  │ Validation: ✅ Passed   │ │ └──────────────┘│    │
│  └─────────────────────────┘ └──────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 4. Results Viewer

Detailed analysis of a completed backtest.

### Layout
```
┌──────────────────────────────────────────────────────┐
│  EMA Crossover — Run abc123     ✅ Completed          │
│  2020-01-01 to 2024-12-31 | sp500_liquid | 3m 42s    │
│                           [📊 Compare] [📥 Export]    │
│                                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │+34.2%│ │ 1.92 │ │ 0.67 │ │-12.1%│ │  247 │      │
│  │Return│ │Sharpe│ │WinRt │ │MaxDD │ │Trades│      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │                                                │   │
│  │           Equity Curve                         │   │
│  │    ╱╲    ╱╲                                    │   │
│  │   ╱  ╲  ╱  ╲╱╲    ╱╲                          │   │
│  │  ╱    ╲╱      ╲  ╱  ╲╱╲    ╱                  │   │
│  │ ╱                ╲╱     ╲  ╱                    │   │
│  │                          ╲╱                     │   │
│  │  [Drawdown overlay: ON]                         │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ Trades                              [Filter ▼] │   │
│  │ Symbol | Dir | Entry  | Exit   | P&L   | Days  │   │
│  │ AAPL   | L   | 142.50 | 158.20 | +1,107| 12   │   │
│  │ MSFT   | L   | 310.00 | 298.50 | -1,150| 8    │   │
│  │ GOOGL  | L   | 125.80 | 141.20 | +1,540| 15   │   │
│  │ ... (virtualized scroll)                        │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌──────────────────────┐ ┌───────────────────────┐   │
│  │ Monthly Returns      │ │ Trade Distribution    │   │
│  │ Heatmap (green/red)  │ │ Histogram             │   │
│  └──────────────────────┘ └───────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## 5. Portfolio Analytics

Cross-strategy analysis combining multiple backtest results.

### Layout
```
┌──────────────────────────────────────────────────────┐
│  Portfolio Analytics                                  │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ Combined Equity Curve                          │   │
│  │ (overlay of selected strategies + combined)     │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌──────────────────────┐ ┌───────────────────────┐   │
│  │ Correlation Matrix   │ │ Strategy Allocation   │   │
│  │                      │ │ (pie chart)           │   │
│  │   EMA  BB  RSI MACD │ │                       │   │
│  │ EMA 1.0 .3  .5  .2  │ │  EMA Cross   35%     │   │
│  │ BB  .3 1.0  .1  .4  │ │  BB Mean Rev 25%     │   │
│  │ RSI .5  .1 1.0  .6  │ │  RSI Mom     20%     │   │
│  │ MACD.2  .4  .6 1.0  │ │  MACD Div    20%     │   │
│  └──────────────────────┘ └───────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ Drawdown Comparison                            │   │
│  │ (overlaid drawdown curves for each strategy)   │   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ Risk Budget Table                              │   │
│  │ Strategy | Allocation | Sharpe | MaxDD | VaR   │   │
│  │ EMA Cross|    35%     |  1.82  | -12%  | -2.1% │   │
│  │ BB MR    |    25%     |  1.54  | -15%  | -2.8% │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Key Features
- Strategy selection checkboxes
- Combined equity curve with individual overlays
- Correlation heatmap with color coding
- Optimal allocation suggestions (equal weight, risk parity, max Sharpe)
- Drawdown comparison chart
- Risk metrics table
