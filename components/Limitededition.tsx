import { ReactNode, Ref, forwardRef, useEffect, useState } from 'react'

import axios from 'axios'
import clsx from 'clsx'
import { getConfig } from 'lib/config'

type ProductItem = {
  title: ReactNode
  price: ReactNode
  description: ReactNode
  image: string
}
type Props = {
  className?: string
  categoryId: string
}

export const Limitededition = forwardRef(function Tabs(
  { className, categoryId = '23' }: Props,
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
      {isLoading ? (
        <div className="p-6 text-center text-lg text-gray-600 xl:mx-[20rem] 2xl:mx-[22rem]">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="p-6 text-center text-lg text-gray-600 xl:mx-[20rem] 2xl:mx-[22rem]">
          No products available for this category.
        </div>
      ) : (
        <div className="flex flex-col gap-8 md:flex-row xl:mx-[10rem] 2xl:mx-[22rem]">
          {/* Section 1: 2 products in the same column */}
          <div className="flex flex-col gap-6">
            {products.slice(0, 2).map((product, i) => (
              <div key={i} className="rounded-xl text-white shadow-lg">
                <img
                  src={product.image}
                  alt={product.title as string}
                  className="h-[15rem] w-[800px] rounded-[25px] object-cover md:h-[20rem]"
                />
                <h3 className="mt-4 text-lg">{product.title}</h3>
                <div className="mt-2">{product.price}</div>
              </div>
            ))}
          </div>

          {/* Section 2: 1 product */}
          {products.length > 2 && (
            <div className="rounded-xl text-white shadow-lg">
              <img
                src={products[2].image}
                alt={products[2].title as string}
                className="h-[45rem] w-[800px] rounded-[25px] object-cover"
              />
              <h3 className="mt-4 text-lg">{products[2].title}</h3>
              <div className="mt-2">{products[2].price}</div>
            </div>
          )}

          {/* Section 3: Static image and button */}
          <div className="flex flex-col items-start space-y-4">
            <div className="h-1/2">
              <img
                src="/images/limited.jpg"
                alt="Limited Edition"
                className="object-fit h-full w-full rounded-[25px]"
              />
            </div>
            <button className="w-max rounded-full bg-[#DBF067] px-12 py-3 text-lg font-bold shadow-md hover:bg-[#DBF067]/80">
              VIEW ALL
            </button>
            <img src="/images/smile.jpg" alt="Limited Edition" className="mt-4 h-20" />
          </div>
        </div>
      )}
    </div>
  )
})

export default Limitededition
