# Architecture

## scanner.service.js

Responsibilities:
- Fetch repository files
- Decode base64
- Parse AST

Must NOT:
- Score roles
- Infer skills

---

## signal.service.js

Responsibilities:
- Traverse AST
- Detect engineering signals
- Produce evidence

Must NOT:
- Assign role scores

---

## scoring.engine.js

Responsibilities:
- Consume evidence
- Calculate role confidence

Must NOT:
- Parse source code

---

## Updated Architecture Notes (backend)

- `src/server.js` — process entry; starts HTTP server and loads `src/app.js`.
- `src/app.js` — Express application wiring: middleware, routes, and error handling.
- `routes/analyze.routes.js` — defines API routes under the `/analyze` namespace (currently POST `/your-roles`).
- `controllers/analyze.controller.js` — HTTP layer: validates input, calls the orchestrator, returns JSON, and forwards errors to `middlewares/errorHandler.js`.
- `orchestrators/analyze.orchestrators.js` — coordinates analysis requests, implements Redis caching, TTL, and request deduplication (in-flight promise map). Keeps caching concerns out of business logic.
- `services/analyze.service.js` — business workflow for a single analysis: calls `github.service` to fetch repo meta & manifests, creates the `projectSignals` envelope, delegates manifest & AST signal extraction, invokes `scanner.service` helpers that parse selected files, uses `signal.normalizer` to map detailed signals into role signals, calls `engines/scoring.engine.js` to produce `roles` scores, and assembles the final response.
- `services/github.service.js` — GitHub API client wrappers: fetch repo metadata, languages, file tree, and important manifest contents.
- `services/scanner.service.js` — responsible for selecting files to parse, decoding content, and producing parsed ASTs (exposed helper: `JSTSFiles`); should NOT run scoring logic.
- `services/signal.service.js` — traverses AST + manifests to extract fine-grained signals/evidence. Should NOT compute final role scores.
- `services/signal.normalizer.js` — converts low-level/detailed signals into normalized role-oriented signals suitable for scoring.
- `engines/scoring.engine.js` — consumes normalized role signals and computes role weights/confidences. Should NOT access GitHub or parse source files.
- `cache/redis.js` — optional Redis client used by the orchestrator for caching responses and reducing GitHub API usage.
- `middlewares/errorHandler.js` — centralized error formatting and HTTP status mapping.

Design principles (enforced):
- Single Responsibility: parsing, signal extraction, normalization, and scoring are separate modules.
- No cross-layer concerns: scanning/parsing modules do not score; scoring does not parse.
- Resilience: orchestrator handles caching failures gracefully and falls back to direct analysis.
