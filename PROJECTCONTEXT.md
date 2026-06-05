#Repo Role OR JobEngine

##Purpose

Repo Role analyzes github repositories and provides developer roles (Backend Engineer, Frontend Engineer, DevOps Engineer, etc.) using static code analytics.

the goal is not detect framework.
the goal is to provide engineering capabilities from implimentation evidence.

##current architecture

http://localhost:3000/analyze/your-roles(broken endpoint) -> analyze.routes.js -> analyze.controller.js -> scanner.service.js -> github.service.js

http://localhost:3000/analyze/cards -> analyze.routes.js -> scanner.service.js -> github.service.js
|-> signal.service.js 

## Current Progress

Implemented:
- Repository tree fetching
- JS/TS file detection
- Base64 content decoding
- Babel AST parsing
- Signal extraction framework

In Progress:
- Detector system redesign
- Signal normalization
- Evidence model

Not Started:
- Scoring engine v2
- Explainability engine
- Benchmark dataset

---

