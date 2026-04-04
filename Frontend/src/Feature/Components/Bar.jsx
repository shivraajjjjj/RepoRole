export default function Bar({ label, value, color = "cyan" }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));

  const colorMap = {
    cyan: { bar: "bg-cyan-400", text: "text-cyan-400", glow: "shadow-cyan-500/40" },
    indigo: { bar: "bg-indigo-400", text: "text-indigo-400", glow: "shadow-indigo-500/40" },
    emerald: { bar: "bg-emerald-400", text: "text-emerald-400", glow: "shadow-emerald-500/40" },
  };

  const c = colorMap[color] || colorMap.cyan;

  const tier =
    safe >= 75 ? "STRONG" : safe >= 50 ? "GOOD" : safe >= 25 ? "FAIR" : "LOW";

  const tierColor =
    safe >= 75
      ? "text-emerald-400"
      : safe >= 50
      ? "text-cyan-400"
      : safe >= 25
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="mt-3 group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold ${tierColor} tracking-widest`}>
            {tier}
          </span>
          <span className={`text-sm font-mono font-bold ${c.text}`}>
            {safe}
            <span className="text-xs text-slate-500">%</span>
          </span>
        </div>
      </div>

      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
        {/* Track marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-slate-700 z-10"
            style={{ left: `${tick}%` }}
          />
        ))}
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-700 ease-out relative shadow-sm ${c.glow}`}
          style={{ width: `${safe}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}