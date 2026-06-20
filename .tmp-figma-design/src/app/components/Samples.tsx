import { Star, GitFork, Eye, ExternalLink } from "lucide-react";

const samples = [
  {
    name: "vercel/next.js",
    description: "The React Framework for the Web. Production-grade apps with hybrid SSR, file-system routing, and edge functions.",
    stars: "124k",
    forks: "26.5k",
    watchers: "1.2k",
    languages: ["TypeScript", "JavaScript", "CSS"],
    primaryLang: "TypeScript",
    langColor: "#3178c6",
    health: 97,
    contributors: 3100,
    lastCommit: "2 hours ago",
    badge: "Highly Active",
    badgeColor: "#22d3ee",
  },
  {
    name: "facebook/react",
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces across platforms.",
    stars: "228k",
    forks: "46.4k",
    watchers: "6.7k",
    languages: ["JavaScript", "TypeScript", "Flow"],
    primaryLang: "JavaScript",
    langColor: "#f7df1e",
    health: 95,
    contributors: 1650,
    lastCommit: "1 day ago",
    badge: "Legendary",
    badgeColor: "#818cf8",
  },
  {
    name: "shadcn-ui/ui",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS. Copy, paste, and customize.",
    stars: "81k",
    forks: "5.1k",
    watchers: "382",
    languages: ["TypeScript", "MDX"],
    primaryLang: "TypeScript",
    langColor: "#3178c6",
    health: 91,
    contributors: 480,
    lastCommit: "3 hours ago",
    badge: "Trending",
    badgeColor: "#34d399",
  },
  {
    name: "torvalds/linux",
    description: "The Linux kernel — the core of the open-source Linux operating system used worldwide.",
    stars: "182k",
    forks: "53k",
    watchers: "10.2k",
    languages: ["C", "Assembly", "Shell"],
    primaryLang: "C",
    langColor: "#555555",
    health: 99,
    contributors: 29000,
    lastCommit: "6 hours ago",
    badge: "Monumental",
    badgeColor: "#f97316",
  },
];

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  CSS: "#663399",
  Flow: "#f7a800",
  MDX: "#1b1f24",
  C: "#555555",
  Assembly: "#6E4C13",
  Shell: "#89e051",
};

export function Samples() {
  return (
    <section
      id="samples"
      className="relative px-6 md:px-12 py-28"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(34,211,238,0.5), transparent)" }}
      />

      {/* Header */}
      <div className="text-center mb-16">
        <p
          className="mb-3 text-xs tracking-widest uppercase"
          style={{ color: "#22d3ee", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          Sample Reports
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-1.5px",
            color: "#e2e4ef",
          }}
        >
          See It In Action
        </h2>
        <p className="mt-4 max-w-xl mx-auto" style={{ color: "#7678a0", lineHeight: 1.7, fontSize: "15px" }}>
          Here's what RepoRole surfaces when analyzing popular open-source repositories.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {samples.map((repo) => (
          <div
            key={repo.name}
            className="group relative p-7 rounded-2xl flex flex-col gap-5 transition-all duration-300 cursor-pointer"
            style={{
              background: "#0e0e24",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(99,102,241,0.3)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(99,102,241,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#e2e4ef",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {repo.name}
                  </h3>
                  <ExternalLink size={12} style={{ color: "#7678a0", flexShrink: 0 }} />
                </div>
                <p style={{ color: "#7678a0", fontSize: "13px", lineHeight: 1.6 }}>{repo.description}</p>
              </div>
              <span
                className="shrink-0 px-2.5 py-1 rounded-full text-xs"
                style={{
                  background: `${repo.badgeColor}18`,
                  border: `1px solid ${repo.badgeColor}40`,
                  color: repo.badgeColor,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                }}
              >
                {repo.badge}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5 flex-wrap">
              {[
                { icon: Star, value: repo.stars },
                { icon: GitFork, value: repo.forks },
                { icon: Eye, value: repo.watchers },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-1.5" style={{ color: "#7678a0", fontSize: "13px" }}>
                  <Icon size={13} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-auto" style={{ color: "#4a4a6a", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                Updated {repo.lastCommit}
              </div>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 flex-wrap">
              {repo.languages.map((lang) => (
                <span
                  key={lang}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#9698b8",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: langColors[lang] ?? "#888", flexShrink: 0 }}
                  />
                  {lang}
                </span>
              ))}
            </div>

            {/* Health bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", color: "#7678a0", fontFamily: "'JetBrains Mono', monospace" }}>
                  Repo Health
                </span>
                <span style={{ fontSize: "12px", color: "#22d3ee", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {repo.health}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${repo.health}%`,
                    background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
