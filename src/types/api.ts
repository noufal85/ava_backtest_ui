/**
 * API type definitions — matches backend OpenAPI spec exactly.
 */

// ---------------------------------------------------------------------------
// Backtests
// ---------------------------------------------------------------------------

export interface BacktestSummary {
  id: string;
  strategy_name: string;
  strategy_version: string;
  universe_name: string;
  status: BacktestStatus;
  total_return_pct: number | null;
  sharpe_ratio: number | null;
  created_at: string;
  duration_seconds: number | null;
  market_code: string;
  currency: string;
}

export interface Backtest {
  id: string;
  strategy_name: string;
  strategy_version: string;
  param_yaml: string;
  universe_name: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  status: BacktestStatus;
  created_at: string;
  market_code: string;
  currency: string;
}

export interface BacktestDetail extends Backtest {
  results: BacktestResults | null;
}

export interface BacktestResults {
  total_return_pct: number;
  cagr_pct: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  calmar_ratio: number;
  max_drawdown_pct: number;
  max_drawdown_days: number;
  win_rate_pct: number;
  profit_factor: number;
  total_trades: number;
  avg_hold_days: number;
  final_equity: number;
  monthly_returns: Record<string, number>;
}

export type BacktestStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface CreateBacktestRequest {
  strategy_name: string;
  strategy_version?: string;
  parameters?: Record<string, unknown>;
  universe: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  sizing?: Record<string, unknown>;
  risk_rules?: Record<string, unknown>[];
  regime_filter?: Record<string, unknown>;
  market: string;
}

export interface RunStrategyBacktestRequest {
  parameters?: Record<string, unknown>;
  universe: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
}

// ---------------------------------------------------------------------------
// Trades
// ---------------------------------------------------------------------------

export interface Trade {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entry_date: string;
  entry_price: number;
  exit_date: string | null;
  exit_price: number | null;
  shares: number;
  pnl: number | null;
  pnl_pct: number | null;
  hold_days: number | null;
  exit_reason: string | null;
}

// ---------------------------------------------------------------------------
// Equity Curve
// ---------------------------------------------------------------------------

export interface EquityPoint {
  date: string;
  equity: number;
  drawdown_pct: number;
}

export interface EquityCurveResponse {
  points: EquityPoint[];
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

export interface StrategySummary {
  name: string;
  latest_version: string;
  description: string;
  tags: string[];
  is_active: boolean;
}

export interface StrategyDetail {
  name: string;
  version: string;
  description: string;
  tags: string[];
  default_config: Record<string, unknown>;
  parameter_schema: Record<string, unknown>;
  required_timeframes: string[];
  warmup_periods: number;
  changelog: string;
}

// ---------------------------------------------------------------------------
// Universes
// ---------------------------------------------------------------------------

export interface Universe {
  id: string;
  name: string;
  description: string;
  type: "static" | "filter" | "index";
  symbol_count: number;
}

// ---------------------------------------------------------------------------
// Candles / Data
// ---------------------------------------------------------------------------

export interface Candle {
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandleResponse {
  symbol: string;
  timeframe: string;
  candles: Candle[];
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface CorrelationResponse {
  labels: string[];
  matrix: number[][];
}

export interface PortfolioMetrics {
  combined_return_pct: number;
  combined_sharpe: number;
  combined_max_drawdown_pct: number;
  diversification_ratio: number;
  weights: Record<string, number>;
  equity_curve: EquityPoint[];
}

// ---------------------------------------------------------------------------
// WebSocket messages
// ---------------------------------------------------------------------------

export type WsMessage =
  | { type: "progress"; pct: number; current_symbol: string; symbols_done: number; symbols_total: number }
  | { type: "completed"; backtest_id: string; sharpe: number; total_return_pct: number }
  | { type: "error"; message: string };

// ---------------------------------------------------------------------------
// Paginated wrapper
// ---------------------------------------------------------------------------

export interface Paginated<T> {
  items: T[];
  total: number;
}

// ---------------------------------------------------------------------------
// Markets
// ---------------------------------------------------------------------------

export interface Market {
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  default_universe: string;
  is_default: boolean;
}
