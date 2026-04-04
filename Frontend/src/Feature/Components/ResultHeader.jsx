export default function ResultHeader({ onBack, onAnalyzeAgain, repoName }) {
  return (
    <header className="relative flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
      {/* Left */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">
            RepoSense · Analysis Complete
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {repoName ? (
            <>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-cyan-400 ml-1">{repoName}</span>
            </>
          ) : (
            <span className="text-cyan-400">Analysis Results</span>
          )}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0 mt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition-all duration-200 active:scale-95"
        >
          ← Back
        </button>
        <button
          onClick={onAnalyzeAgain}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          ↺ Re-analyze
        </button>
      </div>
    </header>
  );
}
