import parser from "@babel/parser";
import { fetchRepoStructure, fetchContent } from "./github.service.js";
import { parseRepoUrl } from "../utils/parser.js";

export const MANIFEST_FILES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "CMakeLists.txt",
  "Dockerfile",
  "README.md"
];

const CODE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_PATH_PARTS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  "vendor",
  "fixtures",
  "flow-typed",
  "bench"
]);

const SAMPLE_LIMITS = {
  entrypoint: 4,
  route: 4,
  controller: 6,
  service: 6,
  middleware: 4,
  model: 4,
  auth: 4,
  config: 4,
  hook: 4,
  store: 4,
  component: 8,
  page: 4,
  util: 4,
  test: 4,
  other: 6
};

const PER_DIRECTORY_LIMIT = 2;

export async function scanRepository(repoUrl) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const structure = await fetchRepoStructure(owner, repo);
  return await JSTSFiles(owner, repo, structure);
}

export function scanAndClassifyFiles(structure) {
  const classifiedFiles = createEmptyClassification();

  for (const item of structure) {
    if (!isScannableCodeFile(item)) continue;

    const category = classifyCodeFile(item.path);
    classifiedFiles[category].push(item);
  }

  return {
    classifiedFiles,
    selectedFiles: selectSampleFiles(classifiedFiles)
  };
}

export function classifyFilesByType(structure) {
  return scanAndClassifyFiles(structure).classifiedFiles;
}

export function selectSampleFiles(classifiedFiles) {
  const selected = new Map();

  for (const [category, files] of Object.entries(classifiedFiles)) {
    const limit = SAMPLE_LIMITS[category] ?? SAMPLE_LIMITS.other;
    for (const file of selectCategorySamples(files, limit)) {
      selected.set(file.path, file);
    }
  }

  return [...selected.values()];
}

export async function JSTSFiles(owner, repo, structure) {
  const { selectedFiles } = scanAndClassifyFiles(structure);
  const parsedFiles = [];

  for (const item of selectedFiles) {
    const contentRes = await fetchContent(owner, repo, item.path);
    const content = Buffer.from(contentRes.data.content, "base64").toString("utf-8");

    try {
      const ast = parser.parse(content, {
        sourceType: "module",
        plugins: [
          "typescript",
          "jsx",
          "classProperties",
          "decorators-legacy",
          "dynamicImport"
        ]
      });

      parsedFiles.push({ path: item.path, ast });
    } catch (err) {
      console.error(`Error parsing file ${item.path}:`, err.message);
    }
  }

  return {
    selectedFiles: selectedFiles.map(file => file.path),
    parsedFiles
  }
}

function createEmptyClassification() {
  return Object.fromEntries(
    Object.keys(SAMPLE_LIMITS).map(category => [category, []])
  );
}

function isScannableCodeFile(item) {
  if (item?.type !== "blob") return false;
  if (hasIgnoredPathPart(item.path)) return false;
  return CODE_EXTENSIONS.has(getExtension(item.path));
}

function classifyCodeFile(filePath) {
  const lowerPath = normalizePath(filePath);
  const fileName = lowerPath.split("/").pop();
  const parts = lowerPath.split("/");

  if (isEntrypoint(fileName)) return "entrypoint";
  if (matchesPart(parts, "route") || matchesPart(parts, "router")) return "route";
  if (matchesPart(parts, "controller")) return "controller";
  if (matchesPart(parts, "service")) return "service";
  if (matchesPart(parts, "middleware")) return "middleware";
  if (matchesPart(parts, "model") || matchesPart(parts, "schema")) return "model";
  if (matchesPart(parts, "auth") || matchesPart(parts, "security")) return "auth";
  if (matchesPart(parts, "config") || fileName.includes(".config.")) return "config";
  if (matchesPart(parts, "hook")) return "hook";
  if (matchesPart(parts, "store") || matchesPart(parts, "slice")) return "store";
  if (matchesPart(parts, "component")) return "component";
  if (matchesPart(parts, "page") || matchesPart(parts, "view")) return "page";
  if (matchesPart(parts, "util") || matchesPart(parts, "helper") || matchesPart(parts, "lib")) return "util";
  if (isTestPath(parts, fileName)) return "test";

  return "other";
}

function selectCategorySamples(files, limit) {
  const sorted = [...files].sort(compareFilePriority);
  const selected = [];
  const selectedPaths = new Set();
  const byDirectory = groupByDirectory(sorted);

  for (const directoryFiles of byDirectory.values()) {
    for (const file of directoryFiles.slice(0, PER_DIRECTORY_LIMIT)) {
      addSelected(file, selected, selectedPaths, limit);
    }
  }

  for (const file of sorted) {
    addSelected(file, selected, selectedPaths, limit);
  }

  return selected;
}

function addSelected(file, selected, selectedPaths, limit) {
  if (selected.length >= limit || selectedPaths.has(file.path)) return;
  selected.push(file);
  selectedPaths.add(file.path);
}

function groupByDirectory(files) {
  const grouped = new Map();

  for (const file of files) {
    const directory = getDirectory(file.path);
    const directoryFiles = grouped.get(directory) ?? [];
    directoryFiles.push(file);
    grouped.set(directory, directoryFiles);
  }

  return grouped;
}

function compareFilePriority(a, b) {
  return getFilePriority(a.path) - getFilePriority(b.path)
    || a.path.length - b.path.length
    || a.path.localeCompare(b.path);
}

function getFilePriority(filePath) {
  const fileName = normalizePath(filePath).split("/").pop();

  if (isEntrypoint(fileName)) return 0;
  if (fileName.startsWith("index.")) return 1;
  if (fileName.includes("route") || fileName.includes("controller")) return 2;
  if (fileName.includes("service") || fileName.includes("middleware")) return 3;
  if (fileName.includes("hook") || fileName.includes("component")) return 4;
  if (fileName.includes("test") || fileName.includes("spec")) return 5;
  return 10;
}

function hasIgnoredPathPart(filePath) {
  return normalizePath(filePath)
    .split("/")
    .some(part => IGNORED_PATH_PARTS.has(part));
}

function isEntrypoint(fileName) {
  return /^(app|server|main|index)\.(js|jsx|ts|tsx)$/.test(fileName);
}

function isTestPath(parts, fileName) {
  return parts.some(part => part === "test" || part === "tests" || part === "__tests__")
    || fileName.includes(".test.")
    || fileName.includes(".spec.");
}

function matchesPart(parts, term) {
  return parts.some(part => part.includes(term));
}

function getDirectory(filePath) {
  const parts = normalizePath(filePath).split("/");
  parts.pop();
  return parts.join("/") || ".";
}

function getExtension(filePath) {
  const fileName = normalizePath(filePath).split("/").pop();
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index);
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/").toLowerCase();
}
