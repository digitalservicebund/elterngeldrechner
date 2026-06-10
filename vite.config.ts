import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";
import type { Plugin, ResolvedConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    Icons({
      jsx: "react",
      compiler: "jsx",
      iconCustomizer(collection, icon, props) {
        props.focusable = "false";
        props["aria-hidden"] = "true";
        props["data-testid"] = `${icon}-icon`;
      },
    }),
    appWrapper(),
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
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/application/tests/setupTests.ts"],
    restoreMocks: true,
    include: ["src/**/*.spec.{ts,tsx}"],
    exclude: [],
    includeSource: ["src/**/*.{ts,tsx}"],
    watch: false,
    resolveSnapshotPath: snapshotPathNextToTestFile,
    snapshotFormat: {
      indent: 0,
      min: true,
    },
    chaiConfig: {
      truncateThreshold: 0,
    },
  },
  define: {
    "import.meta.vitest": "undefined",
  },
  build: {
    target: "es2015",
    sourcemap: true,
    rolldownOptions: {
      output: {
        minify: "dce-only",
      },
    },
  },
});

/**
 * Wraps the widget in a copy of the Familienportal host page so dev, preview
 * and e2e builds resemble production. The host page is a snapshot produced by
 * `scripts/generate-app-wrapper.sh`, cached in the gitignored `.app-wrapper/`
 * directory. The build reads that cache rather than fetching live, so it does
 * not depend on familienportal.de being reachable; CI persists the cache and
 * only regenerates it on a cache miss.
 *
 * The snapshot's static requisites are copied into the public dir and the host
 * page itself is written to the project root as Vite's HTML entry, with the
 * widget module script (and, on preview builds, the "Testumgebung" banner)
 * injected. This replaces the former setup-app-wrapper.sh, removing the shell
 * dependency on GNU sed/wget from the build and its cross-platform pitfalls.
 *
 * The fetched assets are proprietary, so they are only ever cached, never
 * committed. When the cache is absent — a fresh checkout that has not run the
 * generate script yet — the widget is mounted in a bare host page so the app
 * still builds and runs without the Familienportal chrome.
 */
function appWrapper(): Plugin {
  return {
    name: "app-wrapper",
    configResolved(config) {
      // Skip during unit tests; Vitest neither serves nor builds the wrapper.
      if (process.env.VITEST || config.mode === "test") return;

      if (config.command !== "build" && config.command !== "serve") return;

      generateAppWrapper(config, process.env.VITE_PREVIEW_BANNER === "true");
    },
  };
}

// Location of the cached host-page snapshot, populated by the
// generate-app-wrapper script (and restored from cache in CI).
function resolveWrapperSource(root: string): string | null {
  const cached = path.resolve(root, ".app-wrapper/wrapper");
  return fs.existsSync(cached) ? cached : null;
}

function generateAppWrapper(config: ResolvedConfig, withBanner: boolean): void {
  // Rebuild the public dir from scratch so removed requisites do not linger.
  const publicDir = config.publicDir;
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const wrapperSource = resolveWrapperSource(config.root);
  if (!wrapperSource) {
    // No snapshot available: mount the widget in a bare host page.
    config.logger.warn(
      "[app-wrapper] No snapshot — using bare host page (`scripts/generate-app-wrapper.sh` for chrome).",
    );

    fs.writeFileSync(path.join(config.root, "index.html"), FALLBACK_HOST_PAGE);

    return;
  }

  // Copy the snapshot's static requisites; the host page itself becomes the
  // HTML entry and is handled separately below.
  for (const entry of fs.readdirSync(wrapperSource)) {
    if (entry === "index.html") continue;
    fs.cpSync(path.join(wrapperSource, entry), path.join(publicDir, entry), {
      recursive: true,
    });
  }

  const head: string[] = [];
  if (withBanner) {
    fs.writeFileSync(path.join(publicDir, "include.js"), PREVIEW_BANNER_JS);
    fs.writeFileSync(path.join(publicDir, "include.css"), PREVIEW_BANNER_CSS);
    head.push('<script src="include.js"></script>');
    head.push('<link rel="stylesheet" href="include.css">');
  }
  head.push('<script type="module" src="src/application/index.tsx"></script>');

  const hostPage = fs.readFileSync(
    path.join(wrapperSource, "index.html"),
    "utf8",
  );
  fs.writeFileSync(
    path.join(config.root, "index.html"),
    hostPage.replace("</head>", `${head.join("\n")}\n</head>`),
  );
}

// Minimal host page used when the app-wrapper snapshot is unavailable. It
// provides only the mount point the widget looks for (see index.tsx), so the
// app runs without the Familienportal chrome.
const FALLBACK_HOST_PAGE = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Elterngeldrechner (ohne Familienportal-Rahmen)</title>
    <script type="module" src="src/application/index.tsx"></script>
  </head>
  <body>
    <main>
      <div id="egr-root"></div>
    </main>
  </body>
</html>
`;

// Marks the preview environment and dims the surrounding host chrome so it is
// not mistaken for production. The `?original=1` query param opts out.
const PREVIEW_BANNER_JS = `(function() {
  const params = new URL(document.location).searchParams;
  const toggle = params.get("original");
  if (toggle === "1") return;

  const el = document.createElement("div");
  el.innerText = "Testumgebung!";
  el.className = "ds-preview-warning";
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("body").appendChild(el);
    document.querySelectorAll(".header__container, .breadcrumb, .page-title, .contact-flap, .footer").forEach(el => el.classList.add("ds-disable"));
  });
}());
`;

const PREVIEW_BANNER_CSS = `.ds-preview-warning {
  background-color: white;
  color: red;
  border: 5px solid red;
  font-weight: bold;
  padding: 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media print {
  .ds-preview-warning {
    display: none;
  }
}

.ds-disable {
  opacity: 0.3;
  filter: grayscale(90%);
  pointer-events: none;
}
`;

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
