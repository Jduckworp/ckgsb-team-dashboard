import { useState } from 'react'

interface Props {
  summary: string
  summaryDetail?: string
}

export function SummarySection({ summary, summaryDetail }: Props) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = Boolean(summaryDetail && summaryDetail.trim().length > 0)
  const displayText = expanded && hasMore ? summaryDetail : summary

  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/30 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-emerald-400 text-sm uppercase tracking-wider mb-3">
        What’s going on
      </h2>
      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{displayText}</p>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 focus:outline-none focus:underline"
        >
          {expanded ? 'Show less' : 'Expand for more'}
        </button>
      )}
    </section>
  )
}
