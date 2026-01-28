import type { GraphqlClient } from '@shopify/shopify-api'
import { useRuntimeConfig } from '#imports'
import { useShopifyAPI } from './useShopifyAPI'

export function useShopifyGraphQL(shop: string, accessToken: string): GraphqlClient {
  const config = useRuntimeConfig()
  const shopify = useShopifyAPI()

  return new shopify.clients.Graphql({
    session: {
      id: `offline_${shop}`,
      shop,
      state: '',
      isOnline: false,
      accessToken,
      scope: config.shopifyEmbedded.scopes,
      isActive: () => true,
      isScopeChanged: () => false,
      isScopeIncluded: () => true,
      isExpired: () => false,
      equals: () => false,
      toObject: () => ({
        id: `offline_${shop}`,
        shop,
        state: '',
        isOnline: false,
        accessToken,
        scope: config.shopifyEmbedded.scopes,
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
}
