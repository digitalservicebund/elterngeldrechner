/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    restoreMocks: true,
    include: ["src/**/*.spec.*"],
    includeSource: ["src/**/*.ts"],
    watch: false,
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
