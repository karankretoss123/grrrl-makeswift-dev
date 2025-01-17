import Link from 'next/link'
import { ReactNode, Ref, forwardRef, useEffect, useState } from 'react'

import axios from 'axios'
import clsx from 'clsx'
import { getConfig } from 'lib/config'

type Props = {
  className?: string
}

type HomeCategoryItem = {
  id: string
  slug: string
  image_url: string
  name: ReactNode
}

export const Threecategory = forwardRef(function Tabs(
  { className }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const config = getConfig()
  const apiUrl: string = config.bigcommerce.apiUrl || ''
  const [homeCategory, setHomeCategory] = useState<HomeCategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHomeCategory = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}v3/catalog/home/categories`, {
        headers: {
          'X-Auth-Token': process.env.accessToken,
        },
      })
      const fetchedHomeCategory = response.data.data
        .map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          image_url: product.image_url,
        }))
        .slice(0, 4)
      setHomeCategory(fetchedHomeCategory)
    } catch (error) {
      console.error('Error fetching homeCategory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHomeCategory()
  }, [])
  return (
    <div ref={ref} className={clsx(className, 'p-5')}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 ">
        {isLoading ? (
          <div className="p-6 text-center text-lg text-gray-600">Loading categories...</div>
        ) : homeCategory.length === 0 ? (
          <div className="p-6 text-center text-lg text-gray-600">No categories available.</div>
        ) : (
          homeCategory.map((product, i) => (
            <Link
              href={`/category/${product.id}`}
              key={i}
              className="relative rounded-xl text-white"
            >
              <img
                src={product.image_url}
                alt={product.name as string}
                className="h-[18rem] w-full rounded-[25px] object-cover md:h-[28rem]"
              />
              <h3 className="absolute bottom-4 left-4 text-[31px] text-lg font-bold capitalize italic">
                {product.name}
              </h3>
            </Link>
          ))
        )}
      </div>
    </div>
  )
})

export default Threecategory
