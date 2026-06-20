import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { parseRepoUrl } from "../utils/parser.js";

export async function allowRoleAnalysisAccess(req, res, next) {
  try {
    const repoUrl = req.body?.repo;

    if (!repoUrl) {
      return next();
    }

    let repoOwner;
    try {
      repoOwner = parseRepoUrl(repoUrl).owner.toLowerCase();
    } catch (error) {
      error.status = 400;
      error.clientMessage = "Invalid repository URL";
      throw error;
    }

    const token = getAuthToken(req);
    if (!token) {
      // Allow anonymous requests to proceed; rate-limiting middleware handles limits.
      return next();
    }

    const user = await getUserFromToken(token);
    if (user.role === "RECRUITER") {
      return next();
    }

    if (user.role !== "SEEKER") {
      return res.status(403).json({
        success: false,
        message: "Role analysis is only available to seekers and recruiters",
      });
    }

    if (user.provider !== "GITHUB") {
      return res.status(403).json({
        success: false,
        message: "Seekers must authenticate with GitHub to analyze repositories",
      });
    }

    if (!user.githubLogin || user.githubLogin.toLowerCase() !== repoOwner) {
      return res.status(403).json({
        success: false,
        message: "Seekers can only analyze repositories owned by their GitHub account",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

function allowAnonymousRequest(req, res, next) {
  return next();
}

async function getUserFromToken(token) {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.status = 401;
    error.clientMessage = "Invalid or expired authentication token";
    throw error;
  }

  const userId = payload.userId || payload.sub;
  if (!userId) {
    const error = new Error("Invalid authentication token");
    error.status = 401;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User no longer exists");
    error.status = 401;
    throw error;
  }

  return user;
}

function getAuthToken(req) {
  return req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
}
