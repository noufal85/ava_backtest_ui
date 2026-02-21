import { createContext, useContext, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Market } from "@/types/api"

const STORAGE_KEY = "ava_selected_market"

interface MarketContextValue {
  market: Market | null
  setMarket: (code: string) => void
  markets: Market[]
  isLoading: boolean
}

const MarketContext = createContext<MarketContextValue | null>(null)

const FALLBACK_MARKETS: Market[] = [
  { code: "US", name: "United States", currency: "USD", currency_symbol: "$", default_universe: "sp500_liquid", is_default: true },
  { code: "IN", name: "India", currency: "INR", currency_symbol: "\u20B9", default_universe: "nifty50", is_default: false },
]

async function fetchMarkets(): Promise<Market[]> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8201"
  try {
    const res = await fetch(`${base}/api/v2/markets`)
    if (!res.ok) return FALLBACK_MARKETS
    return res.json()
  } catch { return FALLBACK_MARKETS }
}

export function getSelectedMarket(): string {
  return localStorage.getItem(STORAGE_KEY) ?? "US"
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [selectedCode, setSelectedCode] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "US")
  const { data: markets = FALLBACK_MARKETS, isLoading } = useQuery({
    queryKey: ["markets"], queryFn: fetchMarkets, staleTime: Infinity,
  })
  const market = markets.find(m => m.code === selectedCode) ?? markets[0] ?? null
  const setMarket = (code: string) => { localStorage.setItem(STORAGE_KEY, code); setSelectedCode(code) }
  return <MarketContext.Provider value={{ market, setMarket, markets, isLoading }}>{children}</MarketContext.Provider>
}

export function useMarket() {
  const ctx = useContext(MarketContext)
  if (!ctx) throw new Error("useMarket must be used inside MarketProvider")
  return ctx
}
