# Component Catalog

Every React component with its TypeScript interface.

---

## Layout

### `Navbar`
```tsx
interface NavbarProps {
  // No props — reads auth from context
}
```
Top navigation bar with logo, search, notifications bell, user avatar.

### `Sidebar`
```tsx
interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}
```
Left navigation: Dashboard, Strategies, Backtests, Analytics, Data, Settings.

---

## Dashboard

### `MetricsCard`
```tsx
interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;        // % change, green/red coloring
  icon?: React.ReactNode;
  loading?: boolean;
}
```

### `ActiveBacktests`
```tsx
interface ActiveBacktestsProps {
  limit?: number;  // default 5
}
```
Live-updating list of running backtests with progress bars. Uses WebSocket.

### `StrategyLeaderboard`
```tsx
interface StrategyLeaderboardProps {
  metric: 'sharpe_ratio' | 'total_return_pct' | 'calmar_ratio';
  limit?: number;
}
```

### `RecentBacktests`
```tsx
interface RecentBacktestsProps {
  limit?: number;
}
```

### `MarketOverview`
```tsx
interface MarketOverviewProps {
  symbols?: string[];  // default: SPY, QQQ, IWM
}
```

---

## Charts

### `EquityCurveChart`
```tsx
interface EquityCurveChartProps {
  data: { date: string; equity: number; drawdown_pct?: number }[];
  benchmark?: { date: string; equity: number }[];
  height?: number;
  showDrawdown?: boolean;
}
```

### `DrawdownChart`
```tsx
interface DrawdownChartProps {
  data: { date: string; drawdown_pct: number }[];
  height?: number;
}
```

### `PerformanceChart`
```tsx
interface PerformanceChartProps {
  backtestIds: string[];
  metric: 'equity' | 'returns' | 'drawdown';
  timeRange?: 'all' | '1y' | '6m' | '3m' | '1m';
}
```

### `MonthlyReturnsHeatmap`
```tsx
interface MonthlyReturnsHeatmapProps {
  data: Record<string, number>;  // "2024-01": 2.5, "2024-02": -1.3
}
```

### `TradeDistribution`
```tsx
interface TradeDistributionProps {
  trades: { pnl: number; pnl_pct: number }[];
  bins?: number;
}
```

### `CorrelationMatrix`
```tsx
interface CorrelationMatrixProps {
  labels: string[];
  matrix: number[][];  // NxN correlation values
}
```

---

## Strategy

### `StrategyCard`
```tsx
interface StrategyCardProps {
  name: string;
  description: string;
  tags: string[];
  latestVersion: string;
  bestSharpe?: number;
  onClick?: () => void;
}
```

### `ParameterInput`
```tsx
interface ParameterInputProps {
  name: string;
  schema: {
    type: 'number' | 'string' | 'boolean' | 'select';
    default?: any;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
    description?: string;
  };
  value: any;
  onChange: (value: any) => void;
}
```

### `ParameterPresets`
```tsx
interface ParameterPresetsProps {
  strategyName: string;
  onSelect: (params: Record<string, any>) => void;
}
```

### `ConfigPreview`
```tsx
interface ConfigPreviewProps {
  config: Record<string, any>;
  format?: 'yaml' | 'json';
}
```

### `ValidationResults`
```tsx
interface ValidationResultsProps {
  errors: string[];
  warnings: string[];
}
```

---

## Backtest

### `BacktestProgressBar`
```tsx
interface BacktestProgressBarProps {
  backtestId: string;
  // Subscribes to WebSocket internally
}
```

### `MetricsSummary`
```tsx
interface MetricsSummaryProps {
  results: BacktestResults;
}
```

### `TradesTable`
```tsx
interface TradesTableProps {
  backtestId: string;
  pageSize?: number;        // default 50
  filterSymbol?: string;
  filterDirection?: 'long' | 'short';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
```
Virtualized table for large trade lists.

### `ComparisonView`
```tsx
interface ComparisonViewProps {
  backtestIds: string[];  // 2-4 backtests to compare side-by-side
}
```

---

## Analytics

### `StrategyAllocationChart`
```tsx
interface StrategyAllocationChartProps {
  weights: Record<string, number>;  // strategy → weight
}
```

### `RiskBudgetTable`
```tsx
interface RiskBudgetTableProps {
  strategies: {
    name: string;
    weight: number;
    volatility: number;
    contribution: number;
  }[];
}
```

### `CombinedEquityCurve`
```tsx
interface CombinedEquityCurveProps {
  backtestIds: string[];
  weights?: number[];
}
```

---

## Common

### `Button`
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### `Card`
```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}
```

### `Loading`
```tsx
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```

### `ErrorBoundary`
```tsx
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
```

### `StatusBadge`
```tsx
interface StatusBadgeProps {
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
}
```

### `DateRangePicker`
```tsx
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  minDate?: string;
  maxDate?: string;
}
```

### `UniverseSelector`
```tsx
interface UniverseSelectorProps {
  value: string;
  onChange: (universe: string) => void;
}
```

### `TimeframePicker`
```tsx
interface TimeframePickerProps {
  value: string;
  options?: string[];
  onChange: (tf: string) => void;
}
```
