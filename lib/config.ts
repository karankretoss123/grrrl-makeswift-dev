export type Config = {
  bigcommerce: {
    accessToken: string
    storeURL: string
    apiUrl: string
    storefrontURL: string
    storefrontToken: string
    channelId: string
    allowedCorsOrigins: string[]
  }
  makeswift: {
    siteApiKey: string
    productTemplatePathname: string
    categoryTemplatePathname: string
  }
}

function getEnvVarOrThrow(key: string): string {
  const value = process.env[key]

  if (!value) throw new Error(`"${key}" env var is not defined.`)

  return value
}

export function getConfig(): Config {
  const storeHash = 'zqjyzhdugi'
  const channelId = '1'
  return {
    bigcommerce: {
      accessToken: 'ke0dwftal3vhqe3cr8z3u7mvobe3w2k',
      storeURL: `https://api.bigcommerce.com/stores/${storeHash}`,
      apiUrl: `https://grrrlproxyserver.kretosstechnology.com/`,
      storefrontURL: `https://store-${storeHash}-${channelId}.mybigcommerce.com/graphql`,
      storefrontToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOlsxXSwiY29ycyI6W10sImVhdCI6MTg4NTYzNTE3NiwiaWF0IjoxNzM2NDE1NjU0LCJpc3MiOiJCQyIsInNpZCI6MTAwMzI3MzA2NSwic3ViIjoiajZkZjRkeThtMXR5czI0dDV0anljdXdmMjQ3dTg2aiIsInN1Yl90eXBlIjoyLCJ0b2tlbl90eXBlIjoyfQ.KL3BixCEcT1AfJaKIT4AlGQRaG4BjPhiEWIILknwoXJdVM10xXjPXjsBR9TaHMcMyO4nDSei6ve0ZiYxx6MZtQ',
      channelId: channelId,
      allowedCorsOrigins:
        process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
          ? [new URL(`https://${getEnvVarOrThrow('VERCEL_URL')}`).origin]
          : [],
    },
    makeswift: {
      // siteApiKey: 'bd914aed-6c6e-415e-b8a8-a142fb214cc0', untitled
      siteApiKey: '518c94f9-10b6-4f1b-9c33-27bd7b3106e7', //dapper
      productTemplatePathname: '/__product__',
      categoryTemplatePathname: '/__category__',
    },
  }
}
