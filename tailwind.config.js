/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 200ms ease",
        contentShow: "contentShow 150ms ease",
        overlayShow: "overlayShow 150ms ease",
        load: "load 1s infinite linear",
      },
      backgroundImage: {
        "holo-100":
          "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.039), rgba(247, 181, 0, 0.039), rgba(109, 212, 0, 0.039), rgba(0, 145, 255, 0.039), rgba(250, 100, 0, 0.039), rgba(255, 255, 255, 0.013000000000000001), rgba(98, 54, 255, 0.039), rgba(182, 32, 224, 0.039))",
        "holo-400":
          "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.09), rgba(247, 181, 0, 0.09), rgba(109, 212, 0, 0.09), rgba(0, 145, 255, 0.09), rgba(250, 100, 0, 0.09), rgba(255, 255, 255, 0.03), rgba(98, 54, 255, 0.09), rgba(182, 32, 224, 0.09))",
        "holo-600":
          "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.18), rgba(247, 181, 0, 0.18), rgba(109, 212, 0, 0.18), rgba(0, 145, 255, 0.18), rgba(250, 100, 0, 0.18), rgba(255, 255, 255, 0.06), rgba(98, 54, 255, 0.18), rgba(182, 32, 224, 0.18))",
        "holo-900":
          "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.3), rgba(247, 181, 0, 0.3), rgba(109, 212, 0, 0.3), rgba(0, 145, 255, 0.3), rgba(250, 100, 0, 0.3), rgba(255, 255, 255, 0.1), rgba(98, 54, 255, 0.3), rgba(182, 32, 224, 0.3))",
      },
      boxShadow: {
        "secondary-inset": "0 0 0 0.25px rgb(var(--lightGrey)) inset",
      },
      colors: {
        green: "rgb(var(--green))",
        orange: "rgb(var(--orange))",
        darkGrey: "rgb(var(--darkGrey))",
        grey: "rgb(var(--grey))",
        lightGrey: "rgb(var(--lightGrey))",
        extraLightGrey: "rgb(var(--extraLightGrey))",
        keyboardGrey: "rgb(var(--keyboardGrey))",
        red: "rgb(var(--red))",
        white: "rgb(var(--white))",
        black: "rgb(var(--black))",
        night: "rgb(var(--night))",
        blue: "rgb(var(--blue))",
        link: "rgb(var(--blue))",
        primary: "rgb(var(--night))",
        primaryLight: "rgb(var(--darkGrey))",
        primaryVeryLight: "rgb(var(--lightGrey))",
        success: "rgb(var(--green))",
        secondary: "rgb(var(--white))",
      },
      fonts: {
        body: ['"Albert Sans"', "sans-serif"],
        mono: [
          '"SFMono-Regular"',
          '"Consolas"',
          '"Liberation Mono"',
          '"Menlo"',
          '"Courier"',
          "monospace",
        ],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "600",
        bolder: "700",
      },
      fontSize: {
        display: "80px",
        h1: "32px",
        h2: "24px",
        body: "16px",
        caption: "14px",
        small: "12px",
        tiny: "10px",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        contentShow: {
          "0%": {
            opacity: 0,
            transform: "translateY(3%) scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        load: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      screens: {
        xs: { max: "359px" },
        sm: { max: "600px" },
        "min-sm": "600px",
        md: { max: "980px" },
        lg: { max: "1280px" },
        xl: { max: "1440px" },
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "48px",
        10: "10px",
        20: "20px",
        40: "40px",
      },
      transitionProperty: {
        button:
          "background-color 100ms ease, filter 100ms ease, opacity 100ms ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
