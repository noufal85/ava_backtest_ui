const STYLES: Record<string,string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  running: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}
export function StatusBadge({ status }: { status: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs border ${STYLES[status] ?? STYLES.cancelled}`}>{status}</span>
}
