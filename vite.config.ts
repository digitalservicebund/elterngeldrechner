/// <reference types="vitest" />
import path from "path";
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { OutputAsset, OutputChunk } from "rollup";

export default defineConfig({
  base: "./",
  plugins: [react(), includeReleaseVersionInBundlePlugin()],
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

function includeReleaseVersionInBundlePlugin(): PluginOption {
  return {
    name: "include-release-version-in-bundle",
    enforce: "post",
    generateBundle(_, bundle) {
      const version = process.env.EGR_BUILD_VERSION_HASH || "dev";

      function isJavascript(f: OutputChunk | OutputAsset): f is OutputChunk {
        return f.type === "chunk" && f.fileName.endsWith(".js");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(bundle).forEach(([_, file]) => {
        if (isJavascript(file)) {
          file.code += `window.__BUILD_VERSION_HASH__ = '${version}';`;
        }
      });
    },
  };
}
