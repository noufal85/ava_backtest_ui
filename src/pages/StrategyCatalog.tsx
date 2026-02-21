import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { listStrategies, listBacktests } from "@/api/client"
import { useMarket } from "@/contexts/MarketContext"
import { PlayCircle, BarChart2, TrendingUp, TrendingDown, Clock, Minus } from "lucide-react"

const CATEGORIES = ["All", "Trend", "Mean Reversion", "Momentum"] as const

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function StatChip({
  label,
  value,
  positive,
}: {
  label: string
  value: string | null
  positive?: boolean | null
}) {
  const color =
    value === null
      ? "text-text-muted"
      : positive === true
      ? "text-green-400"
      : positive === false
      ? "text-red-400"
      : "text-text-primary"

  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-semibold ${color}`}>{value ?? "—"}</span>
      <span className="text-xs text-text-muted mt-0.5">{label}</span>
    </div>
  )
}

export function StrategyCatalog() {
  const { market } = useMarket()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("All")

  const { data: strategies = [], isLoading: loadingStrats } = useQuery({
    queryKey: ["strategies", market?.code],
    queryFn: () => listStrategies(market?.code),
  })

  // Fetch latest runs for all strategies (one call, group client-side)
  const { data: recentRuns } = useQuery({
    queryKey: ["backtests-recent", market?.code],
    queryFn: () => listBacktests({ limit: 100, market: market?.code }),
    select: (data) => {
      // Latest completed run per strategy
      const map = new Map<string, typeof data.items[0]>()
      for (const run of data.items) {
        if (run.status !== "completed") continue
        if (!map.has(run.strategy_name)) map.set(run.strategy_name, run)
      }
      return map
    },
  })

  const filtered = useMemo(() => {
    let list = strategies
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    }
    if (category !== "All") {
      const cat = category.toLowerCase().replace(" ", "_")
      list = list.filter((s) =>
        s.tags.some((t) => t.toLowerCase().replace(" ", "_").includes(cat))
      )
    }
    return list
  }, [strategies, search, category])

  const isLoading = loadingStrats

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Strategy Catalog</h1>
          <p className="text-text-secondary text-sm mt-1">
            {strategies.length} strategies available · {market?.name ?? ""}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search strategies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-bg-tertiary border border-border-primary rounded px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
        />
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                category === cat
                  ? "bg-accent text-white"
                  : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-56 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-10 text-center">
          <p className="text-text-secondary mb-2">No strategies found.</p>
          <p className="text-text-muted text-sm">
            {search || category !== "All"
              ? "Try adjusting your search or filter."
              : "No strategies registered for this market."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const run = recentRuns?.get(s.name)
            const results = (run as any)?.results
            const ret = results?.total_return_pct ?? (run as any)?.total_return_pct ?? null
            const sharpe = results?.sharpe_ratio ?? (run as any)?.sharpe_ratio ?? null
            const winRate = results?.win_rate_pct ?? null
            const maxDD = results?.max_drawdown_pct ?? null
            const hasStats = ret !== null

            return (
              <div
                key={s.name}
                className="bg-bg-secondary border border-border-primary rounded-lg p-5 flex flex-col hover:border-accent/40 transition-colors group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-accent flex-shrink-0" />
                    <h3 className="font-semibold text-text-primary leading-tight">
                      {s.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </h3>
                  </div>
                  <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded flex-shrink-0">
                    v{s.latest_version}
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-secondary text-xs mb-3 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-bg-tertiary text-text-muted px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="bg-bg-tertiary rounded-lg px-3 py-2.5 mb-4">
                  {hasStats ? (
                    <div className="grid grid-cols-4 divide-x divide-border-primary">
                      <StatChip
                        label="Return"
                        value={`${ret! >= 0 ? "+" : ""}${ret!.toFixed(1)}%`}
                        positive={ret! >= 0}
                      />
                      <div className="pl-3">
                        <StatChip
                          label="Sharpe"
                          value={sharpe !== null ? sharpe.toFixed(2) : null}
                          positive={sharpe !== null ? sharpe > 0.5 : null}
                        />
                      </div>
                      <div className="pl-3">
                        <StatChip
                          label="Win %"
                          value={winRate !== null ? `${winRate.toFixed(0)}%` : null}
                          positive={winRate !== null ? winRate > 50 : null}
                        />
                      </div>
                      <div className="pl-3">
                        <StatChip
                          label="Max DD"
                          value={maxDD !== null ? `-${maxDD.toFixed(1)}%` : null}
                          positive={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-1 text-text-muted text-xs">
                      <Minus className="h-3 w-3" />
                      No backtest data yet
                    </div>
                  )}
                </div>

                {/* Last run timestamp */}
                {run && (
                  <div className="flex items-center gap-1 text-xs text-text-muted mb-3">
                    <Clock className="h-3 w-3" />
                    Last run {relativeTime(run.created_at)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/strategies/${s.name}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-3 py-2 rounded transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Run Backtest
                  </button>
                  {run && (
                    <Link
                      to={`/backtests/${run.id}`}
                      className="flex items-center justify-center gap-1.5 border border-border-primary hover:border-accent/50 text-text-secondary hover:text-text-primary text-sm px-3 py-2 rounded transition-colors"
                      title="View last result"
                    >
                      {(ret ?? 0) >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
