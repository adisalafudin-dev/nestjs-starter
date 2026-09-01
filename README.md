# NestJS Starter

An opinionated, production-ready NestJS 12 starter template powered by **Bun**, **Prisma 8 (Prisma Next)**, **PostgreSQL 16**, **Vitest**, and **Docker**.

## Tech Stack

[![Bun](https://img.shields.io/badge/Bun-1.1+-fbf0df?style=for-the-badge&logo=bun&logoColor=fbf0df&labelColor=14151a)](https://bun.sh/)
[![NestJS](https://img.shields.io/badge/NestJS-12-ea2845?style=for-the-badge&logo=nestjs&logoColor=ea2845&labelColor=14151a)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=3178c6&labelColor=14151a)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-8_(Next)-2d3748?style=for-the-badge&logo=prisma&logoColor=white&labelColor=14151a)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?style=for-the-badge&logo=postgresql&logoColor=4169e1&labelColor=14151a)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?style=for-the-badge&logo=vitest&logoColor=6e9f18&labelColor=14151a)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=for-the-badge&logo=docker&logoColor=2496ed&labelColor=14151a)](https://www.docker.com/)
[![oxlint](https://img.shields.io/badge/oxlint-lint-a855f7?style=for-the-badge&logo=oxc&logoColor=a855f7&labelColor=14151a)](https://oxc-project.github.io/)
[![Prettier](https://img.shields.io/badge/Prettier-format-f7b93e?style=for-the-badge&logo=prettier&logoColor=f7b93e&labelColor=14151a)](https://prettier.io/)

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.1
- [Docker](https://www.docker.com/) & Docker Compose (for the database / production deploy)

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url> my-app
cd my-app
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` (defaults to the Docker Compose PostgreSQL instance):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db?schema=public"
```

### 3. Start the database

```bash
docker compose up -d
```

This spins up a **PostgreSQL 16** container on port `5432` with a persistent volume.

### 4. Initialize & migrate the database

```bash
bun run db:init        # Bootstrap the Prisma database
bun run db:migrate     # Apply pending migrations
```

### 5. Generate Prisma contract artifacts

```bash
bun run contract:emit
```

This generates the typed contract (`contract.json` + `contract.d.ts`) into `src/generated/prisma/`.

### 6. Run the app

```bash
bun run start:dev
```

The server starts at **http://localhost:3000**. Hit `GET /health` to verify.

---

## Commands Reference

### Development

| Command | Description |
| --- | --- |
| `bun run start` | Start the app (single run) |
| `bun run start:dev` | Start in watch mode (auto-restart on changes) |
| `bun run start:debug` | Start in debug + watch mode |
| `bun run start:prod` | Run the compiled production build (`node dist/main`) |
| `bun run build` | Compile the project via NestJS CLI |

### Database (Prisma 8)

| Command | Description |
| --- | --- |
| `bun run contract:emit` | Generate typed contract artifacts (`contract.json` + `contract.d.ts`) |
| `bun run db:init` | Initialize the Prisma database |
| `bun run db:sign` | Sign the current database state |
| `bun run db:migrate` | Apply pending migrations |
| `bun run migration:plan` | Preview the next migration plan without applying |

### Testing

| Command | Description |
| --- | --- |
| `bun run test` | Run unit tests once |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run test:cov` | Run unit tests with coverage report |
| `bun run test:debug` | Run tests with debugger attached |
| `bun run test:e2e` | Run end-to-end tests |

### Code Quality

| Command | Description |
| --- | --- |
| `bun run lint` | Lint `src/` and `test/` with oxlint |
| `bun run format` | Format code with Prettier |

---

## Docker

### Development — database only

Start just PostgreSQL for local development:

```bash
docker compose up -d          # Start PostgreSQL in the background
docker compose logs -f        # Tail database logs
docker compose down           # Stop and remove containers
docker compose down -v        # Stop and remove containers + delete volume data
```

### Production — full stack

Build and run the entire stack (app + database) using the production compose file:

```bash
# Build & start
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f app        # App logs only
docker compose -f docker-compose.prod.yml logs -f postgres   # DB logs only

# Stop
docker compose -f docker-compose.prod.yml down

# Stop + wipe database volume
docker compose -f docker-compose.prod.yml down -v

# Rebuild after code changes
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

**Production compose features:**

- Internal bridge network (database not exposed to host)
- Resource limits (CPU + memory) on both app and database
- Read-only filesystem for the app container
- Health checks on both services
- JSON log rotation (10 MB × 3 files)
- Automatic restart (`unless-stopped`)

### Build the Docker image standalone

```bash
docker build -t nest-project:latest .
docker run -p 3000:3000 --env-file .env nest-project:latest
```

---

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma          # Prisma 8 data contract (User, Post models)
│   └── db.ts                  # Typed Prisma client instance
├── src/
│   ├── config/
│   │   └── env.validation.ts  # Runtime env validation (class-validator)
│   ├── generated/prisma/      # Auto-generated contract artifacts (git-ignored)
│   ├── app.module.ts          # Root module (Observe + Prisma)
│   ├── app.controller.ts      # Health check endpoint (GET /health)
│   ├── prisma.module.ts       # Global Prisma module
│   ├── prisma.service.ts      # Injectable Prisma service wrapper
│   └── main.ts                # Bootstrap & global pipes
├── test/
│   └── app.e2e-spec.ts        # End-to-end test
├── prisma.config.ts           # Prisma 8 config (contract path, output, DB url)
├── docker-compose.yaml        # Dev: PostgreSQL only
├── docker-compose.prod.yml    # Prod: App + PostgreSQL (hardened)
├── Dockerfile                 # Multi-stage Bun build
├── vitest.config.ts           # Unit test config
├── vitest.config.e2e.ts       # E2E test config
├── oxlint.json                # Linter config
├── tsconfig.json              # TypeScript config
└── .env.example               # Environment variable template
```

---

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `NODE_ENV` | — | `development` | `development` · `production` · `test` |
| `PORT` | — | `3000` | HTTP server port |

Docker Compose also reads these to configure PostgreSQL:

| Variable | Default | Description |
| --- | --- | --- |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `app_db` | PostgreSQL database name |
| `DB_PORT` | `5432` | Host port mapping for PostgreSQL |
| `APP_PORT` | `3000` | Host port mapping for the app (prod compose) |

---

## Data Models

The starter ships with two example models defined in `prisma/schema.prisma`:

**User** — `id`, `email` (unique), `name`, `posts[]`, `createdAt`, `updatedAt`

**Post** — `id`, `title`, `content`, `published`, `author` → User, `createdAt`, `updatedAt`

Modify or replace these to fit your domain, then run:

```bash
bun run contract:emit      # Regenerate the typed contract
bun run migration:plan     # Preview the migration
bun run db:migrate         # Apply it
```

---

## Observability

This starter includes `@nestjs/observe` pre-configured in `app.module.ts`. To activate it:

1. Sign up at [observe.nestjs.com](https://observe.nestjs.com)
2. Replace `YOUR_APP_KEY` and `YOUR_APP_SECRET` in `app.module.ts`

You get distributed tracing, auto-correlated logs, request metrics, and error telemetry out of the box.

---

## License

[UNLICENSED](./LICENSE)
