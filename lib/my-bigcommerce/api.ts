import { FullCategory, FullCategoryQuery, CategoryProductsQuery } from './types'
import { getConfig } from 'lib/config'
import { FULL_CATEGORY_QUERY, CATEGORY_PRODUCTS_QUERY } from './graphql'
import { GraphQLResponse, ProductFragment } from 'lib/bigcommerce'

export async function getFullCategory(id: number): Promise<FullCategory | null> {
  const config = getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({
      query: FULL_CATEGORY_QUERY,
      variables: { entityId: id },
    }),
  })

  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<FullCategoryQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the category.')
  }

  return result.data.site.category ?? null
}

export async function getCategoryProducts(id: number): Promise<ProductFragment[]> {
  const config = getConfig()
  console.log('=============getCategoryProducts===============', id)
  try {
    const response = await fetch(config.bigcommerce.storefrontURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
      },
      body: JSON.stringify({
        query: CATEGORY_PRODUCTS_QUERY,
        variables: { entityId: id, first: 50 },
      }),
    })

    if (!response.ok) throw new Error(response.statusText)

    const result: GraphQLResponse<CategoryProductsQuery> = await response.json()

    if (result.errors != null) {
      result.errors.forEach(error => {
        console.error(error.message)
      })

      throw new Error('There was an error fetching the products.')
    }
    const finalResult = result.data.site.search.searchProducts.products.edges.map(edge => edge.node)
    console.log('finalResult.length === ', finalResult[0])

    return finalResult
  } catch (error) {
    console.log('erroro = ', error)
    return [] // Returning an empty array if an error occurs
  }
}
