export interface PerformanceMetrics {
  total_return: number
  annual_return: number
  volatility: number
  sharpe_ratio: number
  sortino_ratio: number
  calmar_ratio: number
  max_drawdown: number
  total_trades: number
  win_rate: number
  profit_factor: number
  avg_win: number
  avg_loss: number
  avg_hold_days: number
}

export interface TradeResult {
  id: string
  symbol: string
  direction: 'long' | 'short'
  entry_date: string
  exit_date: string
  entry_price: number
  exit_price: number
  quantity: number
  pnl: number
  pnl_pct: number
  commission: number
  slippage: number
  hold_days: number
  exit_reason: string
}

export interface BacktestRun {
  id: string
  strategy_name: string
  strategy_version: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  created_at: string
  metrics?: PerformanceMetrics
}

export interface Strategy {
  name: string
  version: string
  description: string
  category: string
  tags: string[]
  parameter_schema: Record<string, any>
}
