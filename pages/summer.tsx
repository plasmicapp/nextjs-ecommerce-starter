import { Layout } from '@components/common'
import { getConfig } from '@framework/api'
import getAllProducts from '@framework/product/get-all-products'
import getSiteInfo from '@framework/common/get-site-info'
import getAllPages from '@framework/common/get-all-pages'
import PlasmicLoader from '@plasmicapp/loader'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { renderAsCollectionChild } from '@plasmicapp/react-web/dist/plume/collection-utils'
import React from 'react'
import { Grid, Marquee } from '@components/ui'
import { ProductCard } from '@components/product'
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })

  const { products } = await getAllProducts({
    variables: { first: 12 },
    config,
    preview,
  })

  const { categories, brands } = await getSiteInfo({ config, preview })
  const { pages } = await getAllPages({ config, preview })

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 14400,
  }
}

export default function Summer({
  products,
  categories,
  brands,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PlasmicLoader
      component="Summer"
      componentProps={{
        marquee: {
          render: () => (
            <Marquee variant="secondary">
              {products.slice(0, 3).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="slim"
                  imgProps={{
                    width: 320,
                    height: 320,
                  }}
                />
              ))}
            </Marquee>
          ),
        },
        catalog: {
          render: () => (
            <HomeAllProductsGrid
              products={products}
              categories={categories}
              brands={brands}
            />
          ),
        },
      }}
    />
  )
}

Summer.Layout = Layout
