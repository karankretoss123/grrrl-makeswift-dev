import {
  Combobox,
  Link,
  List,
  Number,
  Select,
  Shape,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

import {
  ProductList,
  ProductImages,
  Header,
  ProductAddToCartButton,
  ProductBreadcrumbs,
  ProductDescription,
  ProductName,
  LocaleProvider,
  ProductPrice,
  LocaleSwitcher,
  CategoryName,
  CategoryDescription,
  CategoryProductList,
  ProductData,
} from 'components'
import Threecategory from 'components/Threecategory'
import { Category } from 'lib/bigcommerce'
import { Locale } from 'lib/locale'
import { runtime } from './runtime'
import { lazy } from 'react'
import Sixproduct from 'components/Sixproduct'
import Fourproduct from 'components/Fourproduct'
import Limitededition from 'components/Limitededition'

ReactRuntime.registerComponent(ProductList, {
  type: 'product-list',
  label: 'Product list',
  props: {
    className: Style({ properties: Style.All }),
    categoryEntityId: Combobox({
      async getOptions() {
        return fetch(`/api/categories`)
          .then(r => r.json())
          .then((categories: Category[]) =>
            categories.map(category => ({
              id: category.entityId.toString(),
              label: category.name,
              value: category.entityId.toString(),
            })),
          )
      },
      label: 'Category',
    }),
    count: Number({
      label: 'Count',
      defaultValue: 4,
      max: 8,
      min: 1,
      labelOrientation: 'horizontal',
      step: 1,
    }),
  },
})

ReactRuntime.registerComponent(ProductImages, {
  type: 'product-images',
  label: 'Product images',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductPrice, {
  type: 'product-price',
  label: 'Product price',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductBreadcrumbs, {
  type: 'product-breadcrumbs',
  label: 'Product breadcrumbs',
  props: {
    className: Style({ properties: [Style.Margin, Style.Width] }),
  },
})

ReactRuntime.registerComponent(ProductName, {
  type: 'product-name',
  label: 'Product name',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductDescription, {
  type: 'product-description',
  label: 'Product description',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(Header as any, {
  type: 'header',
  label: 'Custom/Header',
  props: {
    className: Style({ properties: Style.All }),
    links: List({
      type: Shape({
        type: {
          link: Link(),
          text: TextInput({ label: 'Text' }),
        },
      }),
      label: 'Links',
      getItemLabel: item => item?.text ?? '',
    }),
  },
})

ReactRuntime.registerComponent(ProductAddToCartButton, {
  type: 'add-to-cart-button',
  label: 'Add to cart button',
  props: {
    className: Style({ properties: [Style.Margin] }),
  },
})

// ReactRuntime.registerComponent(LocaleProvider, {
//   type: 'locale-provider',
//   label: 'Locale provider',
//   props: {
//     className: Style(),
//     previewLocale: Select({
//       options: Object.keys(Locale).map(key => ({
//         value: Locale[key as keyof typeof Locale],
//         label: key,
//       })),
//     }),
//     english: Slot(),
//     spanish: Slot(),
//   },
// })

// ReactRuntime.registerComponent(LocaleSwitcher, {
//   type: 'locale-switcher',
//   label: 'Locale switcher',
//   props: {
//     className: Style(),
//     previewLocale: Select({
//       options: Object.keys(Locale).map(key => ({
//         value: Locale[key as keyof typeof Locale],
//         label: key,
//       })),
//     }),
//   },
// })

ReactRuntime.registerComponent(CategoryName, {
  type: 'category-name',
  label: 'Category name',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(CategoryDescription, {
  type: 'category-description',
  label: 'Category description',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(CategoryProductList, {
  type: 'category-product-list',
  label: 'Category product list',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(Threecategory, {
  type: 'Threecategory',
  label: 'Custom / Threecategory',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductData, {
  type: 'ProductData',
  label: 'Custom / ProductData',
  props: {
    className: Style({ properties: Style.All }),
  },
})

let categories: { label: string; value: string }[] = [
  { label: 'Shop All', value: '23' },
  { label: '$1', value: '26' },
  { label: 'Accessories', value: '27' },
  { label: 'Beanies', value: '28' },
  { label: 'Bold Print Leggings', value: '29' },
  { label: "Collectors' Edition Close Out", value: '30' },
  { label: 'Dietary Assistance', value: '31' },
  { label: 'First Access', value: '32' },
  { label: 'Gift Certificates', value: '33' },
  { label: 'HALLOWEEN 2024', value: '34' },
  { label: 'Headwear', value: '35' },
  { label: 'Hoodies', value: '36' },
  { label: 'limited edition new gear', value: '37' },
  { label: 'Martial Arts', value: '38' },
  { label: 'New Gear', value: '39' },
  { label: 'Pre-Workout', value: '40' },
  { label: 'Protein', value: '41' },
  { label: 'Rainbow Unicorn Sunday', value: '42' },
  { label: 'Shorts', value: '43' },
  { label: 'Solid Print Leggings', value: '44' },
  { label: 'Sports Bras', value: '45' },
  { label: 'Squat Proof Leggings', value: '46' },
  { label: 'Sweatpants', value: '47' },
  { label: 'Under $10', value: '48' },
  { label: 'Vag Up', value: '49' },
  { label: 'Weekly Specials', value: '50' },
  { label: 'Workout Tops', value: '51' },
  { label: 'Workout Tops & Sports Bras', value: '52' },
]

ReactRuntime.registerComponent(Sixproduct, {
  type: 'Sixproduct',
  label: 'Custom / Sixproduct',
  props: {
    className: Style({ properties: Style.All }),
    categoryId: Select({
      label: 'Category',
      options: categories as any,
    }),
  },
})

ReactRuntime.registerComponent(Fourproduct as any, {
  type: 'Fourproduct',
  label: 'Custom / Fourproduct',
  props: {
    className: Style({ properties: Style.All }),
    categoryId: Select({
      label: 'Category',
      options: categories as any, // Provide preloaded categories here
    }),
  },
})

ReactRuntime.registerComponent(Limitededition as any, {
  type: 'Limitededition',
  label: 'Custom / Limitededition',
  props: {
    className: Style({ properties: Style.All }),
    categoryId: Select({
      label: 'Category',
      options: categories as any, // Provide preloaded categories here
    }),
  },
})
