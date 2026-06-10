# AI Research Mentor

Production-ready monorepo foundation for an AI-powered STEM Research Mentor application. This setup includes a Next.js 15 frontend, FastAPI backend, PostgreSQL database, environment-based configuration, Docker support, Alembic migration scaffolding, and a modern landing page. AI roadmap generation and other AI features are intentionally not implemented yet.

## Monorepo Structure

```text
research-mentor/
├── backend/
├── docs/
├── frontend/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Tech Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, React Flow, App Router
- Backend: FastAPI, Python 3.12, SQLAlchemy 2, Pydantic, Alembic
- Database: PostgreSQL 16
- DevOps: Docker Compose

## Local Development

### 1. Environment setup

The repository includes local development examples in:

- [research-mentor/.env.example](C:\Users\vipee\Desktop\study\roadmap\research-mentor\.env.example)
- [research-mentor/backend/.env.example](C:\Users\vipee\Desktop\study\roadmap\research-mentor\backend\.env.example)
- [research-mentor/frontend/.env.local.example](C:\Users\vipee\Desktop\study\roadmap\research-mentor\frontend\.env.local.example)

Create untracked local env files from those examples before deployment.

### 2. Run with Docker

From the repository root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Backend docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

### 3. Run locally without Docker

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Core Commands

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database

```bash
docker compose up postgres -d
```

## Available Endpoints

- `GET /` - API welcome message
- `GET /api/v1/health` - application and database health check

## Backend Architecture

- `app/api/v1/endpoints`: versioned REST endpoints
- `app/core`: app settings and cross-cutting configuration
- `app/db`: SQLAlchemy base, session, and future persistence wiring
- `app/models`: ORM models and reusable mixins
- `app/repositories`: data access layer for future domain modules
- `app/services`: business logic layer
- `app/tests`: backend test package
- `alembic/`: database migration scaffold

## Frontend Architecture

- `app/`: Next.js App Router entrypoints
- `features/home/`: page-specific UI, hooks, and types
- `components/ui/`: reusable presentational primitives
- `lib/api`: future API client layer
- `lib/config`: environment access helpers
- `lib/utils`: shared utility functions

## Notes

- The homepage is intentionally a clean landing experience with no AI calls yet.
- The backend is prepared for future API modules, repositories, services, models, migrations, and tests.
- PostgreSQL configuration is fully environment-driven for local and containerized workflows.
- Frontend and backend runtime images are structured for production-oriented deployment rather than dev-only containers.
