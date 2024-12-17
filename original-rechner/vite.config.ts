import { resolve } from "path";
import packageJson from "./package.json";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: packageJson.name, // Else vite-plugin-dts does not pick it up.
    },
  },
});
