import { forwardRef, Ref, useEffect, useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import { getConfig } from 'lib/config'
import { usePathname } from 'next/navigation'
import parse from 'html-react-parser'
import { ProductAddToCartButton } from './cart'

type ProductDetails = {
  id: number
  name: string
  price: string
  description: string
  images: string[]
}

type Props = {
  className?: string
}

export const ProductData = forwardRef(function Tabs(
  { className }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const pathname = usePathname()
  const productId = pathname?.split('/').pop()
  const config = getConfig()
  const apiUrl: string = config.bigcommerce.apiUrl || ''
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchProductDetails = async (productId: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}v3/catalog/product?productId=${productId}`, {
        headers: {
          'X-Auth-Token': process.env.accessToken,
        },
      })
      const fetchedProduct = response.data.data
      setProduct({
        id: fetchedProduct.id,
        name: fetchedProduct.name,
        price: `$${fetchedProduct.price}`,
        description: fetchedProduct.description,
        images: fetchedProduct.images || [],
      })
      setSelectedImage(fetchedProduct.images?.[0] || null) // Set the first image as default
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchProductDetails(productId)
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full">
        <div className="loader h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
      </div>
    )
  }

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center w-full">No product data found.</div>
  }

  return (
    <div ref={ref} className={clsx(className, 'p-5')}>
      <div className="rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Images */}
          <div className="flex flex-col w-full md:w-1/2">
            {/* Main Image */}
            <div className="w-full">
              <img
                src={selectedImage || '/placeholder-image.jpg'}
                alt={product.name}
                className="rounded-xl w-full h-[18rem] object-cover md:h-[28rem]"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 md:grid-5 mt-4 space-x-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={clsx(
                    'w-max cursor-pointer rounded-lg border-2',
                    selectedImage === image ? 'border-blue-500' : 'border-transparent',
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="rounded-lg w-20 h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            <p className="text-lg text-gray-500 mt-2">{product.price}</p>
            {product.description && (
              <p className="text-gray-700 my-4">{parse(product.description)}</p>
            )}
            <ProductAddToCartButton />
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductData
