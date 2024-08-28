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
          "base-300": "#58E1A5",
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
          primary: "#0BB489",            // Vibrant green
          "primary-content": "#F9FBFF",  // Light text on primary
          secondary: "#05856E",          // Darker green for secondary
          "secondary-content": "#F9FBFF",// Light text on secondary
          accent: "#046F5A",             // Even darker green for accents
          "accent-content": "#F9FBFF",   // Light text on accent
          neutral: "#1A1A1A",            // Near-black neutral background
          "neutral-content": "#0BB489",  // Green content on neutral background
          "base-100": "#2C7F6E",         // Black-like base background
          "base-200": "#217B64",         // Slightly lighter than base-100
          "base-300": "#196D54",         // Another step lighter, still very dark
          "base-content": "#F9FBFF",     // Light content on dark base
          info: "#0BB489",               // Consistent info color with primary
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
