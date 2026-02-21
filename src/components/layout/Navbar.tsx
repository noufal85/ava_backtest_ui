import { useMarket } from "@/contexts/MarketContext"
const FLAGS: Record<string, string> = { US: "\uD83C\uDDFA\uD83C\uDDF8", IN: "\uD83C\uDDEE\uD83C\uDDF3" }

export function Navbar() {
  const { market, markets, setMarket } = useMarket()
  return (
    <nav className="bg-bg-secondary border-b border-border-primary h-[60px] px-6 flex items-center justify-between sticky top-0 z-50">
      <span className="text-lg font-bold text-accent">{"\uD83D\uDCC8"} AvaAI Backtester</span>
      <div className="flex items-center gap-4">
        <select value={market?.code ?? "US"} onChange={e => setMarket(e.target.value)}
          className="bg-bg-tertiary border border-border-primary text-text-primary text-sm rounded px-3 py-1.5 appearance-none cursor-pointer hover:border-accent focus:outline-none">
          {markets.map(m => <option key={m.code} value={m.code}>{FLAGS[m.code] ?? "\uD83C\uDF0D"} {m.name} ({m.currency})</option>)}
        </select>
        <span className="text-text-secondary text-sm">Trading Research Platform</span>
      </div>
    </nav>
  )
}
