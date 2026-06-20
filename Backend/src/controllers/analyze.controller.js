// import { analyzeRepo } from "../orchestrators/analyze.orchestrators.js";
import { analyzeRepo } from "../orchestrators/analyze.orchestrators.js";
import {analyzeRepository} from "../services/analyze.service.js";
import redis from "../cache/redis.js";
export const findRoles = async (req, res, next) => {
  try {
    const repo = req.body.repo;
    if (!repo) {
      const err = new Error("repo is required");
      err.status = 400;
      throw err;
    }

    if(redis.isReady()) {
      const result = await analyzeRepo(repo);
      res.json(result);
    } else {
      // Handle the case when Redis is ready (if needed)
      console.warn("Redis is not ready, proceeding without cache");
      const result = await analyzeRepository(repo);
      res.json(result);
    }
  } catch (err) {
    // Attach friendly client messages/status for known cases
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      err.status = 503;
      err.clientMessage = `Cannot reach GitHub API. Check your internet connection. (${err.code})`;
    } else if (err.status === 404 || err.response?.status === 404) {
      err.status = 404;
      err.clientMessage = "Repository not found";
    } else if (err.status === 403 || err.response?.status === 403) {
      err.status = 403;
      err.clientMessage = "API rate limit exceeded or access denied";
    }

    next(err);
  }
};