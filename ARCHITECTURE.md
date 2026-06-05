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