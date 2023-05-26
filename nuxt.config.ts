// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      "/api/**": {
        proxy: "https://www.webumenia.sk/api/**",
        swr: true,
      },
    },
  },
});
