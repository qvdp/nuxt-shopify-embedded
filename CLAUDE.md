# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `nuxt-shopify-embedded`, a Nuxt 4 module for building Shopify embedded apps. It provides pre-configured Shopify API/GraphQL clients, Polaris web components, and App Bridge integration via CDN injection.

## Commands

```bash
# Development
pnpm dev                # Run playground app (nuxi dev playground)
pnpm dev:shopify        # Run with Shopify CLI (cd playground && shopify app dev)
pnpm dev:prepare        # Stub module build + prepare playground (run after clone/install)

# Testing
pnpm test               # Run tests (vitest run)
pnpm test:watch          # Run tests in watch mode
vitest run test/e2e/module.test.ts  # Run a single test file

# Quality
pnpm lint               # ESLint
pnpm test:types          # TypeScript type checking (vue-tsc --noEmit on both root and playground)

# Building
pnpm dev:build           # Build the playground app (nuxi build playground)
```

## Architecture

### Module Entry Point (`src/module.ts`)

The module registers under the `shopifyEmbedded` config key with Nuxt 4 compatibility. On setup it:
1. Validates required options (apiKey, apiSecret, appUrl, scopes) and warns on missing values
2. Injects config into both public and private `runtimeConfig.shopifyEmbedded`
3. Configures the Vue compiler to treat `<s-*>` tags as Polaris custom elements
4. Auto-imports server composables from `src/runtime/server/utils/`
5. Adds global TypeScript types for `window.shopify` (App Bridge) and `window.Polaris`
6. Injects App Bridge and Polaris CDN scripts into the HTML head

### Server Composables (auto-imported)

- `useShopifyAPI()` — singleton Shopify API client (session decoding, token exchange, etc.)
- `useShopifyGraphQL(shop, accessToken)` — returns a `GraphqlClient` instance for making requests via `client.request(query, { variables })`

### Authentication Flow (demonstrated in playground)

1. Client gets session token via `window.shopify.idToken()` (App Bridge)
2. Sends it as Bearer token in Authorization header
3. Server middleware (`playground/server/middleware/`) decodes token using `@shopify/shopify-api`, exchanges for offline access token
4. Stores shop domain and session in `event.context` for downstream API handlers

### Playground (`playground/`)

A working Shopify embedded app that serves as both a development environment and usage example. Configure via environment variables: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, `SHOPIFY_APP_SCOPES`. Requires Shopify CLI installed globally and `shopify app config link` run at the project root to generate `.toml` files.

### Test Structure

Tests are in `test/e2e/` using `@nuxt/test-utils` with a fixture app in `test/fixtures/basic/`. Tests validate runtime config injection, CDN script injection, and Vue compiler configuration.

## Key Patterns

- Polaris components are web components (`<s-page>`, `<s-button>`, etc.) — the Vue compiler is configured to pass them through, not treat them as Vue components
- Server utilities are auto-imported via `addServerImportsDir` — no manual imports needed in API routes
- Module options use `defu` for deep defaults merging
- The module uses `@nuxt/module-builder` for building and `changelogen` for releases
