/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "sp-teal": "#345261",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
};
