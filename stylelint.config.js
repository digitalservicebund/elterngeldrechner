/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ["!./src/**/*.css"],
  extends: ["stylelint-config-recommended"],
  rules: {
    "at-rule-no-deprecated": [true, { ignoreAtRules: ["apply"] }],
    "at-rule-no-unknown": [true, { ignoreAtRules: ["tailwind"] }],
  },
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  reportUnscopedDisables: true,
};
