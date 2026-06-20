import express from "express";
const algoRouter = express.Router();
import { findRoles } from "../controllers/analyze.controller.js";
import { allowRoleAnalysisAccess } from "../middlewares/roles-access.middleware.js";
import rateLimitForRoles from "../middlewares/rateLimit.middleware.js";

algoRouter.post('/roles', rateLimitForRoles, allowRoleAnalysisAccess, findRoles);
algoRouter.post('/your-roles', rateLimitForRoles, allowRoleAnalysisAccess, findRoles);

export default algoRouter;
