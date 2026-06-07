# RepoRole - Repository to Role Analyzer

RepoRole analyzes a GitHub repository and predicts suitable job and internship roles from real technical signals.

No resumes.
No forms.
Just code → roles.
## Live Links

- Live Demo: https://reposense.vercel.app/
- Backend API: https://reposense.onrender.com

## How It Works

1. User submits a GitHub repository URL.
2. Backend fetches repository metadata, languages, and folder contents.
3. Manifest files are scanned and signals are extracted.
4. Signals are scored against role weight configurations.
5. Top role matches are returned with score and confidence.

## Key Features

- Role detection for frontend, backend, fullstack, and ML profiles
- Signal-based scoring from languages, frameworks, databases, and structure
- Confidence scoring with toy project and weak-structure effects
- Monorepo detection for V1 safety checks
- Redis-based caching for GitHub API calls

Notes on caching: Redis is now optional — the backend will fall back to direct API calls or in-memory behavior when Redis is unavailable. Using Redis improves performance and reduces GitHub rate-limit usage but is not required for local development.

## Tech Stack

### Backend

- Node.js with Express 5
- Axios
- Redis
- dotenv

**Backend Architecture (concise overview)**

- Entry point: `src/server.js` — starts the HTTP server and loads `src/app.js`.
- App wiring: `src/app.js` — registers middleware, routes, and the global error handler.
- Route: `routes/analyze.routes.js` exposes POST `/analyze/your-roles` handled by `controllers/analyze.controller.js`.
- Controller: validates `req.body.repo`, delegates to the orchestrator, and returns the assembled JSON response.
- Orchestrator: `orchestrators/analyze.orchestrators.js` coordinates analysis, implements Redis caching and in-flight request deduplication, and keeps caching concerns out of the main business logic.
- Services: business logic lives in `services/`:
  - `github.service.js` — GitHub API wrappers (meta, languages, tree, manifests)
  - `scanner.service.js` — selects files, decodes content, and produces Babel ASTs (`JSTSFiles`)
  - `signal.service.js` — extracts fine-grained signals from ASTs and manifests
  - `signal.normalizer.js` — maps detailed signals into role-oriented signals
  - `analyze.service.js` — orchestrates signal extraction, normalization, and scoring to produce `projectSignals`
- Scoring: `engines/scoring.engine.js` consumes normalized role signals and computes role confidences; role configs live under `roles/`.
- Cache: `cache/redis.js` is optional; the orchestrator falls back to direct analysis when Redis is unavailable.

Design rule: parsing, signal extraction, normalization, and scoring are separated — parsing code must not score, and scoring must not re-parse sources.

### Frontend

- React 19
- Redux Toolkit
- Vite 7
- Tailwind CSS 4
- Axios

## Project Structure 

```text
JobEngine/
├── README.md
├── LICENSE
├── Backend/
│   ├── jobs.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── cache/
│       │   └── redis.js
│       ├── config/
│       │   ├── db.js
│       │   └── env.js
│       ├── controllers/
│       │   └── analyze.controller.js
│       ├── engines/
│       │   └── scoring.engine.js
│       ├── middlewares/
│       │   └── errorHandler.js
│       ├── orchestrators/
│       │   └── analyze.orchestrators.js
│       ├── roles/
│       │   ├── backendJavaDev.js
│       │   ├── backendJsDev.js
│       │   ├── frontendReactDev.js
│       │   ├── fullstackJavaDev.js
│       │   ├── fullstackJsDev.js
│       │   ├── index.js
│       │   └── mlEngineer.js
│       ├── routes/
│       │   └── analyze.routes.js
│       ├── services/
│       │   ├── analyze.service.js
│       │   ├── github.service.js
│       │   ├── scanner.service.js
│       │   ├── signal.service.js
│       │   └── toyDetector.js
│       └── utils/
│           ├── cacheHelper.js
│           └── parser.js
└── Frontend/
    ├── eslint.config.js
    ├── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── main.jsx
        ├── App/
        │   ├── App.css
        │   └── app.store.js
        ├── assets/
        └── Feature/
            ├── Components/
            ├── Hooks/
            ├── Pages/
            ├── Services/
            ├── Slices/
            └── utils/
```

## Setup and Run

### Backend

```bash
cd Backend
npm install
npm run dev
```

Alternative:

```bash
node src/server.js
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Configuration (Updated)

### Backend .env

```env
GITHUB_TOKEN=your_github_token
GITHUB_API_BASE_URL=https://api.github.com
REDIS_URL=redis://localhost:6379
PORT=3000
```

### Frontend .env

```env
VITE_API_BASE_URL=http://localhost:3000
```

## API Example

Endpoint: POST /analyze/your-roles

Request:

```json
{
  "repo": "https://github.com/facebook/react"
}
```

Success response:

```json
{
  "supported": true,
  "projectSignals": {
    "repo": {
      "owner": "facebook",
      "name": "react",
      "url": "https://github.com/facebook/react"
    },
    "languages": ["JavaScript"],
    "runtime": ["Node.js"],
    "frameworks": ["React"],
    "databases": [],
    "buildFiles": ["package.json"],
    "structure": ["src"],
    "flags": [],
    "roles": []
  }
}
```

Error response:

```json
{
  "error": "Repository not found",
  "message": "Repository not found",
  "supported": false
}
```

## Notes

- Public GitHub repositories are supported in V1.
- Monorepos: supported but handled with safety checks and warnings (monorepo analyses may return more conservative results).
- Redis: optional. The backend will continue to operate without Redis, but caching and API rate mitigation are reduced.

## License

This project is licensed under the MIT License. See LICENSE for full text.
