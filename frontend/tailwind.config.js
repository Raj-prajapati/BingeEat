/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4C00",
        "primary-light": "#FF7040",
        "primary-pale": "#FFF0EB",
        yellow: "#FFB800",
        dark: "#1A0A00",
        cream: "#FFF8F3",
        gray: "#8C7B70",
        light: "#F5EDE8",
        soft: "#f5f5f5",
        pale: "#f9fafb",
        muted: "#f3f4f6",
        subtle: "#f8fafc",
        lightdark:"#282C35",
        charcole:"#36454f",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
