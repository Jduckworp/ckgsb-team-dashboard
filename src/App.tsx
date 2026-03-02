import { useEffect, useState } from 'react'
import type { TeamDashboardData } from './types'
import { SummarySection } from './components/SummarySection'
import { MeetingsSection } from './components/MeetingsSection'
import { ActionItemsSection } from './components/ActionItemsSection'
import { DecisionsSection } from './components/DecisionsSection'
import { TopicsSection } from './components/TopicsSection'

function App() {
  const [data, setData] = useState<TeamDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/meetings.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data')
        return res.json()
      })
      .then(setData)
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
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="font-display font-semibold text-xl text-white tracking-tight">
            CKGSB Team Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Last updated {data.lastUpdated}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <SummarySection summary={data.summary} />
        <ActionItemsSection items={data.actionItems} />
        <MeetingsSection meetings={data.meetings} />
        <DecisionsSection decisions={data.decisions} />
        <TopicsSection topics={data.topics} />
      </main>
    </div>
  )
}

export default App
