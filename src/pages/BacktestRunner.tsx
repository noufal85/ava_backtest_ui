import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { getStrategy, listUniverses, createBacktest } from "@/api/client"
import { useMarket } from "@/contexts/MarketContext"

const TABS = ["Parameters", "Setup", "Preview & Run"] as const

const SUSPICIOUS_SYMBOLS = ["AAPL", "TSLA", "NVDA", "TCS", "RELIANCE"]

export function BacktestRunner() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const { market } = useMarket()

  const [tab, setTab] = useState(0)
  const [params, setParams] = useState<Record<string, unknown>>({})
  const [startDate, setStartDate] = useState("2020-01-01")
  const [endDate, setEndDate] = useState("2024-01-01")
  const [universe, setUniverse] = useState("")
  const [capital, setCapital] = useState(100000)
  const [isOOS, setIsOOS] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { data: strategy, isLoading: strategyLoading } = useQuery({
    queryKey: ["strategy", name],
    queryFn: () => getStrategy(name!),
    enabled: !!name,
  })

  const { data: universes = [] } = useQuery({
    queryKey: ["universes", market?.code],
    queryFn: () => listUniverses(market?.code),
  })

  // Initialize params from strategy defaults
  useMemo(() => {
    if (strategy?.default_config && Object.keys(params).length === 0) {
      setParams({ ...strategy.default_config })
    }
    if (strategy && !universe && market) {
      setUniverse(market.default_universe)
    }
  }, [strategy, market]) // eslint-disable-line react-hooks/exhaustive-deps

  const schema = (strategy?.parameter_schema ?? {}) as Record<string, { type?: string; description?: string; enum?: string[]; default?: unknown; minimum?: number; maximum?: number }>

  const showWarning = universe && SUSPICIOUS_SYMBOLS.some(sym =>
    JSON.stringify(params).includes(sym)
  )

  const config = {
    strategy_name: name ?? "",
    strategy_version: strategy?.version,
    parameters: params,
    universe,
    start_date: startDate,
    end_date: endDate,
    initial_capital: capital,
    market: market?.code ?? "US",
  }

  async function handleRun() {
    if (!name) return
    setSubmitting(true)
    try {
      const bt = await createBacktest(config)
      toast.success("Backtest started!")
      navigate(`/backtests/${bt.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start backtest")
    } finally {
      setSubmitting(false)
    }
  }

  if (strategyLoading) {
    return (
      <div>
        <div className="skeleton h-8 w-60 mb-6" />
        <div className="skeleton h-96 w-full" />
      </div>
    )
  }

  if (!strategy) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Strategy "{name}" not found.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{strategy.name}</h1>
      <p className="text-text-secondary text-sm mb-6">{strategy.description}</p>

      {showWarning && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg px-4 py-3 mb-6 text-sm">
          Warning: Configuration references specific symbols (AAPL/TSLA/NVDA/TCS/RELIANCE). Ensure these are valid for the selected market.
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border-primary mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              tab === i
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1: Parameters */}
      {tab === 0 && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 space-y-4">
          {Object.keys(schema).length === 0 ? (
            <p className="text-text-secondary">This strategy has no configurable parameters.</p>
          ) : (
            Object.entries(schema).map(([key, spec]) => (
              <div key={key}>
                <label className="block text-sm text-text-secondary mb-1">
                  {key}
                  {spec.description && <span className="text-text-muted ml-2">({spec.description})</span>}
                </label>
                {spec.enum ? (
                  <select
                    value={String(params[key] ?? spec.default ?? "")}
                    onChange={e => setParams(p => ({ ...p, [key]: e.target.value }))}
                    className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
                  >
                    {spec.enum.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                ) : spec.type === "boolean" ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(params[key] ?? spec.default ?? false)}
                      onChange={e => setParams(p => ({ ...p, [key]: e.target.checked }))}
                      className="rounded bg-bg-tertiary border-border-primary"
                    />
                    <span className="text-sm">{params[key] ? "Enabled" : "Disabled"}</span>
                  </label>
                ) : (
                  <input
                    type="number"
                    value={String(params[key] ?? spec.default ?? "")}
                    min={spec.minimum}
                    max={spec.maximum}
                    onChange={e => setParams(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Setup */}
      {tab === 1 && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Universe</label>
            <select
              value={universe}
              onChange={e => setUniverse(e.target.value)}
              className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
            >
              <option value="">Select universe...</option>
              {universes.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.symbol_count} symbols)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Initial Capital ({market?.currency_symbol ?? "$"})
            </label>
            <input
              type="number"
              value={capital}
              onChange={e => setCapital(Number(e.target.value))}
              className="bg-bg-tertiary border border-border-primary rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isOOS}
              onChange={e => setIsOOS(e.target.checked)}
              className="rounded bg-bg-tertiary border-border-primary"
            />
            <span className="text-sm text-text-secondary">Enable In-Sample / Out-of-Sample split</span>
          </label>
        </div>
      )}

      {/* Tab 3: Preview & Run */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">Configuration Preview</h3>
            <pre className="bg-bg-primary rounded p-4 text-xs font-mono text-text-secondary overflow-x-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                Market: <strong className="text-text-primary">{market?.name}</strong> &middot;
                Universe: <strong className="text-text-primary">{universe || "none"}</strong> &middot;
                Period: <strong className="text-text-primary">{startDate} to {endDate}</strong>
              </p>
            </div>
            <button
              onClick={handleRun}
              disabled={submitting || !universe}
              className="bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded transition-colors"
            >
              {submitting ? "Starting..." : "Run Backtest"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
