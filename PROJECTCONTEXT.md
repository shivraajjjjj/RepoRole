#Repo Role OR JobEngine

##Purpose

Repo Role analyzes github repositories and provides developer roles (Backend Engineer, Frontend Engineer, DevOps Engineer, etc.) using static code analytics.

the goal is not detect framework.
the goal is to provide engineering capabilities from implimentation evidence.

## Current architecture

API entrypoint:
- POST /analyze/your-roles  (JSON body: { "repo": "owner/name" | "https://github.com/owner/name" })

Request flow (high-level):
- routes/analyze.routes.js -> controllers/analyze.controller.findRoles -> orchestrators/analyze.orchestrators.analyzeRepo
	-> services/analyze.service.analyzeRepository -> services/github.service (repo meta & manifests)
	-> services/scanner.service (parse selected files / produce ASTs) -> services/signal.service.extractSignals
	-> services/signal.normalizer.generalizeRoleSignals -> engines/scoring.engine.scoreRepository
	-> (orchestrator) cache in cache/redis.js (optional) -> controller returns JSON

Notes:
- Redis caching and request deduplication live in orchestrators/analyze.orchestrators.js. Redis is optional — the code falls back to direct API calls when Redis is unavailable.
- The controller expects `req.body.repo` and returns a projectSignals payload plus role scoring metadata. Errors are handled by middlewares/errorHandler.js.

## Current Progress

Implemented:
- Repository metadata + tree fetching (`services/github.service.js`)
- Important manifest detection and manifest content fetching
- Base64 decoding and Babel AST parsing for selected files (`services/scanner.service.js`)
- Signal extraction from ASTs and manifests (`services/signal.service.js`)
- Signal normalization and role-mapping utilities (`services/signal.normalizer.js`)
- Role scoring engine (v1) and role configuration files (`engines/scoring.engine.js`, `roles/`)
- Redis-backed caching and request deduplication (`orchestrators/analyze.orchestrators.js`, `cache/redis.js`)

In Progress:
- Detector refinements and additional heuristics in `signal.service.js`
- Improvements to signal normalization and evidence modeling

Planned / Not Started:
- Scoring engine v2 (improved explainability and weighting controls)
- Explainability/reporting engine
- Benchmark dataset and evaluation harness

---

---

