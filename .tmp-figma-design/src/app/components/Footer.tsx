import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{
        fontFamily: "'Manrope', sans-serif",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
        >
          <span style={{ fontWeight: 800, fontSize: "11px", color: "#fff" }}>RR</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "15px", color: "#e2e4ef" }}>RepoRole</span>
      </div>

      <p style={{ color: "#4a4a6a", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
        © 2026 RepoRole. Built with ♥ for developers.
      </p>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 transition-colors duration-200"
        style={{ color: "#7678a0", fontSize: "13px" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#818cf8")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#7678a0")}
      >
        <Github size={15} />
        Open Source
      </a>
    </footer>
  );
}
