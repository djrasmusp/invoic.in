// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    scanPageMeta: true
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
