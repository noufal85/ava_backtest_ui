import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { listBacktests } from "@/api/client"
import { useMarket } from "@/contexts/MarketContext"
import { StatusBadge } from "@/components/common/StatusBadge"
import { formatPercent, formatNumber, formatDate } from "@/utils/formatters"

const FLAGS: Record<string, string> = { US: "\uD83C\uDDFA\uD83C\uDDF8", IN: "\uD83C\uDDEE\uD83C\uDDF3" }

export function Dashboard() {
  const { market } = useMarket()
  const { data, isLoading } = useQuery({
    queryKey: ["backtests", "dashboard", market?.code],
    queryFn: () => listBacktests({ market: market?.code, limit: 10 }),
  })

  const backtests = data?.items ?? []
  const completed = backtests.filter(b => b.status === "completed")
  const active = backtests.filter(b => b.status === "running" || b.status === "pending")
  const bestSharpe = completed.reduce((best, b) => (b.sharpe_ratio ?? 0) > (best?.sharpe_ratio ?? -Infinity) ? b : best, completed[0])
  const bestReturn = completed.reduce((best, b) => (b.total_return_pct ?? 0) > (best?.total_return_pct ?? -Infinity) ? b : best, completed[0])

  const metrics = [
    { label: "Total Backtests", value: data?.total ?? 0, color: "text-accent" },
    { label: "Best Sharpe", value: bestSharpe ? formatNumber(bestSharpe.sharpe_ratio ?? 0) : "--", color: "text-bull" },
    { label: "Best Return", value: bestReturn ? formatPercent(bestReturn.total_return_pct ?? 0) : "--", color: "text-bull" },
    { label: "Active Runs", value: active.length, color: "text-yellow-400" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <div key={m.label} className="bg-bg-secondary border border-border-primary rounded-lg p-5">
            <p className="text-text-secondary text-sm mb-1">{m.label}</p>
            {isLoading ? (
              <div className="skeleton h-8 w-20 mt-1" />
            ) : (
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Backtests Table */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg">
        <div className="px-5 py-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold">Recent Backtests</h2>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full" />
            ))}
          </div>
        ) : backtests.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-text-secondary mb-4">No backtests found for this market.</p>
            <Link to="/strategies" className="text-accent hover:underline">Browse strategies to get started</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border-primary">
                  <th className="text-left px-5 py-3 font-medium">Strategy</th>
                  <th className="text-left px-5 py-3 font-medium">Market</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Return %</th>
                  <th className="text-right px-5 py-3 font-medium">Sharpe</th>
                  <th className="text-right px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {backtests.map(bt => (
                  <tr key={bt.id} className="border-b border-border-primary/50 hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/backtests/${bt.id}`} className="text-accent hover:underline">
                        {bt.strategy_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{FLAGS[bt.market_code] ?? bt.market_code}</td>
                    <td className="px-5 py-3"><StatusBadge status={bt.status} /></td>
                    <td className={`px-5 py-3 text-right font-mono ${(bt.total_return_pct ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                      {bt.total_return_pct != null ? formatPercent(bt.total_return_pct) : "--"}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      {bt.sharpe_ratio != null ? formatNumber(bt.sharpe_ratio) : "--"}
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">{formatDate(bt.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
