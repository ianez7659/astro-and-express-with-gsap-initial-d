/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "sans-serif"],
      },
      fontSize: {
        "display-1": "64px",
        "display-2": "48px",
        "display-3": "32px",
        headline: "24px",
        "body-lg": "20px",
        body: "16px",
        caption: "14px",
      },
    },
  },
  plugins: [],
};
