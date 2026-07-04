import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0C10",
          50: "#F4F5F7",
        },
        surface: {
          DEFAULT: "#12151B",
          raised: "#171B23",
          sunken: "#0D0F14",
        },
        border: {
          DEFAULT: "#232833",
          strong: "#2E3541",
        },
        ink: {
          DEFAULT: "#E8EAF0",
          muted: "#8B93A7",
          dim: "#5B6472",
        },
        platform: {
          DEFAULT: "#4C6FFF",
          soft: "#1B2340",
          hover: "#6685FF",
        },
        tenant: {
          DEFAULT: "#2DD4BF",
          soft: "#0E2B29",
          hover: "#4FE0CD",
        },
        warn: {
          DEFAULT: "#F5A623",
          soft: "#332310",
        },
        danger: {
          DEFAULT: "#F0554C",
          soft: "#3A1918",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
    },
  },
  plugins: [],
};

export default config;
