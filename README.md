# 🍔 Madkunyah Project

Madkunyah is a modern, high-performance food ordering and payment system.

Built as a monorepo utilizing **Clean Architecture**, this project strictly separates enterprise domain logic, data access, and infrastructure to ensure the codebase remains maintainable, testable, and highly scalable.

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:

* **Node.js** (v18+ recommended)
* **pnpm** (v8+)
* **Docker** & Docker Compose

### 2. Environment Setup

Create a `.env` file in root and populate them with your credentials:

```env
DATABASE_URL=your_neon_postgres_url
MIDTRANS_SERVER_KEY=your_midtrans_key
MIDTRANS_CLIENT_KEY=your_mkidtrans_client_key
CORS_ORIGIN=sting_of_url_separated_by_coma
PORT=5000
COMMON_RATE_LIMIT_MAX_REQUESTS=100
COMMON_RATE_LIMIT_WINDOW_MS=15
```

### 3. Installation & Run

```bash
# Install dependencies across the monorepo
pnpm install

# Generate and apply database migrations
pnpm --filter @madkunyah/core db:generate
pnpm --filter @madkunyah/core db:migrate

# Start all packages in development mode
pnpm dev
```

## 🛠️ Tech Stack & Architecture

### Core Technologies

* **Languages & Runtime:** TypeScript, Node.js
* **API Framework:** Express.js
* **Database & ORM:** PostgreSQL (Neon), Drizzle ORM
* **Payment Gateway:** Midtrans (With secure webhook verification)
* **Monorepo Tooling:** Turborepo, pnpm
* **Code Quality:** Biome (Linting/Formatting), Vitest (Testing)
* **Infrastructure:** Docker, Docker Compose

### Clean Architecture Layers

We strictly enforce the **Dependency Rule**: Source code dependencies only point inwards. The `Domain` layer knows nothing about `Data` or `Platform`.

* **Domain:** Enterprise business rules (models and repository interfaces).
* **Use Cases:** Application-specific business rules (interactors).
* **Data:** Data access implementations (repositories and datasources).
* **Platform:** Infrastructure-specific implementations (Drizzle client, Midtrans client).

## 📂 Workspace Structure

```plaintext
├── core/                  # Shared business logic & database layer
│   └── src/
│       ├── domain/        # Interfaces and core models
│       ├── usecases/      # Core business interactors
│       ├── data/          # Repository implementations
│       └── platform/      # Drizzle & Midtrans clients
├── server/                # Express.js API server
│   └── src/
│       ├── api/           # REST API controllers and routers
│       ├── webhook/       # Midtrans notification handlers
│       └── common/        # DI Container & global error handler
```

## ⌨️ Key Commands

### Workspace-Wide Commands (Turborepo)

* `pnpm dev` - Start all packages in development mode (persistent, non-cached).
* `pnpm build` - Build all packages in the correct dependency order.
* `pnpm test` - Run Vitest tests across the workspace.
* `pnpm lint` - Lint all packages using Biome.
* `pnpm check` - Automatically fix linting and formatting issues via Biome.

### Database Management (Drizzle)

* `pnpm --filter @madkunyah/core db:generate` - Generate new migrations.
* `pnpm --filter @madkunyah/core db:migrate` - Apply migrations to Neon.
* `pnpm --filter @madkunyah/server db:studio` - Open local Drizzle Studio GUI.

### Docker Environment

* `docker compose up --build` - Spin up the local development containers.
* `docker build -t madkunyah-server .` - Build the production multi-stage Docker image.

## 💡 Development Conventions

### Dependency Injection (DI)

The project utilizes a clean, manual dependency injection pattern to avoid framework lock-in:

1. Datasources, repositories, and interactors are instantiated and exported from `core/src/index.ts`.
2. Controllers are then injected with these interactors inside `server/src/common/container.ts`.

### Error Handling & Responses

* **API Responses:** Always use the standard formats defined in `shared/types/responses.ts`.
* **Global Error Catching:** Managed centrally via `server/src/common/errorHandler.ts` to prevent internal stack traces from leaking to clients.
