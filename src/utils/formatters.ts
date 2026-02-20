export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}
