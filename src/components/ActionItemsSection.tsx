import { useState, useEffect, useMemo } from 'react'
import type { ActionItem } from '../types'

const DISMISSED_STORAGE_KEY = 'ckgsb-dismissed-action-items'

const PAST_TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

/** True if item's note date is within the last 14 days (inclusive of today). */
function isWithinPastTwoWeeks(item: ActionItem): boolean {
  const raw = item.date ?? ''
  if (!raw) return false
  let y: number, m: number, d: number
  const fullMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const monthMatch = raw.match(/^(\d{4})-(\d{2})$/)
  if (fullMatch) {
    [, y, m, d] = fullMatch.map(Number) as [unknown, number, number, number]
  } else if (monthMatch) {
    [, y, m] = monthMatch.map(Number) as [unknown, number, number]
    d = 1
  } else return false
  const itemTime = new Date(y, m - 1, d).getTime()
  const cutoff = Date.now() - PAST_TWO_WEEKS_MS
  return itemTime >= cutoff
}

/** Parse YYYY-MM or YYYY-MM-DD to a sortable string (newest first = descending) */
function sortKey(item: ActionItem): string {
  const raw = item.date ?? ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  if (/^\d{4}-\d{2}$/.test(raw)) return `${raw}-01`
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

interface Props {
  items: ActionItem[]
}

interface ActionItemRowProps {
  item: ActionItem
  isOpen: boolean
  onToggle: () => void
  onDismiss: () => void
}

function ActionItemRow({ item, isOpen, onToggle, onDismiss }: ActionItemRowProps) {
  const noteDate = formatNoteDate(item.date)

  return (
    <li
      className="flex flex-col gap-0 rounded-lg bg-slate-800/40 border border-slate-700/30 overflow-hidden transition-colors hover:bg-slate-800/60"
    >
      <div className="flex items-start gap-3 p-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDismiss() }}
          className="shrink-0 mt-0.5 rounded border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-5 h-5 flex items-center justify-center"
          aria-label="Tick off / remove action item"
        >
          <span className="text-xs">✓</span>
        </button>
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => e.key === 'Enter' && onToggle()}
          className="flex-1 min-w-0 cursor-pointer focus:outline-none focus:ring-0"
          aria-expanded={isOpen}
        >
          <p className="text-slate-200 font-medium">{item.text}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            {noteDate && <span className="text-slate-400">Note date: {noteDate}</span>}
            {item.meetingTitle && <span>{item.meetingTitle}</span>}
            {item.owner && <span>Owner: {item.owner}</span>}
            {item.due && <span>Due: {item.due}</span>}
          </div>
        </div>
        <span
          className="text-slate-400 shrink-0 transition-transform"
          aria-hidden
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </div>
      {isOpen && item.detail && (
        <div className="px-3 pb-3 pt-0 border-t border-slate-700/40 mt-0">
          <div className="pl-10 pt-2">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{item.detail}</p>
          </div>
        </div>
      )}
    </li>
  )
}

export function ActionItemsSection({ items }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(DISMISSED_STORAGE_KEY)
      if (raw) return new Set(JSON.parse(raw) as string[])
    } catch (_) {}
    return new Set()
  })

  useEffect(() => {
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify([...dismissedIds]))
    } catch (_) {}
  }, [dismissedIds])

  const lastTwoWeeks = useMemo(() => items.filter(isWithinPastTwoWeeks), [items])

  const open = useMemo(
    () => lastTwoWeeks.filter((i) => i.status !== 'done' && !dismissedIds.has(i.id)),
    [lastTwoWeeks, dismissedIds]
  )
  const done = useMemo(
    () => lastTwoWeeks.filter((i) => i.status === 'done' && !dismissedIds.has(i.id)),
    [lastTwoWeeks, dismissedIds]
  )
  const sortedOpen = useMemo(() => [...open].sort((a, b) => sortKey(b).localeCompare(sortKey(a))), [open])
  const sortedDone = useMemo(() => [...done].sort((a, b) => sortKey(b).localeCompare(sortKey(a))), [done])

  const handleDismiss = (id: string) => setDismissedIds((s) => new Set(s).add(id))

  if (!lastTwoWeeks.length) {
    return (
      <section className="rounded-2xl bg-amber-950/30 border border-amber-800/30 p-6">
        <h2 className="font-display font-semibold text-amber-400 text-sm uppercase tracking-wider mb-3">
          Action items
        </h2>
        <p className="text-slate-500 text-sm">
          {items.length === 0
            ? 'No action items yet. Pull from Granola to populate.'
            : 'No action items from the past two weeks.'}
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-amber-950/30 border border-amber-800/30 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-amber-400 text-sm uppercase tracking-wider mb-4">
        Action items
      </h2>
      <p className="text-slate-400 text-sm mb-4">Showing items from the past two weeks. Sorted by note date (newest first). Click to expand. Tick to remove from list.</p>
      <div className="space-y-6">
        {sortedOpen.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-amber-500/90 uppercase tracking-wider mb-2">Open</h3>
            <ul className="space-y-2">
              {sortedOpen.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  isOpen={expandedId === item.id}
                  onToggle={() => setExpandedId((id) => (id === item.id ? null : item.id))}
                  onDismiss={() => handleDismiss(item.id)}
                />
              ))}
            </ul>
          </div>
        )}
        {sortedDone.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Done</h3>
            <ul className="space-y-2">
              {sortedDone.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/20 border border-slate-700/20 opacity-80"
                >
                  <span className="mt-1.5 size-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                  <p className="text-slate-400 line-through">{item.text}</p>
                  {item.date && (
                    <span className="text-xs text-slate-500 ml-auto">Note date: {formatNoteDate(item.date)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sortedOpen.length === 0 && sortedDone.length === 0 && (
          <p className="text-slate-500 text-sm">All action items ticked off. Refresh the page or clear site data to bring them back.</p>
        )}
      </div>
    </section>
  )
}
