import Bar from "./Bar";

const RANK_COLORS = {
  0: { badge: "bg-amber-400/10 border-amber-400/30 text-amber-300", label: "TOP MATCH" },
  1: { badge: "bg-slate-700/50 border-slate-600 text-slate-300", label: "2ND" },
  2: { badge: "bg-slate-700/50 border-slate-600 text-slate-300", label: "3RD" },
};

export default function RoleCard({ role, rank = 99 }) {
  const matched = role.matchedSignals || [];
  const finalScore = role.finalScore ?? role.score ?? 0;
  const confidence = role.confidence ?? 0;
  const isTop = rank === 0;

  const rankMeta = RANK_COLORS[rank] || { badge: "bg-slate-800 border-slate-700 text-slate-400", label: `#${rank + 1}` };

  return (
    <div
      className={`
        relative rounded-2xl p-5 overflow-hidden
        border transition-all duration-300 group
        ${isTop
          ? "bg-slate-900 border-cyan-500/40 hover:border-cyan-400/70 shadow-lg shadow-cyan-500/5"
          : "bg-slate-900 border-slate-700/50 hover:border-slate-600"}
      `}
    >
      {/* Top glow line for #1 */}
      {isTop && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex flex-col gap-1">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border w-fit ${rankMeta.badge}`}
          >
            {rankMeta.label}
          </span>
          <h3 className={`text-lg font-bold tracking-tight ${isTop ? "text-cyan-300" : "text-slate-200"}`}>
            {role.title || role.role}
          </h3>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-mono font-black ${isTop ? "text-cyan-400" : "text-slate-300"}`}>
            {Math.round(finalScore)}
            <span className="text-sm font-normal text-slate-500">%</span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="mt-3 space-y-1">
        <Bar label="Match Score" value={finalScore} color={isTop ? "cyan" : "indigo"} />
        <Bar label="Confidence" value={confidence} color={isTop ? "emerald" : "indigo"} />
      </div>

      {/* Signals */}
      {matched.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
            Matched Signals
          </div>
          <div className="space-y-1.5">
            {matched.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs font-mono group/sig"
              >
                <div className="flex items-center gap-2 text-slate-400 group-hover/sig:text-slate-300 transition-colors">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover/sig:bg-cyan-500 transition-colors" />
                  {s.signal}
                </div>
                <span className="text-cyan-400 font-bold">+{s.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}