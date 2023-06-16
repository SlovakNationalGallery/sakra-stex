// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === "micr-io",
    },
  },
  modules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: true,
    },
    download: true,
  },
});
