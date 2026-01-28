import { nodeAdapterInitialized } from '@shopify/shopify-api/adapters/node'
import { shopifyApi, ApiVersion } from '@shopify/shopify-api'
import { useRuntimeConfig } from '#imports'

if (!nodeAdapterInitialized) {
  throw new Error('Node adapter not initialized')
}

type ShopifyApiInstance = ReturnType<typeof shopifyApi>

let shopifyApiInstance: ShopifyApiInstance | null = null

export function useShopifyAPI(): ShopifyApiInstance {
  if (shopifyApiInstance) {
    return shopifyApiInstance
  }

  const config = useRuntimeConfig()

  const apiKey = config.shopifyEmbedded.apiKey
  const apiSecret = config.shopifyEmbedded.apiSecret
  const appUrl = config.shopifyEmbedded.appUrl
  const scopes = config.shopifyEmbedded.scopes

  if (!appUrl) {
    throw new Error('SHOPIFY_APP_URL is not defined')
  }

  if (!apiSecret) {
    throw new Error('SHOPIFY_API_SECRET is not defined')
  }

  if (!scopes) {
    throw new Error('SHOPIFY_APP_SCOPES is not defined')
  }

  let hostname: string
  try {
    const normalizedUrl = appUrl.startsWith('http')
      ? appUrl
      : `https://${appUrl}`
    hostname = new URL(normalizedUrl).hostname
  }
  catch {
    throw new Error(`Invalid SHOPIFY_APP_URL: ${appUrl}`)
  }

  shopifyApiInstance = shopifyApi({
    apiKey,
    apiSecretKey: apiSecret,
    scopes: scopes.split(','),
    hostName: hostname,
    hostScheme: 'https',
    apiVersion: ApiVersion.October25,
    isEmbeddedApp: true,
  })

  return shopifyApiInstance
}
