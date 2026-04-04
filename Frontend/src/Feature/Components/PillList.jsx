const PALETTE = [
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  "bg-violet-500/10 border-violet-500/30 text-violet-300",
  "bg-sky-500/10 border-sky-500/30 text-sky-300",
  "bg-teal-500/10 border-teal-500/30 text-teal-300",
];

export default function PillList({ items, emptyLabel, colorize = false }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center gap-2 text-slate-600 text-sm font-mono">
        <span className="w-4 h-px bg-slate-700" />
        {emptyLabel || "None detected"}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => {
        const colorClass = colorize
          ? PALETTE[i % PALETTE.length]
          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300";

        return (
          <span
            key={i}
            className={`
              px-2.5 py-1 text-xs font-mono rounded-lg border
              transition-all duration-200 cursor-default
              ${colorClass}
            `}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}