# Atlas Recruitment System — Backend

A REST API for the Atlas Recruitment System, built with Express. It replaces the
frontend's `localStorage`-based demo data with a real server: JWT auth,
password hashing, and a JSON-file datastore (via `lowdb`) that persists to
disk. Swap `lowdb` for Postgres/Mongo later without changing the route logic.

## Stack

- Express (routing/middleware)
- lowdb (JSON file datastore — zero setup, good for demos; see "Moving to a real database" below)
- jsonwebtoken + bcryptjs (auth)
- cors, morgan, dotenv

## Getting started

```bash
cd backend
npm install
cp .env.example .env    # edit JWT_SECRET / CORS_ORIGIN if needed
npm run dev              # nodemon-style auto-restart (Node's --watch)
# or: npm start
```

The server listens on `http://localhost:5000` by default. On first boot it
creates `src/data/db.json` seeded with demo users, jobs, and audit logs (same
data the frontend used to keep in `localStorage`).

### Demo accounts (seeded)

| Role      | Email                 | Password       |
|-----------|------------------------|----------------|
| Admin     | admin@atlas.hrms       | Admin@12345    |
| Recruiter | recruiter@atlas.hrms   | recruiter123   |
| HR        | hr@atlas.hrms          | hr123          |
| Candidate | candidate@atlas.hrms   | candidate123   |

## API reference

All request/response bodies are JSON. Authenticated routes expect
`Authorization: Bearer <token>`.

### Auth
| Method | Route                | Auth | Description |
|--------|-----------------------|------|--------------|
| POST   | `/api/auth/register`  | –    | Create an account (`name`, `email`, `password`, optional `role`; `admin` blocked) |
| POST   | `/api/auth/login`     | –    | `email` + `password` → `{ token, user }` |
| GET    | `/api/auth/me`        | any  | Current user from token |

### Users (admin only)
| Method | Route                  | Description |
|--------|--------------------------|--------------|
| GET    | `/api/users`             | List all users |
| PATCH  | `/api/users/:id/role`    | Body `{ newRole }` |
| DELETE | `/api/users/:id`         | Remove a user |

### Jobs
| Method | Route                              | Auth                  | Description |
|--------|--------------------------------------|------------------------|--------------|
| GET    | `/api/jobs`                          | –                      | List all jobs |
| GET    | `/api/jobs/:id`                      | –                      | Get one job |
| POST   | `/api/jobs`                          | recruiter/admin        | Create a job |
| PATCH  | `/api/jobs/:id/status`               | recruiter/admin        | Body `{ status }` |
| POST   | `/api/jobs/:id/apply`                | any (candidate)        | Apply with `{ skills, expYears, education, summary }`; returns ATS score |
| DELETE | `/api/jobs/:id/candidates/by-email/:email` | any               | Withdraw an application |
| POST   | `/api/jobs/:id/candidates`           | recruiter/hr/admin      | Manually add a candidate |
| PATCH  | `/api/jobs/:id/candidates/:cid/stage`| recruiter/hr/admin      | Body `{ stage }` — move through pipeline |
| POST   | `/api/jobs/:id/candidates/:cid/interview` | hr/admin           | Schedule an interview |
| POST   | `/api/jobs/:id/candidates/:cid/feedback`  | hr/admin           | Record interview feedback / verdict |
| POST   | `/api/jobs/:id/candidates/:cid/assessment`| recruiter/hr/admin | Save an AI skill-assessment score |
| POST   | `/api/jobs/:id/ats-preview`          | any                     | Score a hypothetical candidate against a job without saving |

### Audit logs
| Method | Route              | Auth                  | Description |
|--------|----------------------|-------------------------|--------------|
| GET    | `/api/audit-logs`    | admin/hr/recruiter      | List audit trail |

## Moving to a real database

The datastore is isolated in `src/db.js`. To swap in Postgres/MySQL (e.g.
Prisma or Drizzle) or MongoDB, reimplement `getDb()`/`nextId()` and the route
files won't need structural changes — they only call `db.data.*` and
`db.write()`.

## Environment variables

See `.env.example`:

- `PORT` — server port (default 5000)
- `JWT_SECRET` — change this for any non-local deployment
- `CORS_ORIGIN` — the frontend's origin (Vite dev server default: `http://localhost:5173`)
