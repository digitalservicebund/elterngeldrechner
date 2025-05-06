import containerQueriesPlugin from "@tailwindcss/container-queries";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  important: "#egr-root",
  corePlugins: {
    preflight: false,
  },
  plugins: [containerQueriesPlugin],
  theme: {
    borderRadius: {
      full: "50%",
      2: "0.125rem",
      DEFAULT: "0.25rem",
    },
    colors: {
      transparent: "transparent",
      /* Functional */
      black: "#000000",
      primary: "#62396C",
      "primary-light": "#E4DFED",
      tertiary: "#A6214B",
      "tertiary-light": "#FFF3F7",
      /* Accent */
      white: "#ffffff",
      "grey-dark": "#999999",
      "grey-light": "#f2f3f4",
      /* Background */
      "off-white": "#F4F4F4",
      grey: "#D6D6D6",
      /* Semantic */
      text: "#000000",
      "text-light": "#595959",
      success: "#056639",
      warning: "#e18324",
      danger: "#B4081A",
      Basis: "#004B76",
      Plus: "#80CDEC",
      Bonus: "#66B692",
      "Bonus-dark": "#40775e",
      "Bonus-light": "#e1eee8",
    },
    fontSize: {
      14: ["0.875rem", { lineHeight: "1.429" }],
      16: ["1rem", { lineHeight: "1.375" }],
      base: ["1.125rem", { lineHeight: "1.556" }],
      20: ["1.25rem", { lineHeight: "1.2" }],
      22: ["1.375rem", { lineHeight: "1.273" }],
      24: ["1.5rem", { lineHeight: "1.667" }],
      28: ["1.75rem", { lineHeight: "1.571" }],
      40: ["2.5rem", { lineHeight: "1.5" }],
      80: ["5rem", { lineHeight: "1.375" }],
    },
    fontWeight: {
      // Only weights we have font-faces for.
      regular: "400",
      bold: "700",
    },
    fontFamily: {
      sans: ["BundesSans", "Helvetica", "Arial", "sans-serif"],
    },
    height: {
      /*
       * Intentionally remove heights of the default theme to avoid styling with
       * static heights. Rather rely on more algorithmic and thereby more responsive
       * styles like flex basis or grid fractional units.
       * Though, certain specific heights will still be needed. These should be
       * rather relative values and added with care.
       */
    },
    outlineOffset: {
      2: "0.125rem",
      4: "0.25rem",
      6: "0.375rem",
    },
    spacing: {
      0: "0",
      1: "0.0625rem",
      2: "0.125rem",
      4: "0.25rem",
      6: "0.375rem",
      8: "0.5rem",
      10: "0.625rem",
      16: "1rem",
      20: "1.25rem",
      24: "1.5rem",
      32: "2rem",
      40: "2.5rem",
      56: "3.5rem",
      80: "5rem",
      96: "6rem",
      112: "7rem",
      128: "8rem",
      144: "9rem",
      160: "10rem",
    },
    width: {
      /*
       * Intentionally remove widths of the default theme to avoid styling with
       * static widths. Rather rely on more algorithmic and thereby more
       * responsive styles like flex basis or grid fractional units.
       * Though, certain specific widths will still be needed. These should be
       * rather relative values and added with care.
       */
      full: "100%",
    },
  },
} satisfies Config;
