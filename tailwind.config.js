/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables manual dark mode toggle using `class`
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Includes all your React files
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        zinc: {
          950: "#09090b",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.4)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Better form elements
    require("@tailwindcss/typography"), // For readable text
    require("tailwind-scrollbar"), // Custom scrollbars for dark mode
  ],
};
