import './config/env.js';
import axios from "axios";
import {MANIFEST_FILES} from "./services/scanner.service.js";
import {parseRepoUrl} from "./utils/parser.js";
const _rawBase = process.env.GITHUB_API_BASE_URL ?? '';
const _rawToken = process.env.GITHUB_TOKEN ?? '';
const GITHUB_API_BASE_URL = _rawBase.trim().replace(/^\"|\"$/g, '');
const GITHUB_TOKEN = _rawToken.trim().replace(/^\"|\"$/g, '');

export const githubClient = axios.create({
    baseURL: GITHUB_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json'
    }
});

const { owner, repo } = parseRepoUrl("https://github.com/shivraajjjjj/RepoRole");
const fetchtree = async (owner, repo) => {
  const res = await githubClient.get(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
      return res.data.tree;
};

const fetchManifests = async (owner, repo, path = '') => {
  const manifests = [];
  const contents = await fetchtree(owner, repo);

    const filtered = contents.filter(item => MANIFEST_FILES.includes(item.path.split('/').pop()));

    for (const item of filtered) {
      const contentRes = await githubClient.get(`repos/${owner}/${repo}/contents/${item.path}`);
      const content = Buffer.from(contentRes.data.content, "base64").toString("utf-8");
      manifests.push({ name: item.path.split('/').pop(), path: item.path, content });
    }
    return manifests;
};

const showManifests = async () => {
  try {
    const manifests = await fetchManifests(owner, repo);
    for (const manifest of manifests) {
        console.log(`${manifest.name} at ${manifest.path}:\n${manifest.content}\n---\n`);
    }
  } 
catch (err) {
    console.error("Error fetching manifests:", err.message);
  }
};
showManifests();