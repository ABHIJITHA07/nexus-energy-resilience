import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0B0E14",
          secondary: "#12161F",
          tertiary: "#1A1F2B",
        },
        border: {
          subtle: "#262C3A",
          active: "#3E7BFA",
        },
        text: {
          primary: "#EDEFF3",
          secondary: "#9AA3B5",
          muted: "#5F6779",
        },
        accent: {
          DEFAULT: "#3E7BFA",
          hover: "#5A8FFF",
        },
        status: {
          wait: "#3E7BFA",
          prepare: "#E0A32C",
          act: "#D9534F",
          positive: "#3FB27F",
          negative: "#D9534F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-inter)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
