import { ReactNode, Ref, forwardRef, useEffect, useState } from 'react'

import axios from 'axios'
import clsx from 'clsx'
import { getConfig } from 'lib/config'
import Link from 'next/link'

type ProductItem = {
  id: ReactNode
  title: ReactNode
  price: ReactNode
  description: ReactNode
  image: string
}
type Props = {
  className?: string
  categoryId: string
}

export const Fourproduct = forwardRef(function Tabs(
  { className, categoryId }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const config = getConfig()
  const apiUrl: string = config.bigcommerce.apiUrl || ''
  const [products, setProducts] = useState<ProductItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProductsByCategory = async (categoryId: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${apiUrl}v3/catalog/products/by-category?category=${categoryId}`,
        {
          headers: {
            'X-Auth-Token': process.env.accessToken,
          },
        },
      )
      const fetchedProducts = response.data.data
        .map((product: any) => ({
          id: product.id,
          title: product.name,
          price: `$${product.price}`,
          description: product.description,
          image: product.image || '',
        }))
        .slice(0, 4)
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) fetchProductsByCategory(categoryId)
  }, [categoryId])
  return (
    <div ref={ref} className={clsx(className, 'p-5')}>
      {/* Product grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 ">
        {isLoading ? (
          <div className="p-6 text-center text-lg text-gray-600">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-lg text-gray-600">
            No products available for this category.
          </div>
        ) : (
          products.map((product, i) => (
            <Link
              href={`/product/${product.id}`}
              key={i}
              className="relative rounded-xl text-white shadow-lg"
            >
              <img
                src={product.image}
                alt={product.title as string}
                className="h-[18rem] w-full rounded-[25px] object-cover md:h-[28rem]"
              />
              <h3 className="mt-4 text-lg">{product.title}</h3>
              {/* <h3 className="mt-4 text-lg font-bold">{product.image}----</h3> */}
              <div className="mt-2">{product.price}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
})

export default Fourproduct
