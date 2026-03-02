import type { Topic } from '../types'

interface Props {
  topics: Topic[]
}

export function TopicsSection({ topics }: Props) {
  if (!topics.length) {
    return (
      <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6">
        <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">
          Key topics
        </h2>
        <p className="text-slate-500 text-sm">No topics yet. Populate from your Granola notes.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">
        Key topics
      </h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <div
            key={t.name}
            className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40"
          >
            <span className="font-medium text-slate-200">{t.name}</span>
            {t.summary && (
              <p className="text-slate-500 text-xs mt-1">{t.summary}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
