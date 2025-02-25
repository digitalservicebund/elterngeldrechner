/// <reference types="vitest" />
import path from "path";
import react from "@vitejs/plugin-react";
import { OutputAsset, OutputChunk } from "rollup";
import { PluginOption, defineConfig } from "vite";

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
  },
  test: {
    environment: "jsdom",
    setupFiles: "src/test-utils/setupTests.ts",
    restoreMocks: true,
    include: ["src/**/*.spec.{ts,tsx}"],
    includeSource: ["src/**/*.{ts,tsx}"],
    watch: false,
    resolveSnapshotPath: snapshotPathNextToTestFile,
    snapshotFormat: {
      indent: 0,
      min: true,
    },
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

/**
 * Creates a file path for the snapshot to locate it directly next to the
 * related test file in the file-system.
 *
 * It avoids to just extend the test file path with the snapshot extension to
 * prevent issues during executing a single test file using a filter. For
 * example if the test file path would be `/some/path/test.spec.ts` and the
 * snapshot file path `/some/path/test.spec.ts.snap` (as the official
 * documentation "recommends"), running Vitest with the test file path as filter
 * will also try to run the snapshot file, which fails.
 */
function snapshotPathNextToTestFile(
  testPath: string,
  snapshotExtension: string,
): string {
  const testPathWithoutFileExtension = path.join(
    path.parse(testPath).dir,
    path.parse(testPath).name,
  );

  return testPathWithoutFileExtension + snapshotExtension;
}
