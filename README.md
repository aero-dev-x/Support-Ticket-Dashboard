# Support Ticket Dashboard

A full-stack support ticket dashboard - sign up or log in, then view, create, and update customer support tickets, with filtering, search, and a drag-and-drop Kanban board.

## Features

Core flows (all implemented):

- **Ticket list** - table (card view on mobile) showing title, customer name, status, priority, and created date, with pagination.
- **Create a ticket** - form with title, description, customer name, customer email, and priority. New tickets always start as **Open**. Required fields and email format are validated on the client *and* the server.
- **Update ticket status** - change status from the list, the ticket detail drawer/page, or the Kanban board. Updates are persisted and confirmed with a toast.
- **Ticket details** - full description, customer info, priority, status, and created date, opened as a right-hand drawer from the list/board or as its own page.
- **Filtering** - by status and priority, plus a title/customer search box.
- Clear **loading, empty, success, and error** states throughout.

Optional extras included:

- **Authentication** - email/password signup and login with JWT-based sessions.
- **Kanban board** with **drag-and-drop** status updates (`dnd-kit`). Changes persist across a refresh.
- **Search** by title or customer name, plus pagination.
- **Docker / Docker Compose** setup for the whole stack - one command boots Postgres, the backend, and the frontend, with migrations and seed data applied automatically.
- Auto-generated **OpenAPI/Swagger docs** at `/docs`.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript + Vite, Material UI, TanStack Query, React Hook Form + Zod, React Router, `dnd-kit` |
| Backend | Python + FastAPI, SQLAlchemy 2.0 (async, `asyncpg`), Alembic, Pydantic v2 |
| Auth | JWT (`PyJWT`, HS256), `bcrypt` password hashing |
| Database | PostgreSQL 16 |
| Testing | pytest + httpx (backend), Vitest + React Testing Library (frontend) |
| Package management | Poetry (backend), npm (frontend) |
| Container | Docker + Docker Compose |

## Project Structure

```
.
├── docker-compose.yml          # Runs db + backend + frontend together
├── LICENSE
│
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml          # Poetry deps (+ dev group for tests)
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/           # 0001 create users + tickets tables
│   ├── app/
│   │   ├── main.py             # FastAPI app, CORS, router registration, exception handlers
│   │   ├── config.py           # pydantic-settings
│   │   ├── db.py               # Async SQLAlchemy engine + session
│   │   ├── models.py           # SQLAlchemy ORM models (User, Ticket)
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   ├── crud.py             # Data-access functions
│   │   ├── security.py         # Password hashing, JWT encode/decode, get_current_user
│   │   ├── exceptions.py       # Custom exceptions + handlers
│   │   └── api/                # auth.py and tickets.py routers
│   ├── seed.py                 # Idempotent seed script
│   └── tests/                  # pytest suite
│
└── frontend/
    ├── Dockerfile
    ├── vite.config.ts
    └── src/
        ├── main.tsx / App.tsx   # Providers (theme, query client, auth) + routes
        ├── theme.ts             # MUI dark theme
        ├── api/                 # Typed fetch client + per-resource API calls
        ├── contexts/            # AuthContext
        ├── hooks/                # TanStack Query hooks per resource
        ├── components/
        │   ├── layout/           # AppShell, FeedbackSnackbar
        │   ├── kanban/           # KanbanBoard, KanbanColumn, TicketCard
        │   └── ...               # TicketTable, TicketForm, TicketDetailDrawer, FilterBar, SearchBar
        ├── pages/                 # TicketListPage, TicketDetailPage, KanbanBoardPage, Login/SignupPage
        ├── types/                 # Shared TypeScript types
        └── utils/                 # formatTicketId, avatar colors, priority colors
```

I kept **routing, business logic, and data access separated** (`api/` → `crud.py` → SQLAlchemy models), with validation living in dedicated Pydantic schemas.

## Quick Start (Docker Compose - recommended)

Requires Docker Desktop running.

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API + interactive docs (Swagger UI): http://localhost:8000/docs

Migrations and seed data run automatically when the backend container starts - no manual setup needed.

