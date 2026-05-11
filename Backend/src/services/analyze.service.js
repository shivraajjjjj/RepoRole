import { fetchRepoData,fetchManifests} from "./github.service.js";
import { extractSignals } from "./signal.service.js";
import { MANIFEST_FILES } from "./scanner.service.js";
import { scoreRepository } from "../engines/scoring.engine.js";
import { detectToyProject } from "./toyDetector.js";
export async function analyzeRepository(repoUrl) {
    const repoData =  await fetchRepoData(repoUrl);

    const projectSignals = {
  repo: {
    owner: repoData.meta.owner.login,
    name: repoData.meta.name,
    url: repoUrl
  },
  languages: Object.keys(repoData.languages || {}),
  runtime: new Set(),
  frameworks: new Set(),
  databases: new Set(),
  buildFiles: new Set(),
  structure: repoData.structure.filter(item => item.type === 'tree').map(item => item.path),
  flags: new Set(),
  roles: [],
  metadata: {
    isToy: false,
    hasReadme: !!repoData.files["README.md"],
    isMonorepo: false,
    supported: true
  }
};
const manifests = await fetchManifests(repoData.files, repoData.meta);

extractSignals(manifests, projectSignals);

// Convert Set collections to arrays for downstream processing
projectSignals.runtime = [...projectSignals.runtime];
projectSignals.frameworks = [...projectSignals.frameworks];
projectSignals.databases = [...projectSignals.databases];
projectSignals.buildFiles = [...projectSignals.buildFiles];
projectSignals.flags = [...projectSignals.flags];

projectSignals.metadata.isToy = detectToyProject(projectSignals);

// scoring may be async; await to get final roles array
projectSignals.roles = await scoreRepository(projectSignals);

 return projectSignals;
 
}