# Trading Backtester UI V2

**Professional dark-themed trading research dashboard — React + TypeScript + Vite + TailwindCSS.**

> Frontend for [trading-backtester_v2](https://github.com/noufal85/trading-backtester_v2) backend.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript 5** | Type safety |
| **Vite 5** | Build tool + HMR |
| **TailwindCSS 3** | Utility-first styling |
| **TanStack Query** | Server state + caching |
| **React Router v6** | Client-side routing |
| **Recharts** | Data visualization |
| **Formik + Yup** | Form management |
| **Axios** | HTTP client |

## Pages

| Page | Path | Description |
|------|------|-------------|
| **Dashboard** | `/` | Portfolio overview, equity curve, active backtests, strategy leaderboard |
| **Strategy Catalog** | `/strategies` | Browse, search, filter all available strategies |
| **Backtest Runner** | `/strategies/:name` | Configure parameters, sizing, risk rules → run backtest |
| **Results Viewer** | `/backtests/:runId` | Equity curve, trades table, monthly returns heatmap |
| **Portfolio Analytics** | `/analytics` | Cross-strategy correlation, combined equity, risk budget |

See [docs/wireframes/PAGES.md](docs/wireframes/PAGES.md) for detailed wireframes.

## Design

- **Dark theme** optimized for trading (GitHub-dark inspired)
- **Bull/Bear colors**: Green `#2ea043` / Red `#da3633`
- **Monospace** for numbers, sans-serif for text
- **Real-time updates** via WebSocket (backtest progress, live metrics)

See [docs/design/UI_ARCHITECTURE.md](docs/design/UI_ARCHITECTURE.md) for architecture details.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar
│   ├── dashboard/       # MetricsCard, ActiveBacktests, Leaderboard
│   ├── charts/          # PerformanceChart, DrawdownChart
│   ├── strategy/        # ParameterInput, StrategyPreview
│   ├── backtest/        # ResultsTable, TradeList
│   └── common/          # Button, Card, Loading
├── pages/               # Route-level components
├── hooks/               # Custom React hooks
├── api/                 # API client + endpoint functions
├── contexts/            # Auth, Theme, WebSocket providers
├── styles/              # Global CSS + Tailwind config
├── types/               # Shared TypeScript interfaces
└── utils/               # Formatters, constants
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (proxies API to backend on :8201)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Contract

The frontend connects to the backend V2 API at `/api/v2/`. See [docs/design/API_CONTRACT.md](docs/design/API_CONTRACT.md) for the full specification.

Key endpoints:
- `GET /api/v2/strategies` — list strategies
- `POST /api/v2/backtests` — submit backtest → returns WebSocket URL
- `GET /api/v2/backtests/{run_id}` — get results
- `WS /api/v2/ws/backtest/{run_id}` — real-time progress

## Related

- **Backend**: [trading-backtester_v2](https://github.com/noufal85/trading-backtester_v2)
