/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    borderRadius: {
      2: "0.111rem",
      DEFAULT: "0.222rem",
    },
    colors: {
      /* Functional */
      black: "#000000",
      primary: "#62396C",
      "primary-light": "#E4DFED",
      /* Accent */
      white: "#ffffff",
      "grey-dark": "#999999",
      /* Background */
      "off-white": "#F4F4F4",
      grey: "#D6D6D6",
      /* Semantic */
      text: "#000000",
      "text-light": "#595959",
      success: "#056639",
      danger: "#B4081A",
      Basis: "#004B76",
      Plus: "#80CDEC",
      Bonus: "#66B692",
    },
    fontSize: {
      14: ["0.777rem", { lineHeight: "1.111rem" }],
      base: ["1rem", { lineHeight: "1.555rem" }],
      20: ["1.111rem", { lineHeight: "1.111rem" }],
      22: ["1.222rem", { lineHeight: "1.555rem" }],
      24: ["1.333rem", { lineHeight: "2.222rem" }],
      28: ["1.555rem", { lineHeight: "2.444rem" }],
      40: ["2.222rem", { lineHeight: "3.333rem" }],
      80: ["4.444rem", { lineHeight: "6.111rem" }],
    },
    fontWeight: {
      // Only weights we have font-faces for.
      regular: "400",
      bold: "700",
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
    spacing: {
      // Currently based on the manually set 18px root font-size.
      0: "0rem",
      1: "0.055rem",
      2: "0.111rem",
      4: "0.222rem",
      6: "0.333rem",
      8: "0.444rem",
      10: "0.555rem",
      12: "0.666rem",
      14: "0.777rem",
      16: "0.888rem",
      18: "1rem",
      20: "1.111rem",
      24: "1.333rem",
      28: "1.555rem",
      32: "1.777rem",
      36: "2rem",
      40: "2.222rem",
      44: "2.444rem",
      48: "2.666rem",
      56: "3.111rem",
      64: "3.555rem",
      80: "4.444rem",
      96: "5.333rem",
      112: "6.222rem",
      128: "7.111rem",
      144: "8rem",
      160: "8.888rem",
      176: "9.777rem",
      192: "10.666rem",
      208: "11.555rem",
      224: "12.444rem",
      240: "13.333rem",
      288: "16rem",
      320: "17.777rem",
      384: "21.333rem",
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
};
