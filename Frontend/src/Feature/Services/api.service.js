import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const GetResults = async ({ repoUrl }) => {
    const res = await axios.post(`${API_BASE}/analyze/your-roles`, {
        repo: repoUrl.trim(),
    });

    const json = res.data;

    if (!json.supported) {
        throw new Error(json.message || "Repository not supported");
    }

    return json.projectSignals ? json.projectSignals : json;
};