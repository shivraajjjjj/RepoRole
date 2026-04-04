export default function Results({ data, onBack, onAnalyzeAgain }) {
  const {
    repo = {},
    runtime = [],
    frameworks = [],
    databases = [],
    languages = [],
    buildFiles = [],
    structure = [],
    flags = [],
    roles = [],
    metadata = {},
  } = data;
  console.log("Result Data:", data);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-930 to-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">RepoSense</p>
            <h1 className="text-2xl font-bold">Analysis Results</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition"
            >
              ← Back
            </button>
            <button
              onClick={onAnalyzeAgain}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold shadow-lg shadow-blue-500/20"
            >
              Analyze Again
            </button>
          </div>
        </header>

        {/* Info section */}
        <section className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Repository">
            <div className="space-y-1 text-sm">
              <div className="text-gray-400">{repo.owner}/{repo.name}</div>
              <a className="text-blue-300 hover:underline" href={repo.url} target="_blank" rel="noreferrer">
                {repo.url}
              </a>
              {metadata?.isToy && (
                <div className="text-amber-300">⚠️ Marked as toy project</div>
              )}
              {metadata?.isMonorepo && (
                <div className="text-amber-300">⚠️ Monorepo detected</div>
              )}
            </div>
          </InfoCard>
          <InfoCard title="Structure">
            <PillList items={structure} emptyLabel="No folders detected" />
          </InfoCard>
        </section>
         {/* Roles */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Role Matches</h2>
            <span className="text-sm text-gray-400">{roles.length} roles</span>
          </div>
          {roles.length === 0 && (
            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-400">
              No roles detected.
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map(role => (
              <RoleCard key={role.title || role.role} role={role} />
            ))}
          </div>
        </section>

        {/* Stack summary */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SummaryCard title="Runtimes" value={runtime} />
          <SummaryCard title="Frameworks" value={frameworks} />
          <SummaryCard title="Databases" value={databases} />
          <SummaryCard title="Languages" value={languages} />
          <SummaryCard title="Build Files" value={buildFiles} />
          <SummaryCard title="Flags" value={flags} />
        </section>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800 space-y-2">
      <div className="text-sm text-gray-400">{title}</div>
      {children}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <PillList items={value} emptyLabel="—" />
    </div>
  );
}

function PillList({ items, emptyLabel }) {
  if (!items || items.length === 0) {
    return <div className="text-gray-500 text-sm">{emptyLabel}</div>;
  }
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700">
          {item}
        </span>
      ))}
    </div>
  );
}

function RoleCard({ role }) {
  const matched = role.matchedSignals || [];
  const rawScore = role.rawScore || "0/100";
  const finalScore = role.finalScore ?? role.score ?? 0;
  const confidence = role.confidence ?? 0;

  return (
    <div className="p-5 rounded-xl bg-gray-900/70 border border-gray-800 space-y-3 shadow-lg shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{role.title || role.role || "Role"}</h3>
          <div className="text-sm text-gray-400">Raw score: {rawScore}</div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs bg-gray-800 border border-gray-700">
          Final: {Math.round(Number(finalScore) || 0)}
        </span>
      </div>

      <Bar label="Final Score" value={finalScore} color="bg-green-500" />
      <Bar label="Confidence" value={confidence} color="bg-blue-500" />

      {matched.length > 0 && (
        <div className="text-sm text-gray-300 space-y-2">
          <div className="font-semibold text-gray-200">Why this role?</div>
          <ul className="list-disc list-inside space-y-1">
            {matched.map((s, i) => (
              <li key={i}>{s.signal} (+{s.points})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Bar({ label, value, color }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-300">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-2 ${color} rounded-full transition-all`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
