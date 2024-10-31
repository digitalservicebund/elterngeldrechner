import {
  config as defineConfig,
  configs as tsEslintConfigs,
} from "typescript-eslint";

import js from "@eslint/js";

import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import accessibilityPlugin from "eslint-plugin-jsx-a11y";
import tailwindPlugin from "eslint-plugin-tailwindcss";
import vitestPlugin from "@vitest/eslint-plugin";

import importPlugin from "eslint-plugin-import";
import importPathsPlugin from "eslint-plugin-no-relative-import-paths";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import prettierPluginRecommendedConfig from "eslint-plugin-prettier/recommended";

import egrRulesPlugin from "./eslint-rules/egr-plugin.js";

const eslintConfig = [
  js.configs.recommended,
  { rules: { "no-console": "error" } },
];

const languageOptions = [
  {
    languageOptions: {
      globals: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

const ignoredFilesConfig = [
  {
    ignores: ["public", "dist", "*.yml"],
  },
];

const typescriptConfig = tsEslintConfigs.recommended;

const customRulesConfig = [
  {
    plugins: {
      "egr-rules": egrRulesPlugin,
    },
    rules: {
      "egr-rules/vi-mock-imports": "error",
    },
  },
];

const accessibilityConfig = [accessibilityPlugin["flatConfigs"].recommended];

const tailwindConfig = [
  ...tailwindPlugin.configs["flat/recommended"],

  // Enable when no BEM is used anymore.
  { rules: { "tailwindcss/no-custom-classname": "off" } },
];

const prettierConfig = [prettierPluginRecommendedConfig];

const unusedImportsConfig = [
  {
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

const importConfig = [
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/order": "error",
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
  },
];

const reactConfig = [
  {
    rules: {
      "react/function-component-definition": "error",
      "react/boolean-prop-naming": "error",
      "react/destructuring-assignment": "error",
      "react/hook-use-state": "error",
      "react/prefer-read-only-props": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-no-leaked-render": "error",
      "react/jsx-no-constructed-context-values": "error",
      "react/button-has-type": "error",

      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
    },
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
  },
];

const reactHooksConfig = [
  {
    rules: reactHooksPlugin.configs.recommended.rules,
    plugins: { "react-hooks": reactHooksPlugin },
  },
];

const vitestConfig = [
  {
    files: ["tests/**"],
    plugins: vitestPlugin.configs.recommended.plugins,
    rules: vitestPlugin.configs.recommended.rules,
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
  },
];

const noRelativeImportPathsConfig = [
  {
    plugins: {
      "no-relative-import-paths": importPathsPlugin,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, rootDir: "src", prefix: "@" },
      ],
    },
  },
];

export default defineConfig(
  ...languageOptions,
  ...eslintConfig,
  ...ignoredFilesConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...reactHooksConfig,
  ...accessibilityConfig,
  ...tailwindConfig,
  ...importConfig,
  ...vitestConfig,
  ...unusedImportsConfig,
  ...noRelativeImportPathsConfig,
  ...customRulesConfig,
  ...prettierConfig,
);
