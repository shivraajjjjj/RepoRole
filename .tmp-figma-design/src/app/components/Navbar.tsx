import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      style={{ fontFamily: "'Manrope', sans-serif" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
      aria-label="Main navigation"
    >
      {/* Glass background */}
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: "rgba(7,7,26,0.82)", borderBottom: "1px solid rgba(255,255,255,0.07)" }} />

      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="relative flex items-center gap-2.5 group"
        aria-label="RepoRole home"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            boxShadow: "0 0 18px rgba(99,102,241,0.45)",
          }}
        >
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff", letterSpacing: "-0.5px" }}>
            RR
          </span>
        </div>
        <span style={{ fontWeight: 800, fontSize: "18px", color: "#e2e4ef", letterSpacing: "-0.3px" }}>
          RepoRole
        </span>
      </button>

      {/* Desktop nav links */}
      <div className="relative hidden md:flex items-center gap-8">
        {["About Us", "How It Works", "Samples"].map((label) => (
          <button
            key={label}
            onClick={() => scrollTo(label.toLowerCase().replace(/\s+/g, "-"))}
            className="text-sm transition-colors duration-200"
            style={{ color: "#7678a0", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e4ef")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7678a0")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CTA button */}
      <div className="relative hidden md:flex items-center gap-3">
        <button
          className="px-5 py-2 rounded-lg text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 0 20px rgba(99,102,241,0.35)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(99,102,241,0.6)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.35)"; }}
        >
          Sign Up
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        className="relative md:hidden p-2 rounded-md"
        style={{ color: "#7678a0" }}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col gap-1 p-4"
          style={{ background: "rgba(7,7,26,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {["About Us", "How It Works", "Samples"].map((label) => (
            <button
              key={label}
              onClick={() => scrollTo(label.toLowerCase().replace(/\s+/g, "-"))}
              className="text-left py-3 px-2 text-sm border-b transition-colors"
              style={{ color: "#7678a0", borderColor: "rgba(255,255,255,0.06)", fontWeight: 500 }}
            >
              {label}
            </button>
          ))}
          <button
            className="mt-3 px-5 py-2.5 rounded-lg text-sm"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff", fontWeight: 600 }}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
