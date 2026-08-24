# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev        # Dev server with watch
npm run build            # Compile TypeScript via nest build
npm run test             # Run all unit tests (Jest)
npm run test:cov         # Tests with coverage report
npm run lint             # ESLint with auto-fix
npm run typecheck        # tsc --noEmit (no emit, just type errors)
npm run format            # Prettier
```

Run a single test file:
```bash
npx jest src/auth/auth.service.spec.ts --no-coverage
```

## Architecture

NestJS BFF starter. Each domain is expected to become its own NestJS module
with its own controller, service(s), and Axios HTTP client (via
`HttpClientFactory`). Protected routes use `@UseGuards(JwtAuthGuard)`.

### Auth flow

1. `JwtStrategy` (Passport) validates incoming Bearer tokens. If `JWK_SET_URI`
   is set, it verifies RS256 signatures against that JWKS endpoint (works with
   Keycloak, Auth0, Cognito, or any OIDC-compliant IdP). Otherwise it falls
   back to a shared `JWT_SECRET` (HS256) — the mode `TokenService` uses to
   sign/verify tokens it issues itself.
2. `RolesGuard` / `PermissionsGuard` enforce `@RequireRoles()` /
   `@RequirePermissions()` decorators — checked after JWT validation.
3. `TokenBlacklistService` tracks logged-out/revoked tokens in-memory (swap for
   Redis or similar if you need it to survive restarts or run across instances).

### No credential store

`AuthService.login` does not verify credentials against anything — there is no
user store or upstream identity call wired in. It exists to demonstrate the
token-issuance shape (`AuthController` → `AuthService` → `TokenService`).
Replace the body of `login()` with your own verification before relying on it.

### Adapter pattern (convention, not enforced)

For modules that call upstream services with a different shape than what you
want to expose to the client, put the translation in
`src/<module>/adapters/<name>.adapter.ts`. Keeps controllers/services free of
upstream-shape leakage.

## Key environment variables

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Secret used to sign/verify locally-issued tokens (HS256) |
| `JWT_EXPIRATION` | Access token TTL in seconds |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token TTL in seconds |
| `JWK_SET_URI` | JWKS endpoint, if validating tokens from an external IdP |
| `ISSUER_URL` | Expected JWT issuer (only enforced when `NODE_ENV=production`) |
| `NODE_ENV` | Controls issuer validation, HTTPS redirect, and Swagger exposure |
| `PORT` | HTTP port (default `3000`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list |

## Non-obvious patterns

- **Issuer validation is env-gated**: `JwtStrategy` only passes `issuer` to
  passport-jwt when `NODE_ENV === "production"`. In dev/QA, a token from any
  issuer is accepted — this avoids 401s when testing against a local IdP.
- **HTTPS agent conditionally created**: `JwtStrategy` only builds an
  `https.Agent` when `JWK_SET_URI` starts with `https://`. Passing an HTTPS
  agent to an `http://` endpoint throws a protocol error.
- **Swagger is disabled in production**: `main.ts` only mounts
  `SwaggerModule` when `NODE_ENV !== "production"`.
