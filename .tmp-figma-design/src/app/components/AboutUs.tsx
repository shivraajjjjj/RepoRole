import { Github, Twitter, Linkedin } from "lucide-react";

const team = [
  {
    name: "Aryan Mehta",
    role: "Co-Founder & CEO",
    bio: "Former GitHub engineer. Built internal tooling used by 40k developers. Obsessed with developer productivity.",
    avatar: "AM",
    avatarGrad: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & CTO",
    bio: "ML researcher turned product engineer. Led AI infrastructure at two YC-backed startups before founding RepoRole.",
    avatar: "PS",
    avatarGrad: "linear-gradient(135deg, #22d3ee, #6366f1)",
  },
  {
    name: "Luca Bianchi",
    role: "Lead Engineer",
    bio: "Open-source maintainer of 8 widely-used packages. Contributor to Rust, Go, and the WASM ecosystem.",
    avatar: "LB",
    avatarGrad: "linear-gradient(135deg, #34d399, #22d3ee)",
  },
];

export function AboutUs() {
  return (
    <section
      id="about-us"
      className="relative px-6 md:px-12 py-28"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)" }}
      />

      {/* Header */}
      <div className="text-center mb-20">
        <p
          className="mb-3 text-xs tracking-widest uppercase"
          style={{ color: "#6366f1", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          The Team
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-1.5px",
            color: "#e2e4ef",
          }}
        >
          About Us
        </h2>
        <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#7678a0", lineHeight: 1.8, fontSize: "15px" }}>
          We're a small team of developers who got tired of spending hours deciphering unfamiliar codebases.
          RepoRole was born out of a simple belief: understanding a repository should take minutes, not days.
        </p>
      </div>

      {/* Mission banner */}
      <div
        className="max-w-4xl mx-auto mb-16 p-8 rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)" }}
        />
        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "#c4c6d8",
            lineHeight: 1.75,
            fontWeight: 500,
          }}
        >
          "We believe every developer deserves instant clarity — whether you're evaluating a dependency,
          onboarding to a new codebase, or doing due diligence on an acquisition.{" "}
          <span style={{ color: "#818cf8" }}>RepoRole is that clarity layer.</span>"
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", fontWeight: 800, color: "#fff" }}
          >
            AM
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#e2e4ef", fontWeight: 600 }}>Aryan Mehta</div>
            <div style={{ fontSize: "11px", color: "#7678a0", fontFamily: "'JetBrains Mono', monospace" }}>CEO, RepoRole</div>
          </div>
        </div>
      </div>

      {/* Team cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map(({ name, role, bio, avatar, avatarGrad }) => (
          <div
            key={name}
            className="p-7 rounded-2xl flex flex-col gap-4 transition-all duration-300"
            style={{ background: "#0e0e24", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(99,102,241,0.25)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: avatarGrad, fontWeight: 800, fontSize: "16px", color: "#fff", letterSpacing: "-0.5px" }}
            >
              {avatar}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "16px", color: "#e2e4ef" }}>{name}</div>
              <div
                style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}
              >
                {role}
              </div>
            </div>

            <p style={{ color: "#7678a0", fontSize: "13px", lineHeight: 1.7, flexGrow: 1 }}>{bio}</p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="p-1.5 rounded-md transition-colors duration-200"
                  style={{ color: "#4a4a6a" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#818cf8")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#4a4a6a")}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
