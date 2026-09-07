import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#EEF5F7",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#16A9C7",
          hover: "#128EA8",
          light: "#E0F4F8",
          50: "#F0FAFC",
          100: "#E0F4F8",
          500: "#16A9C7",
          600: "#128EA8",
          700: "#0E7287",
        },
        dark: {
          DEFAULT: "#202B33",
          surface: "#192228",
          card: "#26343E",
          border: "#334450",
        },
        coral: {
          DEFAULT: "#EF6B62",
          hover: "#D9564D",
          light: "#FDEEEC",
        },
        text: {
          primary: "#263238",
          secondary: "#6B7780",
          muted: "#9AA5AD",
        },
        medical: {
          cyan: "#16A9C7",
          blue: "#2A7F9D",
          soft: "#EEF5F7",
          paper: "#FDFEFE",
          border: "#D8E5E8",
        },
        accent: {
          green: "#10B981",
          yellow: "#F59E0B",
          red: "#EF4444",
          orange: "#F97316",
        }
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(32, 43, 51, 0.05)",
        card: "0 10px 30px -4px rgba(32, 43, 51, 0.08)",
        paper: "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
        clipboard: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
