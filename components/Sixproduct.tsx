import { ReactNode, Ref, forwardRef, useEffect, useState } from 'react'

import axios from 'axios'
import clsx from 'clsx'
import { getConfig } from 'lib/config'
import Link from 'next/link'
import { useRouter } from 'next/router'

type ProductItem = {
  id: ReactNode
  title: ReactNode
  price: ReactNode
  description: ReactNode
  image: string
}
type Props = {
  className?: string
  categoryId: any
}

export const Sixproduct = forwardRef(function Tabs(
  { className, categoryId }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const router = useRouter()
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
        .slice(0, 6)
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAllClick = () => {
    router.push('/category/51')
  }

  useEffect(() => {
    if (categoryId) fetchProductsByCategory(categoryId)
  }, [categoryId])
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        'flex flex-col justify-center bg-cover bg-center px-5 py-12', // Tailwind classes for background styling
      )}
      style={{
        backgroundImage: 'url("/images/six-product-bg.png")', // Replace with your image URL
      }}
    >
      <h3 className="py-12 text-center text-[18px] text-xl font-bold capitalize italic md:text-[36px]">
        FEATURED COLLECTION
      </h3>
      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:px-[5rem] 2xl:px-[20rem]">
        {isLoading ? (
          <div className="p-6 text-center text-lg text-gray-600">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-lg text-gray-600">
            No products available for this category.
          </div>
        ) : (
          products.map((product, i) => (
            // <div key={i} className="rounded-xl">
            <Link href={`/product/${product.id}`} key={i} className="rounded-xl">
              <img
                src={product.image}
                alt={product.title as string}
                className="h-[8rem] w-[14rem] rounded-[25px] object-cover md:h-[10rem]"
              />
              <h3 className="mt-4 text-lg">{product.title}</h3>
              <div className="mt-2 text-sm font-light">{product.price}</div>
            </Link>
            // </div>
          ))
        )}
      </div>

      <button
        className="mx-auto mt-20 w-max rounded-full bg-[#FF02D6] px-24 py-4 text-white shadow-md hover:bg-[#FF02D6]/80"
        onClick={() => handleViewAllClick()}
      >
        VIEW ALL
      </button>
    </div>
  )
})

export default Sixproduct
