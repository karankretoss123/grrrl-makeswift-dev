/* eslint-disable @next/next/no-img-element */
import { useProducts } from 'lib/products-context'
import { ProductFragment } from 'lib/bigcommerce'

type Props = {
  className?: string
  categoryEntityId?: string
  count?: number
  loadedProducts?: ProductFragment[] | null
}

export function ProductList({ className, categoryEntityId, count, loadedProducts }: Props) {
  const defaultProducts = useProducts({ categoryEntityId, count })
  const products = loadedProducts ?? defaultProducts
  console.log('=======================products111 === ', products[0])

  return (
    <div
      className={`${className} grid grid-cols-[repeat(auto-fit,minmax(325px,max-content))] justify-center gap-5`}
    >
      {products.length === 0 && count !== 0 ? (
        <p className="font-sans text-lg">Looks like that category doesn&apos;t have any products</p>
      ) : (
        products.map((product: any) => (
          <div key={product.id} className="rounded-md border p-4 shadow-md">
            <img src={product?.defaultImage?.urlOriginal}></img>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 font-bold text-green-500">Price: ${product.price}</p>
          </div>
        ))
      )}
    </div>
  )
}
