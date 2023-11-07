/** @type {import('tailwindcss').Config} */

function makeHoloGradientRgbas(alphaMultiplier) {
  return [
    [224, 32, 32, 0.3],
    [247, 181, 0, 0.3],
    [109, 212, 0, 0.3],
    [0, 145, 255, 0.3],
    [250, 100, 0, 0.3],
    [255, 255, 255, 0.1],
    [98, 54, 255, 0.3],
    [182, 32, 224, 0.3],
  ].map(([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a * alphaMultiplier})`)
}

const holoTheme = {
  holoGradient: {
    '900': makeHoloGradientRgbas(1.0),
    '600': makeHoloGradientRgbas(0.6),
    '400': makeHoloGradientRgbas(0.3),
    '100': makeHoloGradientRgbas(0.13),
  },
  nightHoloAmbientGradient: [
    'rgba(224, 32, 32, 0.075)',
    'rgba(247, 181, 0, 0.075)',
    'rgba(109, 212, 0, 0.075)',
    'rgba(0, 145, 255, 0.075)',
    'rgba(250, 100, 0, 0.075)',
    'rgba(255, 255, 255, 0.03)',
    'rgba(98, 54, 255, 0.08)',
    'rgba(182, 32, 224, 0.08)',
  ]
}

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
        body: ['"Albert Sans"', 'sans-serif'],
        mono: ['"SFMono-Regular"', '"Consolas"', '"Liberation Mono"', '"Menlo"', '"Courier"', 'monospace']
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '600',
        bolder: '700',
      },
      fontSize: {
        display: '80px',
        h1: '32px',
        h2: '24px',
        body: '16px',
        caption: '14px',
        small: '12px',
        tiny: '10px',
      },
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '48px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'holo-100': "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.039), rgba(247, 181, 0, 0.039), rgba(109, 212, 0, 0.039), rgba(0, 145, 255, 0.039), rgba(250, 100, 0, 0.039), rgba(255, 255, 255, 0.013000000000000001), rgba(98, 54, 255, 0.039), rgba(182, 32, 224, 0.039))",
        'holo-400': "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.09), rgba(247, 181, 0, 0.09), rgba(109, 212, 0, 0.09), rgba(0, 145, 255, 0.09), rgba(250, 100, 0, 0.09), rgba(255, 255, 255, 0.03), rgba(98, 54, 255, 0.09), rgba(182, 32, 224, 0.09))",
        'holo-600': "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.18), rgba(247, 181, 0, 0.18), rgba(109, 212, 0, 0.18), rgba(0, 145, 255, 0.18), rgba(250, 100, 0, 0.18), rgba(255, 255, 255, 0.06), rgba(98, 54, 255, 0.18), rgba(182, 32, 224, 0.18))",
        'holo-900': "radial-gradient(89.9% 222.34% at 7.36% 24.19%, rgba(224, 32, 32, 0.3), rgba(247, 181, 0, 0.3), rgba(109, 212, 0, 0.3), rgba(0, 145, 255, 0.3), rgba(250, 100, 0, 0.3), rgba(255, 255, 255, 0.1), rgba(98, 54, 255, 0.3), rgba(182, 32, 224, 0.3))",
      }
    },
    screens: {
      xs: { max: '359px' },
      sm: { max: '600px' },
      md: { max: '980px' },
      lg: { max: '1280px' },
      xl: { max: '1440px' },
    }
  },
  plugins: [],
}

