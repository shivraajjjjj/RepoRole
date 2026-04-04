import { useRepo } from "../Hooks/useRepo";
import Results from "../Components/Results";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../Slices/homeSlice";

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
