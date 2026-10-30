# Forge — Cms-Dashboard

Enterprise Project Management Platform (Jira / Linear inspired)  
Senior Frontend Engineer portfolio project

## Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Monorepo     | npm workspaces                            |
| Frontend     | Vite + React 19 + TypeScript (strict)     |
| Styling      | Tailwind CSS v4                           |
| State        | Zustand                                   |
| Data         | TanStack Query                            |
| Routing      | React Router v7                           |
| Forms        | React Hook Form + Zod                     |
| Backend      | Express + TypeScript                      |
| Auth         | JWT + bcrypt                              |
| ORM          | Prisma                                    |
| Database     | PostgreSQL 16                             |
| Testing      | Vitest + RTL + Playwright (coming next)   |
| Infra        | Docker Compose                            |

## Getting Started

```bash
git clone https://github.com/Fikirsml/Cms-Dashboard.git
cd Cms-Dashboard
npm install

cp .env.example .env
cp .env apps/api/.env

docker compose up -d
npm run db:migrate
npm run db:seed
```

### Development

```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:5173
```

### Seed accounts

| Email            | Password     | Role  |
|------------------|--------------|-------|
| alice@forge.dev  | password123  | OWNER |
| bob@forge.dev    | password123  | MEMBER |

## API Overview

Base: `http://localhost:4000` · Auth header: `Authorization: Bearer <token>`

### Auth
- `POST /auth/register` — create user + personal workspace
- `POST /auth/login`
- `GET /auth/me`

### Workspaces
- `GET/POST /workspaces`
- `GET/PATCH /workspaces/:id`

### Projects
- `GET/POST /workspaces/:workspaceId/projects`
- `GET/PATCH/DELETE /projects/:id`

### Issues
- `GET/POST /projects/:projectId/issues`
- `GET/PATCH/DELETE /issues/:id`

## Ticket Status

- [x] **CMS-001** — Monorepo scaffold
- [x] **CMS-002** — Core Prisma data model
- [x] **CMS-003** — Full backend API (auth, CRUD, seed)

---

Built as a portfolio project by Fikir Samuel.
