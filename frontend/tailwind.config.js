export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#eef7ff",
        night: "#081421",
        muted: "#9fb3c8",
        panel: "rgba(15, 28, 48, 0.82)",
        aqua: "#47e5bc",
        coral: "#ff7a68",
        sun: "#ffd166"
      },
      boxShadow: {
        glow: "0 16px 40px rgba(71, 229, 188, 0.12)"
      }
    }
  },
  plugins: []
};
