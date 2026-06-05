import jobs from "../../jobs.js";

const MAX_RESULTS = 3;
const MAX_OCCURRENCE_BONUS = 0.2;
const MAX_DISTRIBUTION_BONUS = 0.3;

/**
 * Rank roles using normalized engineering signals.
 *
 * Role configuration weights remain dominant. Repeated evidence and evidence
 * spread across files provide bounded boosts so one noisy file cannot
 * overpower a role definition.
 */
export function scoreRepository(roleSignals = {}) {
  return jobs
    .map(role => scoreRole(role, roleSignals))
    .filter(role => role.finalScore > 0)
    .sort(compareRoles)
    .slice(0, MAX_RESULTS)
    .map((role, index) => ({
      ...role,
      rank: index + 1
    }));
}

function scoreRole(role, roleSignals) {
  const configuredSignals = Object.entries(role.signals);
  const maximumBaseScore = sum(configuredSignals.map(([, weight]) => weight));
  const matchedSignals = [];
  let weightedScore = 0;

  for (const [signal, points] of configuredSignals) {
    const evidence = roleSignals[signal];
    if (!evidence) continue;

    const occurrences = evidence.occurrences ?? 0;
    const distribution = Object.keys(evidence.filePaths ?? {}).length;
    const occurrenceBonus = calculateOccurrenceBonus(occurrences);
    const distributionBonus = calculateDistributionBonus(distribution);
    const weightedPoints = round(points * (1 + occurrenceBonus + distributionBonus));

    weightedScore += weightedPoints;
    matchedSignals.push({
      signal,
      points,
      weightedPoints,
      occurrences,
      distribution,
      occurrenceBonus,
      distributionBonus,
      filePaths: evidence.filePaths ?? {}
    });
  }

  const coverage = configuredSignals.length === 0
    ? 0
    : matchedSignals.length / configuredSignals.length;
  const finalScore = maximumBaseScore === 0
    ? 0
    : round(Math.min(100, (weightedScore / maximumBaseScore) * 100));

  return {
    roleId: role.id,
    title: role.title,
    rawScore: `${round(weightedScore)}/${maximumBaseScore}`,
    finalScore,
    confidence: round(coverage * 100),
    matchedSignals
  };
}

function calculateOccurrenceBonus(occurrences) {
  if (occurrences <= 1) return 0;
  return round(Math.min(MAX_OCCURRENCE_BONUS, Math.log2(occurrences) * 0.05));
}

function calculateDistributionBonus(distribution) {
  if (distribution <= 1) return 0;
  return round(Math.min(MAX_DISTRIBUTION_BONUS, Math.log2(distribution) * 0.1));
}

function compareRoles(a, b) {
  return b.finalScore - a.finalScore
    || b.confidence - a.confidence
    || b.matchedSignals.length - a.matchedSignals.length
    || a.roleId - b.roleId;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function round(value) {
  return Math.round(value * 100) / 100;
}
