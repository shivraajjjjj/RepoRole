import PillList from "./PillList";

const ICON_MAP = {
  Runtimes: "⚙",
  Frameworks: "🧩",
  Databases: "🗄",
  Languages: "〈/〉",
  "Build Files": "📦",
  Flags: "🚩",
};

export default function SummaryCard({ title, value }) {
  const count = Array.isArray(value) ? value.length : 0;
  const icon = ICON_MAP[title] || "◈";

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 overflow-hidden group">
      {/* Header strip */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            {title}
          </span>
        </div>
        <span
          className={`
            text-[10px] font-mono font-bold px-2 py-0.5 rounded-md
            ${count > 0
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              : "bg-slate-800 text-slate-600 border border-slate-700"}
          `}
        >
          {count}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <PillList items={value} emptyLabel="None detected" colorize />
      </div>
    </div>
  );
}