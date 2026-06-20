import { Link, Search, BarChart2, Download } from "lucide-react";

const steps = [
  {
    icon: Link,
    number: "01",
    title: "Paste a Repo URL",
    description:
      "Drop any public GitHub repository URL into the analyzer. We support repos of any size — from small utilities to massive monorepos.",
    accent: "#6366f1",
  },
  {
    icon: Search,
    number: "02",
    title: "We Parse the Codebase",
    description:
      "RepoRole crawls commit history, file structure, dependency graphs, and contributor activity to build a full picture of the project.",
    accent: "#818cf8",
  },
  {
    icon: BarChart2,
    number: "03",
    title: "AI Generates Insights",
    description:
      "Our model identifies tech stack, code quality signals, contributor roles, security hotspots, and architectural patterns.",
    accent: "#22d3ee",
  },
  {
    icon: Download,
    number: "04",
    title: "Export Your Report",
    description:
      "Download a structured report or share a live link. Integrate with your existing workflow via our API.",
    accent: "#34d399",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 md:px-12 py-28"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Section divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)" }}
      />

      {/* Header */}
      <div className="text-center mb-20">
        <p
          className="mb-3 text-xs tracking-widest uppercase"
          style={{ color: "#6366f1", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          Process
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-1.5px",
            color: "#e2e4ef",
          }}
        >
          How It Works
        </h2>
        <p className="mt-4 max-w-xl mx-auto" style={{ color: "#7678a0", lineHeight: 1.7, fontSize: "15px" }}>
          Four simple steps from repo URL to actionable intelligence. No signup required to start.
        </p>
      </div>

      {/* Steps grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map(({ icon: Icon, number, title, description, accent }) => (
          <div
            key={number}
            className="group relative p-8 rounded-2xl transition-all duration-300"
            style={{
              background: "#0e0e24",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = `1px solid ${accent}33`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${accent}18`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Step number */}
            <span
              className="absolute top-6 right-8"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#4a4a6a",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {number}
            </span>

            {/* Icon */}
            <div
              className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
              <Icon size={22} style={{ color: accent }} />
            </div>

            <h3
              className="mb-3"
              style={{ fontWeight: 700, fontSize: "18px", color: "#e2e4ef", letterSpacing: "-0.3px" }}
            >
              {title}
            </h3>
            <p style={{ color: "#7678a0", lineHeight: 1.7, fontSize: "14px" }}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
