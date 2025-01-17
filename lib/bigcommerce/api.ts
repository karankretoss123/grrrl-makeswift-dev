import axios from 'axios'
import { getConfig } from '../config'
import { DEFAULT_CART } from './default-values'
import { CATEGORY_QUERY, PRODUCTS_QUERY, PRODUCT_QUERY } from './graphql'
import {
  CartResponse,
  CategoriesQuery,
  Category,
  GraphQLResponse,
  LineItemRequest,
  ProductFragment,
  ProductQuery,
  RedirectURLResponse,
  RestResponse,
} from './types'
const config = getConfig()
const apiUrl: string = config.bigcommerce.apiUrl || ''
export async function getProducts(): Promise<ProductFragment[]> {
  const config = getConfig()
  try {
    const response = await fetch(config.bigcommerce.storefrontURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
      }),
    })

    if (!response.ok) throw new Error(response.statusText)

    const result: GraphQLResponse<ProductQuery> = await response.json()
    // console.log('result=============', result)

    if (result.errors != null) {
      result.errors.forEach(error => {
        console.error(error.message)
      })
      throw new Error('There was an error fetching the products.')
    }

    return result.data.site.products.edges.map(edge => edge.node) // Proper return statement
  } catch (error) {
    console.log('erroro = ', error)
    return [] // Returning an empty array if an error occurs
  }
}

export async function getCategories(): Promise<Category[]> {
  const config = await getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({ query: CATEGORY_QUERY }),
  })

  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<CategoriesQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the categories.')
  }

  return result.data.site.categoryTree
}

export async function getProduct(id: number): Promise<any> {
  console.log('============getProduct id= ', id)

  const response = await fetch(`${apiUrl}v3/catalog/product?productId=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.accessToken,
    },
  })
  const result = await response.json()
  return result.data
}

export async function attemptGetCart(cartId: string): Promise<CartResponse | null> {
  try {
    const response = await fetch(`/api/cart?cartId=${cartId}`)
    const result: RestResponse<CartResponse> = await response.json()
    return result.data
  } catch {
    return null
  }
}
export async function createCart(): Promise<CartResponse> {
  console.log('------createCart-----------')

  const response = await fetch(`/api/cart`, {
    method: 'POST',
    body: JSON.stringify(null),
  })
  const result: RestResponse<CartResponse> = await response.json()
  return result.data
}

export async function addLineItem(
  cart: CartResponse | null,
  lineItem: LineItemRequest,
): Promise<any> {
  console.log('cart == ', cart)
  try {
    if (cart) {
      console.log('=========updateLineItem==============', lineItem ? [lineItem] : [])
      const response = await axios.post(`${apiUrl}v3/carts?cartId=${cart.id}`, {
        line_items: lineItem ? [lineItem] : [],
      })
      console.log('response === ', response.data.data)
      return response.data.data
    } else {
      console.log('=========addLineItem==============', lineItem ? [lineItem] : [])
      const response = await axios.post(`${apiUrl}v3/carts`, {
        line_items: lineItem ? [lineItem] : [],
      })
      console.log('response === ', response.data.data)
      return response.data.data
    }
  } catch (error) {
    console.log('error addLineItem======= ', error)

    return null
  }
}

export async function updateLineItem(
  cart: CartResponse,
  productId: number,
  lineItem: LineItemRequest,
): Promise<CartResponse> {
  console.log('updateLineItem === ', lineItem)
  try {
    const relatedLineItem = cart?.line_items.physical_items.find(
      lineItem => lineItem.product_id === productId,
    )
    if (!relatedLineItem) return cart
    const response = await axios.put(
      `${apiUrl}v3/carts/item?cartId=${cart.id}&itemId=${relatedLineItem.id}`,
      {
        line_item: lineItem,
      },
    )
    return response.data.data
  } catch (error) {
    console.log('error addLineItem======= ', error)

    return cart
  }
  // const response = await fetch(`/api/cart?cartId=${cart.id}&lineItemId=${relatedLineItem.id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify({
  //     line_item: lineItem,
  //   }),
  // })
  // const result: RestResponse<CartResponse> = await response.json()
  // return result.data
}

export async function deleteLineItem(
  cart: CartResponse,
  productId: number,
): Promise<CartResponse | null> {
  try {
    console.log('============deleteLineItem', cart.id)

    const relatedLineItem = cart?.line_items.physical_items.find(
      lineItem => lineItem.product_id === productId,
    )
    if (!relatedLineItem) return cart
    const response = await axios.delete(
      `${apiUrl}v3/carts?cartId=${cart.id}&lineItemId=${relatedLineItem.id}`,
    )
    return (response.data?.data as CartResponse) ?? null
  } catch (error) {
    console.log('error addLineItem======= ', error)

    return null
    // return cart
  }
}

export async function getCheckoutURL(cart: CartResponse | null): Promise<string | null> {
  if (!cart) return null
  console.log('==========getCheckoutURL')

  try {
    // const response = await fetch(`/api/checkout?cartId=${cart.id}`)
    // const result: RestResponse<RedirectURLResponse> = await response.json()
    // console.log('result.data.checkout_url ==== ', result.data)

    // return result.data.checkout_url
    const response = await axios.get(`${apiUrl}v3/checkout?cartId=${cart.id}`)
    console.log('response.data.checkoutUrl = ', response.data.checkoutUrl)

    return response.data.checkoutUrl
  } catch (e) {
    console.error(`There was an error requesting a Checkout URL`, e)
    return null
  }
}
