export default defineNuxtConfig({
  compatibilityDate: '2025-01-10',

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/supabase'
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
    redirectOptions: {
      login: '/',
      callback: '/auth/confirm',
      exclude: ['/', '/nouveautes', '/best-sellers'], // Pages publiques
    }
  },

  i18n: {
    locales: [
      {
        code: 'fr',
        file: 'fr.json',
        name: 'Français'
      },
      {
        code: 'en',
        file: 'en.json',
        name: 'English'
      }
    ],
    lazy: true,
    langDir: 'locales',
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
