import { useState } from "react";
import { ArrowRight, Github } from "lucide-react";

export function Hero() {
  const [url, setUrl] = useState("");
  const [animating, setAnimating] = useState(false);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1500);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.06) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Badge */}
      <div
        className="relative mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs"
        style={{
          background: "rgba(99,102,241,0.1)",
          borderColor: "rgba(99,102,241,0.3)",
          color: "#818cf8",
          fontWeight: 600,
          letterSpacing: "0.06em",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <Github size={12} />
        OPEN-SOURCE INTELLIGENCE FOR REPOSITORIES
      </div>

      {/* Main heading */}
      <h1
        className="relative text-center mb-4"
        style={{
          fontWeight: 800,
          fontSize: "clamp(56px, 9vw, 120px)",
          lineHeight: 1.0,
          letterSpacing: "-3px",
          background: "linear-gradient(135deg, #e2e4ef 30%, #818cf8 70%, #22d3ee 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        RepoRole
      </h1>

      {/* Subheading */}
      <p
        className="relative text-center mb-12 max-w-lg"
        style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: "#7678a0",
          fontWeight: 500,
          lineHeight: 1.6,
        }}
      >
        A GitHub repository analyzer — understand any codebase{" "}
        <span style={{ color: "#818cf8" }}>instantly</span>.
      </p>

      {/* URL input + button */}
      <div className="relative w-full max-w-2xl">
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{
            background: "#0e0e24",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 40px rgba(99,102,241,0.12)",
          }}
        >
          <Github size={18} className="ml-5 shrink-0" style={{ color: "#7678a0" }} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="https://github.com/username/repository"
            className="flex-1 bg-transparent px-4 py-4 outline-none text-sm"
            style={{
              color: "#e2e4ef",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
            }}
          />
          <button
            onClick={handleAnalyze}
            className="m-1.5 flex items-center gap-2 px-5 py-3 rounded-lg text-sm transition-all duration-200 shrink-0"
            style={{
              background: animating
                ? "linear-gradient(135deg, #22d3ee, #6366f1)"
                : "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "0.01em",
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            }}
          >
            {animating ? "Analyzing..." : "Analyze"}
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Hint text */}
        <p className="mt-3 text-center text-xs" style={{ color: "#4a4a6a", fontFamily: "'JetBrains Mono', monospace" }}>
          Paste any public GitHub repo URL and hit Analyze
        </p>
      </div>

      {/* Decorative stats row */}
      <div className="relative mt-16 flex items-center gap-10 flex-wrap justify-center">
        {[
          { value: "12k+", label: "Repos Analyzed" },
          { value: "98%", label: "Accuracy Rate" },
          { value: "<2s", label: "Avg. Response" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#e2e4ef" }}>{value}</div>
            <div style={{ fontSize: "12px", color: "#7678a0", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
