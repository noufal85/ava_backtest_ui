# UI Architecture

## Overview

The V2 frontend is a professional dark-themed trading dashboard built with React, TypeScript, Vite, and TailwindCSS. It communicates with the [trading-backtester_v2](https://github.com/noufal85/trading-backtester-ui_v2) backend via REST API and WebSocket connections for real-time updates.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18+ | Component framework |
| TypeScript 5+ | Type safety |
| Vite 5+ | Build tool + HMR |
| TailwindCSS 3+ | Utility-first styling |
| shadcn/ui | Component library |
| TanStack Query (React Query) | Server state management |
| React Router v6 | Client-side routing |
| Chart.js / Recharts | Data visualization |
| Formik + Yup | Form management + validation |
| react-hot-toast | Notifications |

## Application Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, Footer
│   ├── dashboard/       # MetricsCard, ActiveBacktests, Leaderboard
│   ├── charts/          # PerformanceChart, DrawdownChart, EquityCurve
│   ├── strategy/        # ParameterInput, StrategyPreview, ValidationResults
│   ├── backtest/        # ResultsTable, TradeList, ComparisonView
│   └── common/          # Button, Card, Loading, ErrorBoundary
├── pages/
│   ├── Dashboard.tsx        # Main dashboard
│   ├── StrategyCatalog.tsx  # Strategy listing
│   ├── StrategyBuilder.tsx  # Configure + run backtest
│   ├── BacktestRunner.tsx   # Active backtest monitoring
│   ├── ResultsViewer.tsx    # Detailed results analysis
│   └── PortfolioAnalytics.tsx # Cross-strategy portfolio view
├── hooks/
│   ├── useWebSocket.ts     # WebSocket connection management
│   ├── useBacktest.ts      # Backtest CRUD operations
│   └── useStrategies.ts    # Strategy data fetching
├── api/
│   ├── client.ts           # Axios/fetch wrapper
│   ├── backtests.ts        # Backtest API calls
│   ├── strategies.ts       # Strategy API calls
│   └── data.ts             # Market data API calls
├── contexts/
│   ├── AuthContext.tsx      # Authentication state
│   ├── ThemeProvider.tsx    # Dark/light theme
│   └── WebSocketProvider.tsx # Global WS connection
├── styles/
│   └── globals.css         # Tailwind + custom dark theme
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── utils/
    ├── formatters.ts       # Number/date formatting
    └── constants.ts        # API URLs, config
```

## Routing

| Path | Page | Description |
|------|------|-------------|
| `/` | Dashboard | Portfolio overview, recent backtests, active jobs |
| `/strategies` | Strategy Catalog | Browse and search all strategies |
| `/strategies/:name` | Strategy Builder | Configure parameters, run backtest |
| `/backtests` | Backtest Runner | List all runs, monitor active ones |
| `/backtests/:runId` | Results Viewer | Detailed results for a single run |
| `/analytics` | Portfolio Analytics | Cross-strategy analysis, correlation |
| `/data` | Data Management | Universe management, data freshness |
| `/settings` | Settings | User preferences, API keys |

## State Management

- **Server state**: TanStack Query (React Query) with 5-minute stale time
- **Client state**: React Context for auth, theme, WebSocket
- **Form state**: Formik for strategy configuration forms
- **URL state**: React Router search params for filters/sorting

## Real-Time Updates

WebSocket connections provide live updates for:
- Backtest progress (% complete, current symbol)
- Completion notifications
- Data sync status
- Live portfolio metrics

## Design System

Dark theme with trading-optimized colors:
- **Background**: `#0d1117` (primary), `#161b22` (secondary)
- **Text**: `#f0f6fc` (primary), `#8b949e` (secondary)
- **Bull/Profit**: `#2ea043` (green)
- **Bear/Loss**: `#da3633` (red)
- **Accent**: `#58a6ff` (blue)
- **Font**: Inter (sans), JetBrains Mono (monospace)

See the full design system in the [backend repo's API_AND_UI.md](https://github.com/noufal85/trading-backtester_v2/blob/main/docs/design/API_AND_UI.md).

## Component Props & Interfaces

All component TypeScript interfaces are documented in [`docs/components/COMPONENT_CATALOG.md`](../components/COMPONENT_CATALOG.md).

Key interfaces summary:

| Component | Key Props |
|-----------|-----------|
| `MetricsCard` | `title`, `value`, `change` (% delta, colors green/red) |
| `EquityCurveChart` | `data: EquityPoint[]`, `benchmark?`, `showDrawdown?` |
| `StrategyCard` | `name`, `description`, `tags`, `bestSharpe?` |
| `ParameterInput` | `name`, `schema` (type/min/max/options), `value`, `onChange` |
| `TradesTable` | `backtestId`, virtualized pagination, sort/filter |
| `BacktestProgressBar` | `backtestId` — self-subscribes to WebSocket |
| `CorrelationMatrix` | `labels: string[]`, `matrix: number[][]` |

## API Client

Typed API client lives in `src/api/client.ts` with full TypeScript types in `src/types/api.ts`. These match the backend OpenAPI spec at `docs/api/openapi.yaml` in the backend repo.
