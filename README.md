# BFF Seed

A NestJS starter for building a Backend-for-Frontend service: JWT authentication
(local or via an external IdP's JWKS endpoint), role/permission guards, rate
limiting, and the tooling (lint, tests, Docker, CI) to ship it.

## Features

- **JWT auth** — login/refresh/logout endpoints backed by `@nestjs/jwt`. Point
  `JWK_SET_URI` at an external identity provider (Keycloak, Auth0, Cognito, ...)
  to validate tokens issued elsewhere, or leave it unset to sign/verify locally.
- **Guards** — `JwtAuthGuard` (with token blacklisting), `RolesGuard`, and
  `PermissionsGuard`, driven by `@RequireRoles()` / `@RequirePermissions()`
  decorators.
- **Rate limiting** — a global `ThrottlerModule` guard plus a stricter
  per-route limiter on `POST /auth/login`.
- **Health checks** — `/health` plus Spring Boot Actuator-shaped endpoints
  (`/actuator/health`, `/liveness`, `/readiness`) for infra that expects them.
- **Tooling** — ESLint + Prettier, Jest, Husky pre-commit/pre-push hooks,
  a multi-stage Dockerfile, and a GitLab CI include.

## Getting started

```bash
npm install
cp .env.example .env   # then edit JWT_SECRET, etc.
npm run start:dev
```

Swagger docs are served at `/api` in any non-production environment.

## Project structure

```
src/
  auth/            # login/refresh/logout, JWT strategy, guards
  common/          # decorators, DTOs, enums, http client factory, utils
  config/          # environment-driven app config
  app.module.ts
  main.ts
```

Each business domain is expected to become its own top-level module (its own
controller, service(s), and an Axios client built via `HttpClientFactory`),
following the same shape as `auth/`.

## What this seed does NOT include

This is intentionally infrastructure-only. There is no user store or identity
provider wired in — `AuthService.login` issues tokens for whatever credentials
it's given (see the comment in `src/auth/auth.service.ts`). Plug in your own
credential verification (a database, an upstream identity service) before
using this in anything real.

## Testing

```bash
npm test          # unit tests
npm run test:cov  # with coverage
npm run typecheck
npm run lint
```

## Docker

```bash
docker build -t bff-seed .
docker run -p 3000:3000 --env-file .env bff-seed
```
