# Component Hierarchy

## App Shell

```
<App>
  <QueryClientProvider>
    <AuthProvider>
      <ThemeProvider>
        <WebSocketProvider>
          <Router>
            <Navbar />
            <div className="app-container">
              <Sidebar />
              <main>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/strategies" element={<StrategyCatalog />} />
                  <Route path="/strategies/:name" element={<StrategyBuilder />} />
                  <Route path="/backtests" element={<BacktestRunner />} />
                  <Route path="/backtests/:runId" element={<ResultsViewer />} />
                  <Route path="/analytics" element={<PortfolioAnalytics />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </WebSocketProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
</App>
```

## Page Components

### Dashboard
```
<Dashboard>
  <DashboardHeader>
    <TimeframePicker />
    <QuickActions />
  </DashboardHeader>
  <MetricsRow>
    <MetricsCard title="Total Return" />
    <MetricsCard title="Sharpe Ratio" />
    <MetricsCard title="Max Drawdown" />
    <MetricsCard title="Active Strategies" />
  </MetricsRow>
  <PerformanceChart />
  <ActiveBacktests />
  <StrategyLeaderboard />
  <RecentBacktests />
  <MarketOverview />
</Dashboard>
```

### Strategy Catalog
```
<StrategyCatalog>
  <SearchBar />
  <CategoryFilter />
  <StrategyGrid>
    <StrategyCard /> (×N)
  </StrategyGrid>
</StrategyCatalog>
```

### Strategy Builder
```
<StrategyBuilder>
  <StrategyHeader />
  <TabBar tabs={["Parameters", "Backtest Setup", "Preview & Run"]} />
  <Formik>
    <ParametersTab>
      <ParameterInput /> (×N, dynamic from schema)
      <ParameterPresets />
    </ParametersTab>
    <BacktestTab>
      <DateRangePicker />
      <UniverseSelector />
      <PositionSizingConfig />
      <RiskManagementConfig />
    </BacktestTab>
    <PreviewTab>
      <ConfigPreview />
      <ValidationResults />
      <EstimatedDuration />
      <RunButton />
    </PreviewTab>
  </Formik>
</StrategyBuilder>
```

### Results Viewer
```
<ResultsViewer>
  <ResultsHeader>
    <StatusBadge />
    <ActionButtons />
  </ResultsHeader>
  <MetricsSummary />
  <EquityCurveChart />
  <DrawdownChart />
  <TradesTable>
    <TradeRow /> (×N, virtualized)
  </TradesTable>
  <MonthlyReturnsHeatmap />
  <TradeDistribution />
</ResultsViewer>
```

### Portfolio Analytics
```
<PortfolioAnalytics>
  <StrategyAllocationChart />
  <CorrelationMatrix />
  <RiskBudgetTable />
  <CombinedEquityCurve />
  <DrawdownComparison />
</PortfolioAnalytics>
```
