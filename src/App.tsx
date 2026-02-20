import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Layout
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

// Pages
import { Dashboard } from '@/pages/Dashboard'
import { StrategyCatalog } from '@/pages/StrategyCatalog'
import { BacktestRunner } from '@/pages/BacktestRunner'
import { ResultsViewer } from '@/pages/ResultsViewer'
import { PortfolioAnalytics } from '@/pages/PortfolioAnalytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/strategies" element={<StrategyCatalog />} />
                <Route path="/strategies/:name" element={<BacktestRunner />} />
                <Route path="/backtests" element={<ResultsViewer />} />
                <Route path="/backtests/:runId" element={<ResultsViewer />} />
                <Route path="/analytics" element={<PortfolioAnalytics />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-bg-secondary border border-border-primary text-text-primary',
              duration: 4000,
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