### Demo login

A demo account is seeded automatically so you can log in immediately without signing up:

```
Email:    testerson@test.com
Password: Test12345
```

You can also use the Sign Up page to create your own account.

## Running Without Docker (manual setup)

### Backend

Requires [Poetry](https://python-poetry.org/) and Python 3.12.

```bash
cd backend
poetry env use python3.12
poetry install --with dev
cp .env.example .env   # edit DATABASE_URL to point at your local Postgres
poetry run alembic upgrade head
poetry run python seed.py
poetry run uvicorn app.main:app --reload
```

Left `DATABASE_URL` set to a placeholder - swap in whatever Postgres user and database you set up yourself for local development, since it isn't derived from anything else. For `SECRET_KEY`, I committed a randomly generated value that's fine for running this locally, but I wouldn't reuse it for anything real: if you ever deploy this or share the instance with others, generate your own (`python -c "import secrets; print(secrets.token_hex(32))"`) instead of keeping the one committed here.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:8000
npm run dev
```

## Database & Seed Data

Two tables: `users` and `tickets` - see [Data Model](#data-model) for the full field list.

Migrations are managed with Alembic (`backend/alembic/versions/0001_create_users_and_tickets.py`) and run automatically on container start (`alembic upgrade head`).

`backend/seed.py` is idempotent - it inserts ~9 sample tickets (spanning all statuses/priorities) and the demo user only if they don't already exist, so re-running it or restarting the stack never duplicates data. Run it manually with:

```bash
poetry run python seed.py   # from backend/, with DATABASE_URL set
# or, against the compose stack:
docker compose exec backend python seed.py
```

**Persistence:** Postgres data lives in the `pgdata` volume, so ticket changes survive container restarts. Reloading the app never resets a status update.

## Data Model

`tickets`

| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key, auto-increment |
| `title` | String | Required |
| `description` | Text | Required |
| `customer_name` | String | Required |
| `customer_email` | String | Required, validated as an email |
| `status` | String (`CHECK`) | `open` \| `in_progress` \| `resolved`, defaults to `open` |
| `priority` | String (`CHECK`) | `low` \| `medium` \| `high` |
| `created_at` | Timestamp | Defaults to now |
| `updated_at` | Timestamp | Auto-updated on change |

`users`

| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key, auto-increment |
| `email` | String | Required, unique |
| `hashed_password` | String | bcrypt hash, never the plaintext |
| `created_at` | Timestamp | Defaults to now |

`status` and `priority` are stored as lowercase/`snake_case` strings with a `CHECK` constraint rather than native Postgres enums - see [Assumptions & Trade-offs](#assumptions--trade-offs). Indexes exist on `status`, `priority`, and `created_at` to keep filtering and sorting efficient.

## Running Tests

```bash
# Backend (9 tests: validation, creation/persistence, status updates, 404s, signup/login/auth-gating)
cd backend && poetry run pytest

# Frontend (4 tests: ticket list rendering, ticket form validation, signup form validation)
cd frontend && npm test
```

## API Reference

Base URL: `http://localhost:8000`. All `/api/tickets` routes require a valid `Authorization: Bearer <token>` header, obtained from signup/login.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account, returns an access token |
| POST | `/api/auth/login` | Log in, returns an access token |
| GET | `/api/auth/me` | Current user info (requires auth) |
| GET | `/api/tickets` | List tickets (supports filters) |
| GET | `/api/tickets/{id}` | Get a single ticket |
| POST | `/api/tickets` | Create a ticket |
| PATCH | `/api/tickets/{id}` | Update a ticket's status |

**Query params for `GET /api/tickets`:** `status` (`open` \| `in_progress` \| `resolved`), `priority` (`low` \| `medium` \| `high`), `search` (title/customer), `page`, `page_size`, `sort` (`created_at` \| `-created_at` \| `priority` \| `-priority`, default `-created_at`).

**Example ticket object:**

```json
{
  "id": 1,
  "title": "Unable to complete payment",
  "description": "The customer receives an error after submitting the payment form.",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "status": "open",
  "priority": "high",
  "createdAt": "2026-06-18T10:30:00Z"
}
```

**Sign up and grab a token:**

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "password123"}'
```

**Create a ticket:**

```bash
curl -X POST http://localhost:8000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Cannot log in",
    "description": "Login button does nothing",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "priority": "high"
  }'
