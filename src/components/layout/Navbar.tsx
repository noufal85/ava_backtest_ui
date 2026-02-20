export function Navbar() {
  return (
    <nav className="bg-bg-secondary border-b border-border-primary h-[60px] px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-accent">📈 Backtester V2</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-text-secondary text-sm">Trading Research Platform</span>
      </div>
    </nav>
  )
}
