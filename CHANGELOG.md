# Changelog

All notable changes to this project will be documented in this file.

## v0.1.8

[compare changes](https://github.com/shopiedge/nuxt-shopify-embedded/compare/v0.1.7...v0.1.8)

### 🏡 Chore

- **deps-dev:** Bump @types/node from 25.1.0 to 25.2.0 in the dev group ([#3](https://github.com/shopiedge/nuxt-shopify-embedded/pull/3))
- **deps-dev:** Bump @shopify/app-bridge-types in the shopify group ([#2](https://github.com/shopiedge/nuxt-shopify-embedded/pull/2))

## v0.1.7

[compare changes](https://github.com/shopiedge/nuxt-shopify-embedded/compare/v0.1.6...v0.1.7)

## v0.1.6

[compare changes](https://github.com/shopiedge/nuxt-shopify-embedded/compare/v0.1.5...v0.1.6)

## v0.1.5

[compare changes](https://github.com/qvdp/nuxt-shopify-embedded/compare/v0.1.4...v0.1.5)

## v0.1.4

[compare changes](https://github.com/qvdp/nuxt-shopify-embedded/compare/v0.1.3...v0.1.4)

## v0.1.3

[compare changes](https://github.com/qvdp/nuxt-shopify-embedded/compare/v0.1.2...v0.1.3)

## v0.1.2

[compare changes](https://github.com/qvdp/nuxt-shopify-embedded/compare/v0.1.1...v0.1.2)

## v0.1.1

## v0.1.0

_Release date: 2026-01-28_

### 🎉 Initial Release

First public release of `nuxt-shopify-embedded` — a Nuxt 4 module for building Shopify embedded apps.

### ✨ Features

- **Shopify API Client** — Pre-configured `@shopify/shopify-api` instance via `useShopifyAPI()` composable
- **GraphQL Client** — Type-safe GraphQL queries with `useShopifyGraphQL()` composable
- **Main Composable** — `useShopify()` for easy access to both API and GraphQL clients
- **Polaris Components** — Support for Shopify Polaris web components with `<s-*>` prefix
- **App Bridge CDN** — Automatic injection of App Bridge and Polaris scripts
- **TypeScript Support** — Full type definitions including global `Window` types for `window.shopify` and `window.Polaris`
- **Runtime Config** — Type-safe configuration with public/private separation
- **Auto-imports** — Server composables automatically available without imports

### 📦 Dependencies

- `@shopify/shopify-api` ^12.3.0
- `defu` ^6.1.4

### 🔧 Configuration Options

- `apiKey` — Shopify app API key (required)
- `apiSecret` — Shopify app API secret (required)
- `appUrl` — App public URL (required)
- `scopes` — OAuth scopes (required)
- `appProxySecret` — App proxy signature validation secret (optional)
- `appHandle` — App handle from Partner Dashboard (optional)