export default defineNuxtConfig({
  compatibilityDate: "2025-01-10",

  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/supabase",
  ],

  image: {
    formats: ["webp", "avif", "jpeg"],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  supabase: {
    redirect: false,
  },

  i18n: {
    restructureDir: ".",
    locales: [
      {
        code: "fr",
        file: "fr.json",
        name: "Français",
      },
      {
        code: "en",
        file: "en.json",
        name: "English",
      },
    ],
    langDir: "locales",
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "no prefix",
      alwaysRedirect: false,
      fallbackLocale: "fr",
    },
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Boys & Toys",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "preload",
          as: "font",
          href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    payloadExtraction: true,
  },
});
