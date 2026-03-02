import type { Meeting } from '../types'

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

interface Props {
  meetings: Meeting[]
}

export function MeetingsSection({ meetings }: Props) {
  if (!meetings.length) {
    return (
      <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6">
        <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">
          Recent meetings
        </h2>
        <p className="text-slate-500 text-sm">No meetings loaded. Add data from Granola to see them here.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">
        Recent meetings
      </h2>
      <ul className="space-y-4">
        {meetings.map((m) => (
          <li
            key={m.id}
            className="flex flex-col sm:flex-row sm:items-start gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{m.title}</h3>
              {m.summary && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{m.summary}</p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                <span>{formatDate(m.date)}</span>
                {m.attendees.length > 0 && (
                  <span>{m.attendees.join(', ')}</span>
                )}
              </div>
            </div>
            {m.link && (
              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm shrink-0"
              >
                Open →
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
