import { useRepo } from "../Hooks/useRepo";
import Results from "../Components/Results";
import { useState, useEffect, useRef } from "react";

const features = [
  { icon: "⚡", label: "Instant Analysis" },
  { icon: "📊", label: "Deep Insights" },
  { icon: "🔒", label: "Secure & Private" },
];

function CursorBubble() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const bubbles = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Spawn 1-2 bubbles on move
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        bubbles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          r: 4 + Math.random() * 14,
          alpha: 0.5 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.6 - Math.random() * 1.2,
          grow: Math.random() > 0.5,
          // color: 0=cyan, 1=indigo, 2=white
          color: Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : 2) : 0,
          life: 1,
          decay: 0.012 + Math.random() * 0.018,
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    const COLORS = [
      // cyan
      (a) => `rgba(34,211,238,${a})`,
      // indigo
      (a) => `rgba(129,140,248,${a})`,
      // white
      (a) => `rgba(226,232,240,${a})`,
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current = bubbles.current.filter((b) => b.life > 0);

      for (const b of bubbles.current) {
        b.x += b.vx;
        b.y += b.vy;
        b.vy *= 0.99;
        b.vx *= 0.98;
        b.life -= b.decay;
        b.alpha = b.life * 0.7;

        const colorFn = COLORS[b.color];

        // Outer ring
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = colorFn(b.alpha * 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner fill
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = colorFn(b.alpha * 0.15);
        ctx.fill();

        // Highlight dot
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = colorFn(b.alpha * 0.8);
        ctx.fill();
      }

      // Draw cursor ring
      const { x, y } = mouse.current;
      if (x > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(34,211,238,0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.6)";
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ cursor: "none" }}
    />
  );
}

export default function App() {
  const { repoData, loading, error, page, analyzeRepo, resetFlow } = useRepo();
  const [repoUrl, setRepoUrl] = useState("");

  if (page === "result" && repoData) {
    return (
      <Results
        data={repoData}
        onBack={resetFlow}
        onAnalyzeAgain={() => analyzeRepo(repoUrl)}
      />
    );
  }

  return (
    <>
      <CursorBubble />

      <div
        className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-4 py-16"
        style={{ cursor: "none" }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 opacity-5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl gap-8">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs tracking-widest uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            GitHub Repo Analyzer
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-6xl font-extrabold tracking-tight text-white">
              Repo<span className="text-cyan-400">Sense</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Drop any GitHub URL and get a full intelligence report on your
              repository in seconds.
            </p>
          </div>

          {/* Input card */}
          <div className="w-full bg-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-2xl shadow-black/40 space-y-4">
            <label className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              Repository URL
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
                  ⌘
                </span>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeRepo(repoUrl)}
                  placeholder="https://github.com/user/repo"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                  style={{ cursor: "none" }}
                />
              </div>
              <button
                onClick={() => analyzeRepo(repoUrl)}
                disabled={loading || !repoUrl.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition-all duration-200 active:scale-95 whitespace-nowrap shadow-lg shadow-cyan-500/20"
                style={{ cursor: "none" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze →"
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <span>⚠</span>
                {error}
              </div>
            )}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-400 text-sm"
              >
                <span className="text-base">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-slate-600 text-xs font-mono">
            Works with any public GitHub repository
          </p>
        </div>
      </div>
    </>
  );
}
