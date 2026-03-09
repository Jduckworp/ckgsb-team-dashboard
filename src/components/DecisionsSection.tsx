import { useState, useMemo } from 'react'
import type { Decision } from '../types'
import type { Meeting } from '../types'

interface Props {
  decisions: Decision[]
  meetings: Meeting[]
}

/** Parse YYYY-MM or YYYY-MM-DD to a sortable string (newest first = descending) */
function sortKeyFromDate(dateStr: string): string {
  if (!dateStr) return '0000-01-01'
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  if (/^\d{4}-\d{2}$/.test(dateStr)) return `${dateStr}-01`
  return '0000-01-01'
}

function formatNoteDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const match = dateStr.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/)
  if (!match) return dateStr
  const [, y, m, d] = match
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[parseInt(m, 10) - 1] ?? m
  if (d) return `${parseInt(d, 10)} ${month} ${y}`
  return `${month} ${y}`
}

interface DecisionRowProps {
  decision: Decision
  noteDateDisplay: string
  isOpen: boolean
  onToggle: () => void
}

function DecisionRow({ decision, noteDateDisplay, isOpen, onToggle }: DecisionRowProps) {
  const hasDetail = Boolean(decision.detail?.trim())

  return (
    <li
      className={`flex flex-col gap-0 rounded-xl bg-slate-800/50 border border-slate-700/40 overflow-hidden transition-colors ${hasDetail ? 'hover:bg-slate-800/70' : ''}`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          role={hasDetail ? 'button' : undefined}
          tabIndex={hasDetail ? 0 : undefined}
          onClick={hasDetail ? onToggle : undefined}
          onKeyDown={hasDetail ? (e) => e.key === 'Enter' && onToggle() : undefined}
          className="flex-1 min-w-0 focus:outline-none focus:ring-0"
          aria-expanded={hasDetail ? isOpen : undefined}
        >
          <p className="text-slate-200 font-medium">{decision.text}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500 items-center">
            {decision.source === 'outlook' && (
              <span className="rounded bg-sky-900/60 text-sky-300 px-1.5 py-0.5 font-medium">Email</span>
            )}
            {decision.source === 'events' && (
              <span className="rounded bg-violet-900/60 text-violet-300 px-1.5 py-0.5 font-medium">Events</span>
            )}
            {decision.source === 'content' && (
              <span className="rounded bg-amber-900/60 text-amber-300 px-1.5 py-0.5 font-medium">Content</span>
            )}
            {noteDateDisplay && <span className="text-slate-400">Note date: {noteDateDisplay}</span>}
            {decision.meetingTitle && <span>{decision.meetingTitle}</span>}
          </div>
        </div>
        {hasDetail && (
          <span
            className="text-slate-400 shrink-0 transition-transform"
            aria-hidden
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </span>
        )}
      </div>
      {hasDetail && isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/40">
          <div className="pt-3">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{decision.detail}</p>
          </div>
        </div>
      )}
    </li>
  )
}

export function DecisionsSection({ decisions, meetings }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const meetingDateById = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of meetings) map.set(m.id, m.date)
    return map
  }, [meetings])

  const withDisplayDate = useMemo(
    () =>
      decisions.map((d) => {
        const fullDate = meetingDateById.get(d.meetingId) ?? d.date ?? ''
        const display = formatNoteDate(fullDate || d.date)
        const sortKey = sortKeyFromDate(fullDate)
        return { decision: d, noteDateDisplay: display, sortKey }
      }),
    [decisions, meetingDateById]
  )

  const pastWeekCutoff = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().slice(0, 10)
  }, [])

  const sorted = useMemo(() => {
    const fromPastWeek = withDisplayDate.filter((x) => x.sortKey >= pastWeekCutoff)
    return [...fromPastWeek]
      .sort((a, b) => {
        const byDate = b.sortKey.localeCompare(a.sortKey)
        if (byDate !== 0) return byDate
        return a.decision.id.localeCompare(b.decision.id)
      })
      .slice(0, 10)
  }, [withDisplayDate, pastWeekCutoff])

  if (!decisions.length) {
    return (
      <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6">
        <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">
          Decisions
        </h2>
        <p className="text-slate-500 text-sm">No decisions captured yet. Add from Granola to display here.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">
        Decisions
      </h2>
      <p className="text-slate-400 text-sm mb-4">Up to 10 decisions from the past week (newest first). Click to expand.</p>
      <ul className="space-y-3">
        {sorted.map(({ decision, noteDateDisplay }) => (
          <DecisionRow
            key={decision.id}
            decision={decision}
            noteDateDisplay={noteDateDisplay}
            isOpen={expandedId === decision.id}
            onToggle={() => setExpandedId((id) => (id === decision.id ? null : decision.id))}
          />
        ))}
      </ul>
    </section>
  )
}
