import { RequestedTokenType } from '@shopify/shopify-api'

export default defineEventHandler(async (event) => {
  // Skip middleware for non-API routes
  if (!event.path.startsWith('/api')) {
    return
  }

  const shopify = useShopifyAPI()

  // 1. Extract Bearer token from Authorization header
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return
  }

  const sessionToken = authHeader.slice(7) // Remove 'Bearer ' prefix

  // 2. Decode and validate token
  let decodedToken
  try {
    decodedToken = await shopify.session.decodeSessionToken(sessionToken)
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to decode session token:', message)
    return
  }

  if (!decodedToken?.dest) {
    return
  }

  // 3. Extract shop domain from token
  const shop = new URL(decodedToken.dest).hostname

  // 4. Exchange session token for offline access token
  const offlineSessionId = shopify.session.getOfflineId(shop)
  if (offlineSessionId) {
    try {
      const response = await shopify.auth.tokenExchange({
        shop,
        sessionToken,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      })

      if (!response.session.accessToken) {
        console.error('No access token in token exchange response')
        return
      }

      // Store session and shop in event context for downstream handlers
      event.context.session = response.session
      event.context.shop = { domain: shop }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Token exchange failed:', message)
      return
    }
  }
})
