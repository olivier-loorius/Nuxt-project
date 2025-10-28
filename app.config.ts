export default defineAppConfig({
  nuxt: {
    routeRules: {
      // Routes publiques
      '/': { prerender: true },
      '/nouveautes': { prerender: true },
      '/best-sellers': { prerender: true },
      '/lingerie': { prerender: true },
      '/accessoires': { prerender: true },
      '/categories': { prerender: true },
      '/promotions': { prerender: true },
      '/idees-cadeaux': { prerender: true },
      '/about': { prerender: true },
      '/legal/**': { prerender: true },
      
      // Routes protégées (compte)
      '/compte/**': {
        ssr: false,
        middleware: ['auth']
      }
    }
  }
})