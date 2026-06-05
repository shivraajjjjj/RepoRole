import { fetchRepoData, fetchManifests } from "./github.service.js";
import { extractSignals } from "./signal.service.js";
import { scoreRepository } from "../engines/scoring.engine.js";
import { detectToyProject } from "./toyDetector.js";
import { JSTSFiles } from "./scanner.service.js";
import { generalizeRoleSignals } from "./signal.normalizer.js";

export async function analyzeRepository(repoUrl) {
  const repoData = await fetchRepoData(repoUrl);
  const projectSignals = createProjectSignals(repoUrl, repoData);
  const manifests = await fetchManifests(repoData.files, repoData.meta);

  extractSignals(manifests, projectSignals);
  convertSetsToArrays(projectSignals);

  const detailedSignals = await JSTSFiles(
    repoData.meta.owner.login,
    repoData.meta.name,
    repoData.structure
  );
  const { roleSignals, unmappedSignals } = generalizeRoleSignals(detailedSignals);

  projectSignals.metadata.isToy = detectToyProject(projectSignals);
  projectSignals.roles = scoreRepository(roleSignals);

  return {
    ...projectSignals,
    roleSignals,
    detailedSignals,
    unmappedSignals
  };
}

function createProjectSignals(repoUrl, repoData) {
  const structure = repoData.structure
    .filter(item => item.type === "tree")
    .map(item => item.path);

  return {
    repo: {
      owner: repoData.meta.owner.login,
      name: repoData.meta.name,
      url: repoUrl
    },
    languages: Object.keys(repoData.languages ?? {}),
    runtime: new Set(),
    frameworks: new Set(),
    databases: new Set(),
    buildFiles: new Set(),
    structure,
    flags: new Set(),
    roles: [],
    metadata: {
      isToy: false,
      hasReadme: repoData.files.some(file => file.path.split("/").pop() === "README.md"),
      isMonorepo: false,
      supported: true,
      fileCount: repoData.structure.filter(item => item.type === "blob").length,
      repoName: repoData.meta.name
    }
  };
}

function convertSetsToArrays(projectSignals) {
  for (const key of ["runtime", "frameworks", "databases", "buildFiles", "flags"]) {
    projectSignals[key] = [...projectSignals[key]];
  }
}
