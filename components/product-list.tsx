/* eslint-disable @next/next/no-img-element */
import { useProducts } from 'lib/products-context'
import { ProductFragment } from 'lib/bigcommerce'
import axios from 'axios'
import { getConfig } from 'lib/config'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdNavigateNext } from 'react-icons/md'
import { GrFormPrevious } from 'react-icons/gr'

type Props = {
  className?: string
  categoryEntityId?: string
  count?: number
  loadedProducts?: ProductFragment[] | null
}

export function ProductList({ className, categoryEntityId, count, loadedProducts }: Props) {
  const config = getConfig()
  const apiUrl: string = config.bigcommerce.apiUrl
  const defaultProducts = useProducts({ categoryEntityId, count })
  const [products, setProducts] = useState(loadedProducts ?? defaultProducts)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState(false)
  console.log('=======================categoryEntityId === ', categoryEntityId)
  console.log('=======================products.length === ', products.length)
  // console.log('=======================products111 === ', products[0])
  const fetchProducts = async (page: number) => {
    setLoading(true)
    setError(false)

    try {
      const response = await axios.get(
        `${apiUrl}v3/catalog/products/by-category?category=${categoryEntityId}&limit=10&page=${page}`,
        {
          headers: {
            'X-Auth-Token': config.bigcommerce.accessToken,
          },
        },
      )

      const fetchedProducts = response.data.data.map((product: any) => ({
        id: product.id,
        title: product.name,
        price: `$${product.price}`,
        description: product.description,
        image: product.image || '',
      }))

      setProducts(fetchedProducts)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])
  return (
    <div className={className + ' bg-[#0E0D1F] text-white w-full custom-padding'}>
      {/* <h1 className="text-xl font-bold">Product List</h1>
      <p className="text-lg">Id: {categoryEntityId}</p> */}
      {loading ? (
        <div className="flex min-h-screen items-center justify-center w-full">
          <div className="loader h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="p-6 text-center text-lg text-gray-600 min-h-screen">
          No products available for this category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {products.map((product: any) => (
              <Link href={`/product/${product.id}`} key={product.id} className="rounded-xl p-4">
                <img
                  src={product.image}
                  alt={product.title as string}
                  className="h-[18rem] w-full rounded-[25px] object-cover md:h-[28rem]"
                ></img>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="mt-2 font-bold text-green-500">{product.price}</p>
              </Link>
            ))}
          </div>
          <div className="my-8 flex justify-center space-x-4">
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)} className="">
                <GrFormPrevious className="text-2xl" />
              </button>
            )}

            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>

            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)} className="">
                <MdNavigateNext className="text-2xl" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
