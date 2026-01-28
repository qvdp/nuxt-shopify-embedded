# nuxt-shopify-embedded

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for building Shopify embedded apps with ease.

- [✨ Release Notes](/CHANGELOG.md)
- [📖 Documentation](#features)

## Features

- 🔐 **Shopify API Client** — Pre-configured `@shopify/shopify-api` instance with automatic settings
- 📊 **GraphQL Client** — Type-safe GraphQL queries with session management
- 🎨 **Polaris Components** — Use Shopify Polaris web components (`<s-*>` tags) out of the box
- 🌉 **App Bridge CDN** — Automatic injection of App Bridge and Polaris scripts
- 📦 **Type-Safe Config** — Full TypeScript support with runtime configuration
- 🔧 **Auto-Imports** — Server composables auto-imported, ready to use

## Quick Setup

### 1. Install the module

```bash
# Using pnpm
pnpm add nuxt-shopify-embedded

# Using npm
npm install nuxt-shopify-embedded

# Using yarn
yarn add nuxt-shopify-embedded
```

### 2. Add to your Nuxt config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-shopify-embedded'],

  shopifyEmbedded: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET,
    appUrl: process.env.SHOPIFY_APP_URL,
    scopes: process.env.SHOPIFY_APP_SCOPES,
    // Optional
    appProxySecret: process.env.SHOPIFY_APP_PROXY_SECRET,
    appHandle: process.env.SHOPIFY_APP_HANDLE,
  },
})
```

### 3. Set up environment variables

```bash
# .env
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret
SHOPIFY_APP_URL=https://your-app.com
SHOPIFY_APP_SCOPES=read_products,write_products
```

That's it! You can now use Shopify utilities in your app ✨

## Usage

### Server Composables

#### `useShopifyAPI()`

Returns the singleton Shopify API instance. Used for session token decoding, token exchange, and other API operations.

```typescript
const shopify = useShopifyAPI()

// Decode a session token
const decoded = await shopify.session.decodeSessionToken(token)

// Exchange for offline access token
const response = await shopify.auth.tokenExchange({ shop, sessionToken, requestedTokenType })
```

#### `useShopifyGraphQL(shop, accessToken)`

Creates a GraphQL client for a specific shop. Returns a Shopify `GraphqlClient` instance.

```typescript
// server/api/products.get.ts
export default defineEventHandler(async (event) => {
  const { shop, accessToken } = event.context.session

  const graphql = useShopifyGraphQL(shop.domain, accessToken)

  const result = await graphql.request(`
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node { id, title }
        }
      }
    }
  `, { variables: { first: 10 } })

  return result.data
})
```

### Polaris Components

Use Shopify Polaris components directly in your Vue templates with the `s-` prefix:

```vue
<template>
  <s-page title="Dashboard">
    <s-layout>
      <s-layout-section>
        <s-card>
          <s-text as="h2" variant="headingMd">Welcome to your app</s-text>
          <s-button @click="handleClick">Click me</s-button>
        </s-card>
      </s-layout-section>
    </s-layout>
  </s-page>
</template>
```

### App Bridge

App Bridge is automatically loaded. Access it via `window.shopify`:

```typescript
// In your Vue component
const toast = window.shopify.toast.show('Product saved!')

// Navigate using App Bridge
window.shopify.navigate('/products')
```

### Runtime Config

Access Shopify configuration in your app:

```typescript
// Client-side (public values only)
const config = useRuntimeConfig()
console.log(config.public.shopifyEmbedded.apiKey)
console.log(config.public.shopifyEmbedded.appUrl)

// Server-side (all values including secrets)
const config = useRuntimeConfig()
console.log(config.shopifyEmbedded.apiSecret)
console.log(config.shopifyEmbedded.appProxySecret)
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | ✅ | Your Shopify app's API key |
| `apiSecret` | `string` | ✅ | Your Shopify app's API secret |
| `appUrl` | `string` | ✅ | Your app's public URL |
| `scopes` | `string` | ✅ | Comma-separated OAuth scopes |
| `appProxySecret` | `string` | ❌ | Secret for app proxy signature validation |
| `appHandle` | `string` | ❌ | Your app's handle from the Partner Dashboard |

## TypeScript

This module provides full TypeScript support including:

- Module options autocomplete
- Runtime config types
- Global `Window` types for `window.shopify` (App Bridge) and `window.Polaris`
- GraphQL client response types

## Comparison with Alternatives

| Feature | nuxt-shopify-embedded | Shopifast (React) |
|---------|----------------------|-------------------|
| Framework | Nuxt / Vue 3 | Remix / React |
| Server Runtime | Nitro | Remix |
| Component Library | Polaris Web Components | Polaris React |
| Deployment | Any (Vercel, Cloudflare, etc.) | Vercel |
| Open Source | ✅ MIT License | Paid |

## Development

```bash
# Install dependencies
pnpm install

# Prepare the module
pnpm dev:prepare

# Start the playground
pnpm dev

# Start with Shopify CLI (for OAuth testing)
pnpm dev:shopify

# Run tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm test:types
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] OAuth flow utilities
- [ ] Session management helpers
- [ ] Webhook verification utilities
- [ ] App proxy utilities
- [ ] Billing API helpers
- [ ] CLI scaffolding tool

## License

[MIT License](LICENSE)

---

Made with ❤️ for the Nuxt & Shopify community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-shopify-embedded/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-shopify-embedded

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-shopify-embedded.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-shopify-embedded

[license-src]: https://img.shields.io/npm/l/nuxt-shopify-embedded.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-shopify-embedded

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
