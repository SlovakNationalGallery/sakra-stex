/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      animation: {
        scale: "scale 3s ease-in-out infinite",
      },
      keyframes: {
        scale: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": {
            transform: "scale(1.2)",
            opacity: "0.1",
          },
        },
      },
    },
    fontFamily: {
      display: ["SNG Sans", ...defaultTheme.fontFamily.sans],
      body: ["Circular", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
