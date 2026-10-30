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
| ORM          | Prisma                                    |
| Database     | PostgreSQL 16                             |
| Testing      | Vitest + RTL + Playwright (coming next)   |
| Infra        | Docker Compose                            |

## Project Structure

```
apps/
  web/          # Vite React frontend
  api/          # Express + Prisma backend
packages/
  shared/       # Shared types & utilities
```

## Getting Started

### Prerequisites
- Node.js 20+ (see `.nvmrc`)
- Docker (for PostgreSQL)

### Setup

```bash
# Clone
git clone https://github.com/Fikirsml/Cms-Dashboard.git
cd Cms-Dashboard

# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Start PostgreSQL
docker compose up -d

# Apply migrations & generate Prisma client
npm run db:migrate
# or: npm run db:push   (for rapid local prototyping)
```

### Development

```bash
# Run both apps (from root)
npm run dev:web   # http://localhost:5173
npm run dev:api   # http://localhost:4000
```

### Useful scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `npm run dev:web`    | Start frontend                 |
| `npm run dev:api`    | Start backend                  |
| `npm run db:migrate` | Run Prisma migrations          |
| `npm run db:studio`  | Open Prisma Studio             |
| `npm run build`      | Build all packages             |

## Data Model (CMS-002)

Core entities:

| Model            | Purpose                                      |
|------------------|----------------------------------------------|
| **User**         | Account identity                             |
| **Workspace**    | Top-level tenant (Linear org / Jira site)    |
| **WorkspaceMember** | User ↔ Workspace with role (OWNER/ADMIN/MEMBER) |
| **Project**      | Collection of issues; has short `key`        |
| **Issue**        | Work item (`key-number` e.g. FORGE-42)       |

Enums: `WorkspaceRole`, `ProjectStatus`, `IssueStatus`, `IssuePriority`.

## Ticket Status

- [x] **CMS-001** — Initialize monorepo and production-grade scaffold
- [x] **CMS-002** — Define core Prisma data model (User, Workspace, Project, Issue)

---

Built as a portfolio project by Fikir Samuel.
