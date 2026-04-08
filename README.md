# RepoSense - Repository to Role Analyzer

RepoSense analyzes a GitHub repository and predicts suitable job and internship roles from real technical signals.

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

## Tech Stack

### Backend

- Node.js with Express 5
- Axios
- Redis
- dotenv

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
- Monorepos with multiple manifest directories are not supported in V1.
- Redis is required for cache-backed API calls.

## License

This project is licensed under the MIT License. See LICENSE for full text.
