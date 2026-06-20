import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Results from "../Components/Results";
import { useRepo } from "../Hooks/useRepo";
import { setTheme } from "../Slices/homeSlice";
import SectionHeader from "../Components/SectionHeader";
import Hero from "../Components/Hero";
import HowItWorks from "../Components/HowItWorks";
import Samples from "../Components/Samples";
import Footer from "../Components/Footer";

const SAMPLE_REPOS = [
  "facebook/react",
  "vercel/next.js",
  "nodejs/node",
  "shadcn-ui/ui",
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Paste a Repo URL",
    description:
      "Drop any public GitHub repository link. Repo Role keeps the original analyze flow and sends the URL to your backend.",
    accent: "#6366f1",
  },
  {
    number: "02",
    title: "Sample Important Files",
    description:
      "The backend samples routes, services, controllers, components, hooks, config, and other high-signal source files.",
    accent: "#818cf8",
  },
  {
    number: "03",
    title: "Extract Code Evidence",
    description:
      "AST and structure detectors collect concrete evidence such as API routing, database usage, React hooks, and middleware.",
    accent: "#22d3ee",
  },
  {
    number: "04",
    title: "Rank Role Matches",
    description:
      "Normalized role signals are scored into ranked backend, frontend, and full-stack role matches with explainable evidence.",
    accent: "#34d399",
  },
];

const PREVIEW_REPOS = [
  {
    name: "facebook/react",
    role: "Frontend React Developer",
    health: 95,
    tags: ["React", "Hooks", "Components"],
    badge: "UI Heavy",
    color: "#818cf8",
  },
  {
    name: "vercel/next.js",
    role: "Full Stack JavaScript Developer",
    health: 91,
    tags: ["Routing", "Runtime", "Structure"],
    badge: "Full Stack",
    color: "#22d3ee",
  },
  {
    name: "expressjs/express",
    role: "Backend JavaScript Developer",
    health: 88,
    tags: ["API", "Middleware", "Node.js"],
    badge: "Backend",
    color: "#34d399",
  },
];

const METRICS = [
  { value: "AST", label: "source parsing" },
  { value: "3", label: "role tracks" },
  { value: "0", label: "manual tagging" },
];

export default function App() {
  const { repoData, loading, error, page, analyzeRepo, resetFlow } = useRepo();
  const [repoUrl, setRepoUrl] = useState("");
  const theme = useSelector((state) => state.repo.theme);
  const dispatch = useDispatch();
  const isDark = theme === "dark";

  if (page === "result" && repoData) {
    return (
      <Results
        data={repoData}
        onBack={resetFlow}
        onAnalyzeAgain={() => analyzeRepo(repoUrl)}
      />
    );
  }

  const analyzeSample = (repoName) => {
    setRepoUrl(`https://github.com/${repoName}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!repoUrl.trim() || loading) return;
    analyzeRepo(repoUrl);
  };

  return (
    <main
      className={`min-h-screen overflow-hidden ${
        isDark ? "bg-[#07071a] text-[#e2e4ef]" : "bg-[#f5f7ff] text-slate-950"
      }`}
      style={{
        fontFamily:
          "Manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)"
            : "linear-gradient(rgba(99,102,241,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.11) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed left-1/2 top-40 h-[620px] w-[860px] -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(34,211,238,0.08) 45%, transparent 72%)"
            : "radial-gradient(ellipse at center, rgba(99,102,241,0.25) 0%, rgba(34,211,238,0.15) 45%, transparent 72%)",
        }}
      />

      <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#07071a]/85 px-5 py-4 backdrop-blur-md md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
            aria-label="Repo Role home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
              RR
            </span>
            <span className="text-lg font-black tracking-tight text-white">
              RepoRole
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {["How it works", "Samples", "Analyze"].map((label) => (
              <a
                key={label}
                href={label === "Analyze" ? "#hero" : `#${label.toLowerCase().replaceAll(" ", "-")}`}
                className="text-sm font-semibold text-[#7678a0] transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => dispatch(setTheme(isDark ? "light" : "dark"))}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-[#e2e4ef] transition hover:border-indigo-400/60 hover:text-white"
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>
      <Hero
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        SAMPLE_REPOS={SAMPLE_REPOS}
        analyzeSample={analyzeSample}
        METRICS={METRICS}
        isDark={isDark}
      />

      <HowItWorks PROCESS_STEPS={PROCESS_STEPS} />

      <Samples PREVIEW_REPOS={PREVIEW_REPOS} />

      <Footer />
    </main>
  );
}
