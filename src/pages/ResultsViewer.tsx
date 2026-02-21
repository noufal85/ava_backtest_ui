import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getBacktest, getEquityCurve, getBacktestTrades, connectBacktestWs } from "@/api/client"
import { StatusBadge } from "@/components/common/StatusBadge"
import { formatCurrency, formatPercent, formatNumber, formatDate } from "@/utils/formatters"
import type { WsMessage, Trade } from "@/types/api"
import { createChart, ColorType } from "lightweight-charts"

export function ResultsViewer() {
  const { runId } = useParams<{ runId: string }>()
  const chartRef = useRef<HTMLDivElement>(null)
  const [wsProgress, setWsProgress] = useState<{ pct: number; symbol: string } | null>(null)
  const [tradePage, setTradePage] = useState(0)
  const [tradeSort, setTradeSort] = useState<{ col: keyof Trade; asc: boolean }>({ col: "entry_date", asc: false })
  const PAGE_SIZE = 20

  const { data: bt, refetch } = useQuery({
    queryKey: ["backtest", runId],
    queryFn: () => getBacktest(runId!),
    enabled: !!runId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === "running" || status === "pending" ? 5000 : false
    },
  })

  const { data: equityData } = useQuery({
    queryKey: ["equity", runId],
    queryFn: () => getEquityCurve(runId!),
    enabled: !!runId && bt?.status === "completed",
  })

  const { data: tradesData } = useQuery({
    queryKey: ["trades", runId, tradePage],
    queryFn: () => getBacktestTrades(runId!, { limit: PAGE_SIZE, offset: tradePage * PAGE_SIZE }),
    enabled: !!runId && bt?.status === "completed",
  })

  // WebSocket for running backtests
  useEffect(() => {
    if (!runId || !bt || (bt.status !== "running" && bt.status !== "pending")) return
    const ws = connectBacktestWs(runId)
    ws.onmessage = (ev) => {
      const msg: WsMessage = JSON.parse(ev.data)
      if (msg.type === "progress") {
        setWsProgress({ pct: msg.pct, symbol: msg.current_symbol })
      } else if (msg.type === "completed") {
        setWsProgress(null)
        refetch()
      }
    }
    return () => ws.close()
  }, [runId, bt?.status, refetch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Equity curve chart
  useEffect(() => {
    if (!chartRef.current || !equityData?.points.length) return
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 350,
      layout: { background: { type: ColorType.Solid, color: "#161b22" }, textColor: "#8b949e" },
      grid: { vertLines: { color: "#21262d" }, horzLines: { color: "#21262d" } },
      rightPriceScale: { borderColor: "#30363d" },
      timeScale: { borderColor: "#30363d" },
    })
    const series = chart.addLineSeries({ color: "#58a6ff", lineWidth: 2 })
    series.setData(equityData.points.map(p => ({
      time: p.date as string,
      value: p.equity,
    })))
    chart.timeScale().fitContent()
    const handleResize = () => {
      if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth })
    }
    window.addEventListener("resize", handleResize)
    return () => { window.removeEventListener("resize", handleResize); chart.remove() }
  }, [equityData])

  if (!runId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Backtests</h1>
        <p className="text-text-secondary">Select a backtest from the <Link to="/" className="text-accent hover:underline">Dashboard</Link> to view results.</p>
      </div>
    )
  }

  if (!bt) {
    return (
      <div>
        <div className="skeleton h-8 w-60 mb-6" />
        <div className="skeleton h-96 w-full" />
      </div>
    )
  }

  const r = bt.results
  const currency = bt.currency ?? "USD"

  const sortedTrades = [...(tradesData?.items ?? [])].sort((a, b) => {
    const av = a[tradeSort.col]
    const bv = b[tradeSort.col]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return tradeSort.asc ? cmp : -cmp
  })

  function toggleSort(col: keyof Trade) {
    setTradeSort(prev => ({ col, asc: prev.col === col ? !prev.asc : false }))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{bt.strategy_name}</h1>
          <p className="text-text-secondary text-sm mt-1">
            {bt.universe_name} &middot; {bt.start_date} to {bt.end_date} &middot; {formatCurrency(bt.initial_capital, currency)}
          </p>
        </div>
        <StatusBadge status={bt.status} />
      </div>

      {/* Progress bar for running */}
      {(bt.status === "running" || bt.status === "pending") && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">
              {wsProgress ? `Processing ${wsProgress.symbol}...` : "Waiting to start..."}
            </span>
            <span className="text-accent">{wsProgress ? `${wsProgress.pct.toFixed(0)}%` : "0%"}</span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2">
            <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${wsProgress?.pct ?? 0}%` }} />
          </div>
        </div>
      )}

      {bt.status === "failed" && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
          Backtest failed. Check logs for details.
        </div>
      )}

      {/* Metrics Grid */}
      {r && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Return", value: formatPercent(r.total_return_pct), color: r.total_return_pct >= 0 ? "text-bull" : "text-bear" },
            { label: "CAGR", value: formatPercent(r.cagr_pct), color: r.cagr_pct >= 0 ? "text-bull" : "text-bear" },
            { label: "Sharpe", value: formatNumber(r.sharpe_ratio), color: "text-accent" },
            { label: "Sortino", value: formatNumber(r.sortino_ratio), color: "text-accent" },
            { label: "Calmar", value: formatNumber(r.calmar_ratio), color: "text-accent" },
            { label: "Max DD", value: formatPercent(-Math.abs(r.max_drawdown_pct)), color: "text-bear" },
            { label: "Win Rate", value: formatPercent(r.win_rate_pct), color: "text-text-primary" },
            { label: "Profit Factor", value: formatNumber(r.profit_factor), color: "text-text-primary" },
            { label: "Total Trades", value: String(r.total_trades), color: "text-text-primary" },
            { label: "Final Equity", value: formatCurrency(r.final_equity, currency), color: "text-accent" },
          ].map(m => (
            <div key={m.label} className="bg-bg-secondary border border-border-primary rounded-lg p-3">
              <p className="text-text-secondary text-xs mb-1">{m.label}</p>
              <p className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Equity Curve */}
      {bt.status === "completed" && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>
          <div ref={chartRef} />
          {!equityData && <div className="skeleton h-[350px] w-full" />}
        </div>
      )}

      {/* Monthly Returns Heatmap */}
      {r?.monthly_returns && Object.keys(r.monthly_returns).length > 0 && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Returns</h2>
          <MonthlyHeatmap returns={r.monthly_returns} />
        </div>
      )}

      {/* Trades Table */}
      {bt.status === "completed" && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg">
          <div className="px-5 py-4 border-b border-border-primary flex justify-between items-center">
            <h2 className="text-lg font-semibold">Trades</h2>
            {tradesData && (
              <span className="text-text-secondary text-sm">{tradesData.total} total</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border-primary">
                  {(["symbol","direction","entry_date","entry_price","exit_date","exit_price","pnl","pnl_pct","hold_days"] as const).map(col => (
                    <th key={col} onClick={() => toggleSort(col)}
                      className="text-left px-4 py-3 font-medium cursor-pointer hover:text-text-primary">
                      {col.replace(/_/g, " ")}{tradeSort.col === col ? (tradeSort.asc ? " \u25B2" : " \u25BC") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTrades.map(t => (
                  <tr key={t.id} className="border-b border-border-primary/50 hover:bg-bg-tertiary/50">
                    <td className="px-4 py-2.5 font-mono">{t.symbol}</td>
                    <td className="px-4 py-2.5">
                      <span className={t.direction === "long" ? "text-bull" : "text-bear"}>{t.direction}</span>
                    </td>
                    <td className="px-4 py-2.5">{formatDate(t.entry_date)}</td>
                    <td className="px-4 py-2.5 font-mono">{formatCurrency(t.entry_price, currency)}</td>
                    <td className="px-4 py-2.5">{t.exit_date ? formatDate(t.exit_date) : "--"}</td>
                    <td className="px-4 py-2.5 font-mono">{t.exit_price != null ? formatCurrency(t.exit_price, currency) : "--"}</td>
                    <td className={`px-4 py-2.5 font-mono ${(t.pnl ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                      {t.pnl != null ? formatCurrency(t.pnl, currency) : "--"}
                    </td>
                    <td className={`px-4 py-2.5 font-mono ${(t.pnl_pct ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                      {t.pnl_pct != null ? formatPercent(t.pnl_pct) : "--"}
                    </td>
                    <td className="px-4 py-2.5">{t.hold_days ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tradesData && tradesData.total > PAGE_SIZE && (
            <div className="px-5 py-3 border-t border-border-primary flex justify-between items-center">
              <button
                onClick={() => setTradePage(p => Math.max(0, p - 1))}
                disabled={tradePage === 0}
                className="text-sm text-accent disabled:text-text-muted disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-text-secondary text-sm">
                Page {tradePage + 1} of {Math.ceil(tradesData.total / PAGE_SIZE)}
              </span>
              <button
                onClick={() => setTradePage(p => p + 1)}
                disabled={(tradePage + 1) * PAGE_SIZE >= tradesData.total}
                className="text-sm text-accent disabled:text-text-muted disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Monthly Returns Heatmap sub-component
function MonthlyHeatmap({ returns }: { returns: Record<string, number> }) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  // Parse "2023-01" format keys into year/month
  const parsed = Object.entries(returns).map(([k, v]) => {
    const [year, month] = k.split("-").map(Number)
    return { year, month, value: v }
  })
  const years = [...new Set(parsed.map(p => p.year))].sort()

  function cellColor(val: number): string {
    if (val > 5) return "bg-green-500/60"
    if (val > 2) return "bg-green-500/40"
    if (val > 0) return "bg-green-500/20"
    if (val > -2) return "bg-red-500/20"
    if (val > -5) return "bg-red-500/40"
    return "bg-red-500/60"
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-xs">
        <thead>
          <tr>
            <th className="px-2 py-1 text-text-secondary">Year</th>
            {MONTHS.map(m => <th key={m} className="px-2 py-1 text-text-secondary w-12 text-center">{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {years.map(year => (
            <tr key={year}>
              <td className="px-2 py-1 text-text-secondary font-mono">{year}</td>
              {Array.from({ length: 12 }, (_, i) => {
                const entry = parsed.find(p => p.year === year && p.month === i + 1)
                return (
                  <td key={i} className="px-1 py-1">
                    {entry != null ? (
                      <div className={`w-12 h-8 rounded flex items-center justify-center font-mono ${cellColor(entry.value)}`}>
                        {formatPercent(entry.value, 1)}
                      </div>
                    ) : (
                      <div className="w-12 h-8" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
