/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "append-to-code",
      enforce: "post",
      generateBundle(_, bundle) {
        const version = process.env.EGR_BUILD_VERSION_HASH || "dev";

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(bundle).forEach(([_, file]) => {
          if (file.type === "chunk" && file.fileName.endsWith(".js")) {
            file.code += `window.__BUILD_VERSION_HASH__ = '${version}';`;
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    restoreMocks: true,
    include: ["src/**/*.spec.*"],
    includeSource: ["src/**/*.{ts,tsx}"],
    watch: false,
    css: true,
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
