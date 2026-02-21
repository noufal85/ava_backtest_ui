import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { listStrategies } from "@/api/client"
import { useMarket } from "@/contexts/MarketContext"

const CATEGORIES = ["All", "Trend", "Mean Reversion", "Momentum"] as const

export function StrategyCatalog() {
  const { market } = useMarket()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("All")

  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ["strategies", market?.code],
    queryFn: () => listStrategies(market?.code),
  })

  const filtered = useMemo(() => {
    let list = strategies
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    if (category !== "All") {
      const cat = category.toLowerCase()
      list = list.filter(s => s.tags.some(t => t.toLowerCase().includes(cat)))
    }
    return list
  }, [strategies, search, category])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Strategy Catalog</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search strategies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-bg-tertiary border border-border-primary rounded px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
        />
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
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

      {/* Strategy Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-10 text-center">
          <p className="text-text-secondary mb-2">No strategies found.</p>
          <p className="text-text-muted text-sm">
            {search || category !== "All"
              ? "Try adjusting your search or filter."
              : "No strategies are available for this market yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.name} className="bg-bg-secondary border border-border-primary rounded-lg p-5 flex flex-col hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-text-primary">{s.name}</h3>
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">v{s.latest_version}</span>
              </div>
              <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">{s.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.tags.map(tag => (
                  <span key={tag} className="text-xs bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
              <Link
                to={`/strategies/${s.name}`}
                className="text-sm text-accent hover:underline self-start"
              >
                Configure &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
