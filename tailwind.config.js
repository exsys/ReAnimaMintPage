/** @type {import('tailwindcss').Config} */
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
      colors: {
        main: {
          button: "#0C002D"
        }
      },
      dropShadow: {
        "purple-sm": "0 0 3px #3813cf",
        "purple-md": "0 0 6px #3813cf",
      },
    },
  },
  plugins: [],
}

