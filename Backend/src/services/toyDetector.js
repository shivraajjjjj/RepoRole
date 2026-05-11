export function detectToyProject(projectSignals) {
  let toyScore = 0;

  if (!projectSignals.metadata?.hasReadme) {
    toyScore += 2; // strong signal
  }

  if (projectSignals.structure?.length <= 1) {
    toyScore += 1;
  }

  if (projectSignals.metadata?.fileCount !== undefined &&
      projectSignals.metadata.fileCount < 5) {
    toyScore += 2;
  }

  if (projectSignals.metadata?.repoName?.match(/tutorial|learn|practice/i)) {
    toyScore += 1;
  }

  // CRITICAL: high-signal override
  if (
    projectSignals.languages?.length >= 2 ||
    projectSignals.frameworks?.length >= 1
  ) {
    toyScore -= 2;
  }

  return toyScore >= 3;
}
