import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '📊 Dashboard' },
  { to: '/strategies', label: '📈 Strategies' },
  { to: '/backtests', label: '🔧 Backtests' },
  { to: '/analytics', label: '📋 Analytics' },
]

export function Sidebar() {
  return (
    <aside className="w-60 bg-bg-secondary border-r border-border-primary p-4">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
