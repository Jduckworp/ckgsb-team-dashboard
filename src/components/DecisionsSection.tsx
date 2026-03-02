import type { Decision } from '../types'

interface Props {
  decisions: Decision[]
}

export function DecisionsSection({ decisions }: Props) {
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
      <ul className="space-y-3">
        {decisions.map((d) => (
          <li
            key={d.id}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/40"
          >
            <p className="text-slate-200">{d.text}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
              {d.meetingTitle && <span>{d.meetingTitle}</span>}
              {d.date && <span>{d.date}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
