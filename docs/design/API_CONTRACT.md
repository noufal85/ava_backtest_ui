# API Contract

The frontend communicates with the [trading-backtester_v2](https://github.com/noufal85/trading-backtester_v2) backend.

## Base URL

- Development: `http://localhost:8201/api/v2`
- Production: `https://backtester.yourdomain.com/api/v2`

## REST Endpoints

### Strategies

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/strategies` | List all strategies with metadata |
| `GET` | `/strategies/{name}` | Get strategy details + parameter schema |
| `POST` | `/strategies/{name}/validate` | Validate configuration before running |

### Backtests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/backtests` | Submit new backtest → returns `run_id` + WS URL |
| `GET` | `/backtests` | List backtest runs (filterable) |
| `GET` | `/backtests/{run_id}` | Get detailed results |
| `DELETE` | `/backtests/{run_id}` | Delete a backtest run |
| `POST` | `/backtests/compare` | Compare multiple runs side-by-side |
| `GET` | `/backtests/advanced_query` | Advanced filtering + aggregation |

### Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/data/universes` | List available symbol universes |
| `GET` | `/data/symbols/{symbol}` | Get symbol metadata |
| `GET` | `/data/freshness` | Data freshness report |

## WebSocket Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/ws/backtest/{run_id}` | Live progress updates for a backtest |
| `/ws/live_feed` | Live market data + alerts |
| `/ws/dashboard` | Dashboard real-time updates |

### WebSocket Message Types

```typescript
// Backtest progress
{ type: "backtest_update", run_id: string, status: string, progress: number, message: string }

// Backtest completion
{ type: "backtest_update", run_id: string, status: "completed", progress: 100, results_summary: {...} }

// Error
{ type: "backtest_update", run_id: string, status: "failed", error: string }
```

## Response Format

All REST responses use a standard wrapper:

```typescript
interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  meta?: Record<string, any>;
}
```

## Key Types

```typescript
interface BacktestRequest {
  strategy: {
    name: string;
    version: string;
    parameters: Record<string, any>;
    initial_capital: number;
    universe: string;
    start_date: string;
    end_date: string;
    timeframe: string;
    position_sizing: Record<string, any>;
    risk_management: Record<string, any>;
  };
  save_results: boolean;
  notify_completion: boolean;
  tags?: string[];
}

interface PerformanceMetrics {
  total_return: number;
  annual_return: number;
  volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  calmar_ratio: number;
  max_drawdown: number;
  total_trades: number;
  win_rate: number;
  profit_factor: number;
  avg_win: number;
  avg_loss: number;
  avg_hold_days: number;
}

interface TradeResult {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entry_date: string;
  exit_date: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  pnl: number;
  pnl_pct: number;
  commission: number;
  slippage: number;
  hold_days: number;
  exit_reason: string;
}
```

For the full API specification, see the [backend's API_AND_UI.md](https://github.com/noufal85/trading-backtester_v2/blob/main/docs/design/API_AND_UI.md).
