import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { listBacktests, getCorrelation, getPortfolioMetrics } from "@/api/client"
import { useMarket } from "@/contexts/MarketContext"
import { formatPercent, formatNumber } from "@/utils/formatters"
import { createChart, ColorType } from "lightweight-charts"

export function PortfolioAnalytics() {
  const { market } = useMarket()
  const [selected, setSelected] = useState<string[]>([])
  const chartRef = useRef<HTMLDivElement>(null)

  const { data: backtestsData } = useQuery({
    queryKey: ["backtests", "analytics", market?.code],
    queryFn: () => listBacktests({ market: market?.code, limit: 50, status: "completed" }),
  })

  const backtests = backtestsData?.items ?? []

  const { data: correlation } = useQuery({
    queryKey: ["correlation", selected],
    queryFn: () => getCorrelation(selected),
    enabled: selected.length >= 2,
  })

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", selected],
    queryFn: () => getPortfolioMetrics(selected),
    enabled: selected.length >= 2,
  })

  // Cross-market warning
  const selectedBacktests = backtests.filter(b => selected.includes(b.id))
  const marketCodes = new Set(selectedBacktests.map(b => b.market_code))
  const crossMarketWarning = marketCodes.size > 1

  // Combined equity chart
  useEffect(() => {
    if (!chartRef.current || !portfolio?.equity_curve?.length) return
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: { background: { type: ColorType.Solid, color: "#161b22" }, textColor: "#8b949e" },
      grid: { vertLines: { color: "#21262d" }, horzLines: { color: "#21262d" } },
      rightPriceScale: { borderColor: "#30363d" },
      timeScale: { borderColor: "#30363d" },
    })
    const series = chart.addLineSeries({ color: "#58a6ff", lineWidth: 2 })
    series.setData(portfolio.equity_curve.map(p => ({ time: p.date as string, value: p.equity })))
    chart.timeScale().fitContent()
    const handleResize = () => {
      if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth })
    }
    window.addEventListener("resize", handleResize)
    return () => { window.removeEventListener("resize", handleResize); chart.remove() }
  }, [portfolio])

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Portfolio Analytics</h1>

      {crossMarketWarning && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg px-4 py-3 mb-6 text-sm">
          Warning: You have selected backtests from different markets. Cross-market comparison may not be meaningful.
        </div>
      )}

      {/* Backtest Selection */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Select Backtests</h2>
        <p className="text-text-secondary text-sm mb-4">
          Choose 2 or more completed backtests to analyze their portfolio characteristics.
        </p>
        {backtests.length === 0 ? (
          <p className="text-text-muted text-sm">No completed backtests available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {backtests.map(bt => (
              <label key={bt.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selected.includes(bt.id) ? "bg-accent/10 border border-accent/30" : "hover:bg-bg-tertiary border border-transparent"
              }`}>
                <input
                  type="checkbox"
                  checked={selected.includes(bt.id)}
                  onChange={() => toggleSelect(bt.id)}
                  className="rounded bg-bg-tertiary border-border-primary"
                />
                <span className="text-sm truncate">{bt.strategy_name}</span>
                <span className={`text-xs font-mono ml-auto ${(bt.total_return_pct ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                  {bt.total_return_pct != null ? formatPercent(bt.total_return_pct) : "--"}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selected.length < 2 && (
        <div className="text-center py-10 text-text-secondary">
          Select at least 2 backtests to see portfolio analytics.
        </div>
      )}

      {/* Portfolio Metrics */}
      {portfolio && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Combined Return", value: formatPercent(portfolio.combined_return_pct), color: portfolio.combined_return_pct >= 0 ? "text-bull" : "text-bear" },
            { label: "Combined Sharpe", value: formatNumber(portfolio.combined_sharpe), color: "text-accent" },
            { label: "Max Drawdown", value: formatPercent(-Math.abs(portfolio.combined_max_drawdown_pct)), color: "text-bear" },
            { label: "Diversification", value: formatNumber(portfolio.diversification_ratio), color: "text-accent" },
          ].map(m => (
            <div key={m.label} className="bg-bg-secondary border border-border-primary rounded-lg p-4">
              <p className="text-text-secondary text-xs mb-1">{m.label}</p>
              <p className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Combined Equity Curve */}
      {portfolio?.equity_curve && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Combined Equity Curve</h2>
          <div ref={chartRef} />
        </div>
      )}

      {/* Correlation Matrix */}
      {correlation && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Correlation Matrix</h2>
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1" />
                  {correlation.labels.map(l => (
                    <th key={l} className="px-2 py-1 text-text-secondary font-medium truncate max-w-[100px]">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlation.labels.map((rowLabel, i) => (
                  <tr key={rowLabel}>
                    <td className="px-2 py-1 text-text-secondary font-medium truncate max-w-[100px]">{rowLabel}</td>
                    {correlation.matrix[i].map((val, j) => (
                      <td key={j} className="px-1 py-1">
                        <div
                          className="w-16 h-8 rounded flex items-center justify-center font-mono"
                          style={{ backgroundColor: corrColor(val) }}
                        >
                          {val.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function corrColor(val: number): string {
  if (val > 0.5) return "rgba(46, 160, 67, 0.5)"
  if (val > 0.2) return "rgba(46, 160, 67, 0.25)"
  if (val > -0.2) return "rgba(255, 255, 255, 0.05)"
  if (val > -0.5) return "rgba(218, 54, 51, 0.25)"
  return "rgba(218, 54, 51, 0.5)"
}
