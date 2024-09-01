/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0BB489", // dark green
          "primary-content": "#F9FBFF", //White
          secondary: "#0BB489",
          "secondary-content": "#F9FBFF",
          accent: "#0BB489",
          "accent-content": "#F9FBFF",
          neutral: "#02050f",

          "neutral-content": "#ffffff",
          "base-100": "#58E1A5", // light green
          "base-200": "#f4f8ff", // bg (white)
          "base-300": "#0BB489",
          "base-content": "#02050f",
          info: "#adfa91",
          success: "#58E1A5",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#0BB489",
          "primary-content": "#F9FBFF",
          secondary: "#05856E",
          "secondary-content": "#F9FBFF",
          accent: "#046F5A",
          "accent-content": "#F9FBFF",
          neutral: "#1A1A1A",
          "neutral-content": "#0BB489",
          "base-100": "#2C7F6E",
          "base-200": "#217B64",
          "base-300": "#196D54",
          "base-content": "#F9FBFF",
          info: "#0BB489",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
