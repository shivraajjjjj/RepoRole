import { useRepo } from "../Hooks/useRepo";
import Results from "../Components/Results";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../Slices/homeSlice";

function CursorBubble({ theme }) {
  const canvasRef = useRef(null);
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
      for (let i = 0; i < 2; i++) {
        bubbles.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 4 + Math.random() * 10,
          life: 1,
          decay: 0.02,
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current = bubbles.current.filter((b) => b.life > 0);

      for (const b of bubbles.current) {
        b.y -= 1;
        b.life -= b.decay;

        const color =
          theme === "dark"
            ? `rgba(245,158,11,${b.life})`
            : `rgba(59,130,246,${b.life})`;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
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
  }, [theme]);

  return (
    <canvas
      className="fixed inset-0 pointer-events-none z-50"
      ref={canvasRef}
    />
  );
}

export default function App() {
  const { repoData, loading, error, page, analyzeRepo, resetFlow } = useRepo();
  const [repoUrl, setRepoUrl] = useState("");

  const theme = useSelector((state) => state.repo.theme);
  const dispatch = useDispatch();

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
      <CursorBubble theme={theme} />
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-700
        ${
          theme === "dark"
            ? "bg-[#1a120b] text-amber-100"
            : "bg-blue-50 text-slate-900"
        }`}
      >
        {/* Toggle Button */}
        <div
          onClick={() =>
            dispatch(setTheme(theme === "dark" ? "light" : "dark"))
          }
          className={`absolute top-6 right-6 w-16 h-9 flex items-center rounded-full p-1 cursor-pointer transition-all duration-500
        ${
          theme === "dark"
            ? "bg-amber-600/40 border border-amber-500/30"
            : "bg-blue-400/40 border border-blue-300/30"
        }`}
        >
          {/* Inner circle */}
          <div
            className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center text-xs transition-all duration-500
    ${
      theme === "dark"
        ? "translate-x-7 bg-amber-500 text-black"
        : "translate-x-0 bg-blue-500 text-white"
    }`}
          >
            {theme === "dark" ? "🌙" : "☀"}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-extrabold mb-6">
          Repo
          <span
            className={theme === "dark" ? "text-amber-400" : "text-blue-500"}
          >
            Sense
          </span>
        </h1>

        {/* Input Card */}
        <div
          className={`p-6 rounded-2xl border w-full max-w-xl transition-all duration-500 shadow-xl
          ${
            theme === "dark"
              ? "bg-[#2c1b12] border-amber-800/40"
              : "bg-white border-blue-200"
          }`}
        >
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className={`w-full p-3 rounded-lg mb-4 outline-none ${theme == "light" ? " text-black/60" : "text-white"} font-bold`}
          />

          <button
            onClick={() => analyzeRepo(repoUrl)}
            disabled={!repoUrl.trim()}
            className={`w-full p-3 rounded-lg font-bold transition-all duration-300
            ${
              theme === "dark"
                ? "bg-amber-600 hover:bg-amber-500 text-black"
                : "bg-blue-500 hover:bg-blue-400 text-white"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    </>
  );
}
