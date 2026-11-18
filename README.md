# AI Resume Analyzer

A full-stack application for comparing a resume to a job description. It identifies overlapping and missing keywords, calculates a simple 0–100 match score, and offers practical resume-writing suggestions. The analyzer is rule-based; its score is guidance, not an ATS prediction or hiring decision.

## Stack and layout

- **Frontend:** React, Vite, React Router, TanStack Query, React Hook Form, Zod
- **Backend:** Node.js 20+, Express, Mongoose, Zod
- **Persistence:** MongoDB; reports are private to the signed-in account
- **PDF:** PDF.js via `pdf-parse`; PDF report export via jsPDF

```text
backend/src/     Express API, models, validators, services, and middleware
backend/tests/   Vitest unit tests
frontend/src/    React pages, components, API helpers, and styles
```

## Local setup

1. Install Node.js 20+ and start a local MongoDB instance (or run `docker compose up -d mongo`).
2. Copy `backend/.env.example` to `backend/.env`. For PowerShell: `Copy-Item backend\.env.example backend\.env`. Set a unique `JWT_SECRET` (at least 32 characters) and adjust `MONGODB_URI` or `CLIENT_URL` if needed.
3. From the repository root, run `npm install` once.
4. Start both apps with `npm run dev`. The API uses port 5000 and Vite uses port 5173.
5. Open <http://localhost:5173>, create an account, then paste resume text or upload a PDF.

The backend exits with a clear configuration error if `backend/.env` is missing or invalid. `.env` files are ignored by Git and must not be committed.

MongoDB is required; the API exits on startup if it cannot connect.

## Root scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start frontend and backend in development |
| `npm start` | Start the backend in production |
| `npm run lint` | Lint backend JavaScript |
| `npm test` | Run backend tests |
| `npm run build` | Build the React client |

## API

Authentication is cookie-based. Access and refresh cookies are HttpOnly; no bearer tokens are stored in browser storage.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Refresh session |
| POST | `/api/auth/logout` | Sign out and revoke sessions |
| GET | `/api/auth/me` | Current account |
| POST | `/api/analyze` | Analyze PDF (`resume`, `jobTitle`, `jobDescription`; max 5 MB) |
| POST | `/api/analyze/text` | Analyze pasted text (`resumeText`, `jobTitle`, `jobDescription`) |
| GET | `/api/history?page=1&limit=20` | Paginated account report history |
| GET | `/api/history/:id` | Read an owned report |
| DELETE | `/api/history/:id` | Delete an owned report |

Inputs are validated on the server. Resume content and job descriptions are used to create the report and are not returned to the client as part of history; reports contain the score, keywords, and recommendations.

## Notes

- PDF upload accepts PDF files up to 5 MB. Scanned/image-only PDFs may not contain extractable text; paste resume text in that case.
- The score compares extracted terms, not context, seniority, or formatting. Only add keywords that truthfully reflect your experience.
- Configure HTTPS and the production `CLIENT_URL` when deploying. Keep secrets only in server environment variables.
