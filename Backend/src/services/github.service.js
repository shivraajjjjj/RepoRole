import axios from 'axios';
import { parseRepoUrl } from '../utils/parser.js';
import '../config/env.js';

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

const MANIFEST_FILES = [
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "CMakeLists.txt",
];

const IMPORTANT_FILES = [
    ...MANIFEST_FILES,
    "Dockerfile",
    "README.md",
]


export async function fetchRepoData(repoUrl) {

    try {
        if (!GITHUB_API_BASE_URL || !GITHUB_TOKEN) {
            throw new Error('GitHub API configuration is missing');
        }
        const { owner, repo } = parseRepoUrl(repoUrl);
        const [meta, languages, structure] = await Promise.all([
            fetchRepoMeta(owner, repo),
            fetchRepoLanguages(owner, repo),
            fetchRepoStructure(owner, repo)
        ]);

        const files = await fetchImportantFiles(structure);


        const result = {
            meta,
            languages,
            structure,
            files
        };

        return result;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const notFoundError = new Error('Repository not found');
            notFoundError.status = 404;
            notFoundError.clientMessage = 'Repository not found';
            throw notFoundError;
        }
        if (err.response && err.response.status === 403) {
            const rateLimitError = new Error('API rate limit exceeded');
            rateLimitError.status = 403;
            rateLimitError.clientMessage = 'API rate limit exceeded';
            throw rateLimitError;
        }
        throw err;
    }
}
const fetchRepoMeta = async (owner, repo) => {
        const res = await githubClient.get(`/repos/${owner}/${repo}`);
        return res.data;
};

const fetchRepoLanguages = async (owner, repo) => {
        const res = await githubClient.get(`/repos/${owner}/${repo}/languages`);
        return res.data;
};

export async function fetchRepoStructure(owner, repo) {
    const res = await githubClient.get(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
    return res.data.tree;
}
export const fetchContent = async(owner, repo, path='') => {
    const url = path ? `repos/${owner}/${repo}/contents/${path}` : `repos/${owner}/${repo}/contents`;
    return githubClient.get(url);
};

const fetchImportantFiles = async (structure) => {
    const importantFiles = structure.filter( item => IMPORTANT_FILES.includes(item.path.split('/').pop()));
    
    return importantFiles;
};

export async function fetchManifests(importantFiles, repoMeta) {
        const files = [];
        const manifestFiles = importantFiles.filter(item => MANIFEST_FILES.includes(item.path.split('/').pop()));

        for (const item of manifestFiles) {
            const contentRes = await githubClient.get(`repos/${repoMeta.owner.login}/${repoMeta.name}/contents/${item.path}`);
            
            files.push(contentRes.data);
        }
        return files;
}
