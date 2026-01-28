export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: false },
  compatibilityDate: '2025-01-28',

  shopifyEmbedded: {
    apiKey: process.env.SHOPIFY_API_KEY || 'test-api-key',
    apiSecret: process.env.SHOPIFY_API_SECRET || 'test-api-secret',
    appUrl: process.env.SHOPIFY_APP_URL || 'https://localhost:3000',
    scopes: process.env.SHOPIFY_APP_SCOPES || 'read_products,write_products',
    appProxySecret: process.env.SHOPIFY_APP_PROXY_SECRET,
    appHandle: process.env.SHOPIFY_APP_HANDLE,
  },
})
