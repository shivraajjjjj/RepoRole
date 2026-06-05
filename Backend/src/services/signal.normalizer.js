const SIGNAL_NORMALIZATION_RULES = [
  createRule("node_runtime", ["middleware", "API Routing"]),
  createRule("express_framework", ["middleware", "API Routing"]),
  createRule("database_usage", ["Database Operation"]),
  createRule("authentication", ["authentication", "password handling"]),
  createRule("api_integration", ["API Routing"]),
  createRule("project_structure", ["controller", "service"]),
  createRule("ci_cd", ["CI/CD"]),
  createRule("dockerization", ["dockerization"]),
  createRule("react_framework", ["react framework"]),
  createRule("component_architecture", ["component"]),
  createRule("react_hooks", ["react hooks"]),
  createRule("frontend_routing", ["frontend routing"]),
  createRule("state_management", ["state management"]),
  createRule("asynchronous_operations", ["asynchronous operations"]),
  createRule("environment_variables", ["environment variables"]),
  createRule("testing", ["testing"])
];

/**
 * Convert detailed AST and structure evidence into generalized role signals.
 *
 * The detailed map is returned unchanged and unmapped signals are called out
 * explicitly. This keeps normalization lossless while scoring remains a
 * separate concern.
 */
export function generalizeRoleSignals(detailedSignals = {}) {
  const roleSignals = {};
  const mappedSignalKeys = new Set();

  for (const [detailKey, detail] of Object.entries(detailedSignals)) {
    const matchingRules = SIGNAL_NORMALIZATION_RULES.filter(rule => rule.matches(detail));

    for (const rule of matchingRules) {
      mappedSignalKeys.add(detailKey);
      addEvidence(roleSignals, rule.roleSignal, detailKey, detail);
    }
  }

  const unmappedSignals = Object.fromEntries(
    Object.entries(detailedSignals).filter(([key]) => !mappedSignalKeys.has(key))
  );

  return {
    roleSignals,
    detailedSignals,
    unmappedSignals
  };
}

function createRule(roleSignal, categories) {
  const allowedCategories = new Set(categories);
  return {
    roleSignal,
    matches: detail => allowedCategories.has(detail.category)
  };
}

function addEvidence(roleSignals, roleSignal, detailKey, detail) {
  const target = roleSignals[roleSignal] ?? {
    signal: roleSignal,
    occurrences: 0,
    filePaths: {},
    sources: []
  };

  target.occurrences += detail.occurrences ?? 0;
  mergeFilePaths(target.filePaths, detail.filePaths);
  target.sources.push({
    key: detailKey,
    signal: detail.signal,
    category: detail.category,
    evidence: detail.evidence,
    occurrences: detail.occurrences ?? 0,
    filePaths: detail.filePaths ?? {}
  });

  roleSignals[roleSignal] = target;
}

function mergeFilePaths(target, source = {}) {
  for (const [filePath, occurrences] of Object.entries(source)) {
    target[filePath] = (target[filePath] ?? 0) + occurrences;
  }
}
