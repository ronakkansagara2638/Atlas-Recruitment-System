# Atlas Recruitment System

A recruitment / HRMS platform with role-based dashboards (Admin, Recruiter,
HR, Candidate), job postings, an applicant pipeline, ATS scoring, interview
scheduling, and audit logs.

The project is split into two independent folders:

```
Atlas-Recruitment-System/
├── frontend/   React + Vite single-page app (the original app)
└── backend/    Express REST API + JWT auth + JSON-file datastore (new)
```

## Quick start

**Backend** (run first):
```bash
cd backend
npm install
cp .env.example .env
npm start          # http://localhost:5000
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
cp .env.example .env      # points VITE_API_URL at the backend above
npm run dev                # http://localhost:5173
```

See `backend/README.md` for the full API reference and seeded demo accounts.

## What changed from the original repo

The original repo was frontend-only: all "data" (users, jobs, candidates,
audit logs) lived in `localStorage` via `src/context/StoreContext.jsx`, seeded
from `src/constants/recruitmentData.js`.

This restructure:
1. Moved all existing app code into `frontend/`, unchanged.
2. Added `backend/`: an Express API that mirrors the same data model (users,
   jobs with nested candidates, audit logs) with real endpoints, JWT auth, and
   bcrypt password hashing, backed by a JSON file (`backend/src/data/db.json`,
   generated on first run) so data survives restarts.
3. Added `frontend/src/services/api.js`, a ready-to-use fetch client for
   every backend route.

**Note:** `StoreContext.jsx` still reads/writes `localStorage` — it has not
been rewired to call `api.js` yet, to avoid changing the app's behavior
without your review. Swapping the `dispatch` calls in `StoreContext.jsx` for
the matching `api.js` functions (e.g. `LOGIN` → `api.login`, `CREATE_JOB` →
`api.createJob`) is the natural next step if you want the frontend talking to
the real backend instead of demo `localStorage` data.
