export default function InfoCard({ title, icon, children, accent = false }) {
  return (
    <div
      className={`
        relative rounded-2xl p-5 overflow-hidden
        bg-slate-900 border transition-all duration-300 group
        ${accent
          ? "border-cyan-500/30 hover:border-cyan-400/60"
          : "border-slate-700/50 hover:border-slate-600"}
      `}
    >
      {/* Corner accent */}
      {accent && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-3xl" />
      )}

      {/* Subtle top line */}
      {accent && (
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      )}

      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span className="text-base w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
            {icon}
          </span>
        )}
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
          {title}
        </span>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}