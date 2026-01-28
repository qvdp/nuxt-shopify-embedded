export default defineNuxtConfig({
  modules: ['../../../src/module'],
  compatibilityDate: '2025-01-28',

  shopifyEmbedded: {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
    appUrl: 'https://test-app.example.com',
    scopes: 'read_products,write_products',
  },
})
