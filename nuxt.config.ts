// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-10',

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],

  image: {
    formats: ['webp', 'avif', 'jpeg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  supabase: {
    redirect: false
  },

  i18n: {
    locales: [
      { code: 'fr', file: 'fr.json' },
      { code: 'en', file: 'en.json' }
    ],
    langDir: 'locales/',
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'fr'
    }
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Boys & Toys',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
