import { useEffect, useState } from 'react'
import type { TeamDashboardData } from './types'
import { SummarySection } from './components/SummarySection'
import { ActionItemsSection } from './components/ActionItemsSection'
import { DecisionsSection } from './components/DecisionsSection'
import { MeetingsSection } from './components/MeetingsSection'
function App() {
  const [data, setData] = useState<TeamDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/meetings.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data')
        return res.json() as Promise<TeamDashboardData>
      })
      .then((main) => {
        setData(main)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load dashboard data'))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-amber-400">
          <p className="font-display text-lg">{error}</p>
          <p className="mt-2 text-slate-400 text-sm">
            Add <code className="bg-slate-800 px-1 rounded">public/data/meetings.json</code> or keep data in{' '}
            <code className="bg-slate-800 px-1 rounded">src/data/meetings.json</code>.
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-display">Loading dashboard…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ckgsb-blue/30 bg-ckgsb-navy/80 backdrop-blur sticky top-0 z-10">
        <div className="h-1 bg-gradient-to-r from-ckgsb-blue via-ckgsb-blue/60 to-ckgsb-orange" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <img
            src="/brand/ckgsb-logo.svg"
            alt="CKGSB"
            className="h-8 w-auto shrink-0"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="border-l border-white/15 pl-4">
            <h1 className="font-display font-bold text-xl text-white tracking-tight">
              Team Dashboard
            </h1>
            <p className="text-ckgsb-blue text-sm mt-0.5">
              Last updated {data.lastUpdated}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <SummarySection summary={data.summary} summaryDetail={data.summaryDetail} />
        <ActionItemsSection items={data.actionItems} />
        <DecisionsSection decisions={data.decisions} meetings={data.meetings} />
        <MeetingsSection meetings={data.meetings} />
      </main>
    </div>
  )
}

export default App
