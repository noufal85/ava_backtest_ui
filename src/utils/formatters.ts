const MARKET_LOCALE: Record<string, string> = { USD: "en-US", INR: "en-IN" }

export function formatCurrency(value: number, currency = "USD"): string {
  const locale = MARKET_LOCALE[currency] ?? "en-US"
  return new Intl.NumberFormat(locale, { style: "currency", currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}
export function formatPercent(value: number, decimals = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`
}
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  })
}
