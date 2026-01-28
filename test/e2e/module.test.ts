import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch, useTestContext } from '@nuxt/test-utils/e2e'

describe('nuxt-shopify-app module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../fixtures/basic', import.meta.url)),
    server: true,
  })

  it('should inject runtime config', async () => {
    const ctx = useTestContext()
    const config = ctx.nuxt?.options.runtimeConfig

    expect(config?.shopifyEmbedded).toBeDefined()
    expect(config?.shopifyEmbedded.apiKey).toBe('test-api-key')
  })

  it('should add App Bridge script to head', async () => {
    const html = await $fetch('/')

    expect(html).toContain('cdn.shopify.com/shopifycloud/app-bridge.js')
    expect(html).toContain('data-api-key="test-api-key"')
  })

  it('should add Polaris script to head', async () => {
    const html = await $fetch('/')

    expect(html).toContain('cdn.shopify.com/shopifycloud/polaris.js')
  })

  it('should register custom element compiler option', async () => {
    const ctx = useTestContext()
    const isCustomElement
      = ctx.nuxt?.options.vue.compilerOptions?.isCustomElement

    expect(isCustomElement?.('s-button')).toBe(true)
    expect(isCustomElement?.('s-page')).toBe(true)
    expect(isCustomElement?.('div')).toBe(false)
  })
})
