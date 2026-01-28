export default defineEventHandler(async (event) => {
  const graphql = useShopifyGraphQL(
    event.context.shop.domain,
    event.context.session.accessToken,
  )

  const SHOP_QUERY = `
    query GetShopInfo {
      shop {
        name
        email
        myshopifyDomain
        plan {
          displayName
        }
      }
    }
  `

  try {
    const result = await graphql.request(SHOP_QUERY)

    return {
      success: true,
      data: result.data,
    }
  }
  catch (error: unknown) {
    console.error('GraphQL query failed:', error instanceof Error ? error.message : error)
    throw createError({
      statusCode: 500,
      message: 'GraphQL query failed',
    })
  }
})
