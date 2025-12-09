export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080",
        "background-light": "#FAF9F6",
        "background-dark": "#102022",
        "card-light": "#FFFFFF",
        "card-dark": "#1A2C2E",
        "text-light": "#333333",
        "text-dark": "#E0E0E0",
        "muted-light": "#666666",
        "muted-dark": "#A0A0A0",
        "border-light": "#E0E0E0",
        "border-dark": "#3A4D50",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
