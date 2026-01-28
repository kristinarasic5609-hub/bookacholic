/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: "#f5f1e9",
        lightgreen: "#c7e4c7",
        darkgreen: "#2f6f4e",
      },
    },
  },
  plugins: [],
};
