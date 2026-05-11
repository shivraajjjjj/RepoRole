import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const GetResults = async ({ repoUrl }) => {
    const res = await axios.post(`${API_BASE}/analyze/your-roles`, {
        repo: repoUrl.trim(),
    });

    const json = res.data;
    const normalized = normalizeAnalysisResponse(json);

    if (normalized.metadata?.supported === false || normalized.supported === false) {
        throw new Error(normalized.message || "Repository not supported");
    }

    return normalized;
};

function normalizeAnalysisResponse(payload) {
    if (!payload || typeof payload !== "object") {
        return {};
    }

    const candidate =
        payload.projectSignals ||
        payload.data ||
        payload.result ||
        payload.analysis ||
        payload;

    if (candidate.metadata && typeof candidate.metadata === "object") {
        return candidate;
    }

    return {
        ...candidate,
        metadata: {
            ...(candidate.metadata || {}),
            supported:
                candidate.metadata?.supported ??
                candidate.supported ??
                payload.metadata?.supported ??
                payload.supported ??
                true,
        },
    };
}