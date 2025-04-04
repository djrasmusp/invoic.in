// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    database: process.env.NUXT_POSTGRES_URL,
  },
  modules: ['@nuxt/eslint', 'nuxt-auth-utils'],
  auth: {
    webAuthn: true,
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
})
