import {
  defineNuxtModule,
  createResolver,
  addServerImportsDir,
  addTypeTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  apiKey: string
  apiSecret: string
  appUrl: string
  scopes: string
  appProxySecret?: string
  appHandle?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-shopify-embedded',
    configKey: 'shopifyEmbedded',
    compatibility: { nuxt: '^4.0.0' },
  },
  defaults: {
    apiKey: '',
    apiSecret: '',
    appUrl: '',
    scopes: '',
    appProxySecret: '',
    appHandle: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Validate required options (only warn if missing to allow playground/test usage)
    const requiredFields = ['apiKey', 'apiSecret', 'appUrl', 'scopes'] as const
    const missingFields = requiredFields.filter(field => !options[field])
    if (missingFields.length > 0) {
      console.warn(
        `[nuxt-shopify-embedded] Missing configuration: ${missingFields.join(', ')}. `
        + `Some features may not work correctly.`,
      )
    }

    // Inject module options into namespaced runtimeConfig
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      shopifyEmbedded: {
        apiKey: options.apiKey,
        apiSecret: options.apiSecret,
        appUrl: options.appUrl,
        scopes: options.scopes,
        appProxySecret: options.appProxySecret || '',
        appHandle: options.appHandle || '',
      },
      public: {
        shopifyEmbedded: {
          apiKey: options.apiKey,
          appUrl: options.appUrl,
        },
      },
    })

    // Vue compiler: treat Polaris <s-*> tags as custom elements
    const existingCheck = nuxt.options.vue.compilerOptions?.isCustomElement
    nuxt.options.vue.compilerOptions ||= {}
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) => {
      if (tag.startsWith('s-')) return true
      return existingCheck?.(tag) ?? false
    }

    // Server auto-imports: useShopifyAPI, useShopifyGraphQL
    addServerImportsDir(resolver.resolve('./runtime/server/utils'))

    // Add global types for App Bridge and Polaris
    addTypeTemplate({
      filename: 'types/nuxt-shopify-embedded.d.ts',
      getContents: () => `
import type { ShopifyGlobal } from '@shopify/app-bridge-types'
import type { PolarisGlobal } from '@shopify/polaris-types'

declare global {
  interface Window {
    shopify: ShopifyGlobal
    Polaris: PolarisGlobal
  }
}

export {}
`,
    })

    // Head CDN script import
    nuxt.options.app.head.script = nuxt.options.app.head.script || []
    nuxt.options.app.head.script.push(
      {
        'src': 'https://cdn.shopify.com/shopifycloud/app-bridge.js',
        'data-api-key': options.apiKey,
        'tagPosition': 'head',
      },
      { src: 'https://cdn.shopify.com/shopifycloud/polaris.js' },
    )
  },
})
