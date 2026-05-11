import ResultHeader from "./ResultHeader";
import InfoCard from "./InfoCard";
import SummaryCard from "./SummaryCard";
import RoleCard from "./RoleCard";
import PillList from "./PillList";

export default function Results({ data, onBack, onAnalyzeAgain }) {
  const normalized = data?.projectSignals || data?.data || data?.result || data || {};
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
  } = normalized;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        <ResultHeader onBack={onBack} onAnalyzeAgain={onAnalyzeAgain} />

        {/* Info */}
        <section className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Repository">
            <div className="space-y-1 text-sm">
              <div className="text-orange-400 font-medium">
                {repo.owner}/{repo.name}
              </div>
              <a href={repo.url} target="_blank" className="text-orange-300 hover:underline">
                {repo.url}
              </a>

              {metadata?.isToy && (
                <div className="text-yellow-400">⚠ Toy Project</div>
              )}
              {metadata?.isMonorepo && (
                <div className="text-yellow-400">⚠ Monorepo</div>
              )}
            </div>
          </InfoCard>

          <InfoCard title="Structure">
            <PillList items={structure} emptyLabel="No folders detected" />
          </InfoCard>
        </section>

        {/* Roles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-orange-400">
            Role Matches ({roles.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role, i) => (
              <RoleCard key={i} role={role} />
            ))}
          </div>
        </section>

        {/* Stack */}
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