```

**Update status:**

```bash
curl -X PATCH http://localhost:8000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status": "resolved"}'
```

**Status codes:** `200` OK, `201` Created, `401` missing/invalid token, `404` ticket not found, `409` email already registered, `422` validation error. Validation errors return FastAPI's standard structured body:

```json
{
  "detail": [{ "type": "missing", "loc": ["body", "title"], "msg": "Field required" }]
}
```

Full interactive documentation (request/response schemas, try-it-out) is auto-generated by FastAPI at **http://localhost:8000/docs**

## Assumptions & Trade-offs

- **Used integer IDs, not UUIDs** - it matches the brief's example JSON (`"id": 1`), and there's no multi-tenant/distributed-write requirement here that would justify UUIDs.
- **Stored `status`/`priority` as `VARCHAR` + `CHECK` constraints, not native Postgres `ENUM` types** - native enums need `ALTER TYPE` ceremony to evolve and are a known friction point with async SQLAlchemy/`asyncpg`. A `VARCHAR` + `CHECK` is trivially migrated and maps cleanly to a Python `str` enum, which is where I actually enforce correctness.
- **Limited `PATCH /api/tickets/{id}` to status updates only**, not a general partial-update of every field - this matches the brief's explicit "Update Ticket Status" requirement and keeps validation simple. I'd add a full partial-update endpoint later if it were needed.
- **Run backend tests against SQLite (`aiosqlite`), not a real Postgres instance** - the schema deliberately avoids Postgres-only features (no native enums, no JSONB), so SQLite gives me fast, dependency-free, fully isolated tests with high enough parity for this scope. Testcontainers against real Postgres would be my next step for stronger parity.
- **Built authentication as a single-role gate, not full RBAC or multi-tenancy** - any signed-up user can see and manage all tickets; there's no per-user ticket ownership. This matches "basic authentication" as requested without over-building for a scope the brief doesn't call for.
- **Store the JWT in `localStorage`, not an `httpOnly` cookie** - simpler to implement and sufficient for this assessment. An `httpOnly` cookie would be more resistant to XSS token theft but adds CSRF-handling complexity, so I've noted it as a would-improve item below.
- **Left out rate limiting, structured logging, and a CI pipeline** - deliberately, per the brief's own guidance to prioritize working, understandable flows over advanced architecture.
- **Run the frontend via the Vite dev server inside Docker**, not a production Nginx build - that's appropriate for a local/reviewer context. A production image would mean adding a build stage plus a static file server.
- **Used `dnd-kit` for the Kanban drag-and-drop, not `react-beautiful-dnd`/its forks** - I tried the latter first and found it doesn't reliably initiate drags under React 18/19 `StrictMode`, since it's built on an older architecture. `dnd-kit` is the actively-maintained, StrictMode-safe choice, so I switched.

## What I'd Improve With More Time

If I had more time on this, here's what I'd tackle next, roughly in priority order:

- Refresh tokens and `httpOnly` cookie-based token storage instead of `localStorage`
- Password reset flow
- Per-user ticket ownership / basic role-based access
- Testcontainers-based integration tests against real Postgres
- Optimistic UI updates on Kanban drag (currently waits for the server round-trip)
- Trigram/GIN index on `title`/`customer_name` if search needed to scale past a small dataset
- Accessibility audit, especially keyboard support for the drag-and-drop interaction
- End-to-end tests (Playwright) covering the full user journey
- Production frontend build (static assets + Nginx/reverse proxy) instead of the dev server in Docker

## Environment Variables

**`backend/.env`** (see `backend/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | Postgres connection string (async, `postgresql+asyncpg://...`) - the only database setting the app itself reads | - required |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `SECRET_KEY` | JWT signing secret | - required |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT lifetime | `60` |

**`frontend/.env`** (see `frontend/.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
