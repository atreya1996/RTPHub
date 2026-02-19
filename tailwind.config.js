/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryStrong: "var(--color-primary-strong)",
        primarySoft: "var(--color-primary-soft)",
        accentLime: "var(--color-accent-lime)",
        accent1: "var(--color-accent1)",
        accent2: "var(--color-accent2)",
        ink: "var(--color-ink)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        bg: "var(--color-bg)"
      },
      fontFamily: {
        sans: ["var(--font-family)"]
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)"
      },
      boxShadow: {
        card: "var(--shadow-card)"
      }
    }
  },
  plugins: []
};

export default config;
