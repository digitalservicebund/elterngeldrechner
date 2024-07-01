/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    // Content Management System of production environment does apply
    // minification automatically. Double minification has lead to bugs.
    minify: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    restoreMocks: true,
    include: ["src/**/*.spec.*"],
    watch: false,
  },
});
