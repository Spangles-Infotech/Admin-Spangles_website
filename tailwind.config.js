/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        spangles: {
          50: "#D6DCDF",
          100: "#C2CBD0",
          200: "#AEBAC0",
          300: "#9AA9B0",
          400: "#8597A0",
          500: "#718690",
          600: "#5D7581",
          700: "#486371",
          800: "#345261",
          900: "#345261",
          950: "#345261",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
};
