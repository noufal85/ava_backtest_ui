/**
 * Typed API client for Trading Backtester V2.
 */
import type {
  Paginated,
  BacktestSummary,
  Backtest,
  BacktestDetail,
  CreateBacktestRequest,
  RunStrategyBacktestRequest,
  Trade,
  EquityCurveResponse,
  StrategySummary,
  StrategyDetail,
  Universe,
  CandleResponse,
  CorrelationResponse,
  PortfolioMetrics,
} from "../types/api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) {
      if (Array.isArray(v)) v.forEach((i) => sp.append(k, String(i)));
      else sp.set(k, String(v));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Backtests
// ---------------------------------------------------------------------------

export async function listBacktests(opts?: {
  status?: string;
  strategy?: string;
  limit?: number;
  offset?: number;
}): Promise<Paginated<BacktestSummary>> {
  return request(`/api/v2/backtests${qs(opts ?? {})}`);
}

export async function createBacktest(
  body: CreateBacktestRequest
): Promise<Backtest> {
  return request("/api/v2/backtests", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getBacktest(id: string): Promise<BacktestDetail> {
  return request(`/api/v2/backtests/${id}`);
}

export async function getBacktestTrades(
  id: string,
  opts?: { symbol?: string; direction?: string; limit?: number; offset?: number }
): Promise<Paginated<Trade>> {
  return request(`/api/v2/backtests/${id}/trades${qs(opts ?? {})}`);
}

export async function getEquityCurve(
  id: string,
  resample?: string
): Promise<EquityCurveResponse> {
  return request(`/api/v2/backtests/${id}/equity-curve${qs({ resample })}`);
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

export async function listStrategies(): Promise<StrategySummary[]> {
  return request("/api/v2/strategies");
}

export async function getStrategy(
  name: string,
  version?: string
): Promise<StrategyDetail> {
  return request(`/api/v2/strategies/${name}${qs({ version })}`);
}

export async function runStrategyBacktest(
  name: string,
  body: RunStrategyBacktestRequest
): Promise<Backtest> {
  return request(`/api/v2/strategies/${name}/backtest`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Universes
// ---------------------------------------------------------------------------

export async function listUniverses(): Promise<Universe[]> {
  return request("/api/v2/universes");
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export async function getCandles(opts: {
  symbol: string;
  timeframe?: string;
  start: string;
  end: string;
}): Promise<CandleResponse> {
  return request(`/api/v2/data/candles${qs(opts)}`);
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getCorrelation(
  backtestIds: string[]
): Promise<CorrelationResponse> {
  return request(
    `/api/v2/analytics/correlation${qs({ backtest_ids: backtestIds })}`
  );
}

export async function getPortfolioMetrics(
  backtestIds: string[],
  weights?: number[]
): Promise<PortfolioMetrics> {
  return request(
    `/api/v2/analytics/portfolio${qs({ backtest_ids: backtestIds, weights })}`
  );
}

// ---------------------------------------------------------------------------
// WebSocket
// ---------------------------------------------------------------------------

export function connectBacktestWs(backtestId: string): WebSocket {
  const wsBase = BASE.replace(/^http/, "ws");
  return new WebSocket(`${wsBase}/ws/backtests/${backtestId}`);
}
