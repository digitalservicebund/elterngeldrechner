import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "react", "jsx-a11y", "import"],
  options: {
    denyWarnings: true,
    typeAware: true,
  },
  categories: {
    correctness: "error",
  },
  env: {
    builtin: true,
    browser: true,
    node: true,
  },
  settings: {
    "jsx-a11y": {
      components: {
        CustomDate: "input",
      },
    },
    react: {
      version: "18.2",
    },
  },
  rules: {
    "no-console": "error",
    "no-unused-vars": ["error", { argsIgnorePattern: "_" }],

    "typescript/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/only-throw-error": "error",
    "typescript/prefer-promise-reject-errors": "error",
    "typescript/require-array-sort-compare": "error",
    "typescript/no-useless-default-assignment": "error",
    "typescript/no-misused-spread": "error",
    "react/no-unknown-property": "error",
    "react/button-has-type": "error",
    "react/hook-use-state": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-brace-presence": "error",
    "react/jsx-no-constructed-context-values": "error",
    "react/jsx-pascal-case": "error",
    "react/rules-of-hooks": "error",

    "import/first": "error",
  },
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      plugins: ["vitest"],
    },
    {
      files: [
        "src/monatsplaner/**",
        "src/elterngeldrechner/**",
        "src/bemessungszeitraumrechner/**",
        "src/lebensmonatrechner/**",
        "src/lohnsteuerrechner/**",
        "src/mutterschutzrechner/**",
      ],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/application", "@/application/*"],
                message:
                  "domain packages must not depend on the application layer.",
              },
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: ["original-rechner", "public", "dist"],
});
