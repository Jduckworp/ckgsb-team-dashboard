import type { ActionItem } from '../types'

interface Props {
  items: ActionItem[]
}

export function ActionItemsSection({ items }: Props) {
  const open = items.filter((i) => i.status !== 'done')
  const done = items.filter((i) => i.status === 'done')

  if (!items.length) {
    return (
      <section className="rounded-2xl bg-amber-950/30 border border-amber-800/30 p-6">
        <h2 className="font-display font-semibold text-amber-400 text-sm uppercase tracking-wider mb-3">
          Action items
        </h2>
        <p className="text-slate-500 text-sm">No action items yet. Pull from Granola to populate.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-amber-950/30 border border-amber-800/30 p-6 sm:p-8">
      <h2 className="font-display font-semibold text-amber-400 text-sm uppercase tracking-wider mb-4">
        Action items
      </h2>
      <div className="space-y-6">
        {open.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-amber-500/90 uppercase tracking-wider mb-2">Open</h3>
            <ul className="space-y-2">
              {open.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
                >
                  <span className="mt-1.5 size-2 rounded-full bg-amber-400 shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-slate-200">{item.text}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      {item.meetingTitle && <span>{item.meetingTitle}</span>}
                      {item.owner && <span>Owner: {item.owner}</span>}
                      {item.due && <span>Due: {item.due}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {done.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Done</h3>
            <ul className="space-y-2">
              {done.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/20 border border-slate-700/20 opacity-80"
                >
                  <span className="mt-1.5 size-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                  <p className="text-slate-400 line-through">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
