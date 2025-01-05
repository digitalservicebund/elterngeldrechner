import fs from "fs";
import path from "path";

import { ESLintUtils } from "@typescript-eslint/utils";

const message =
  'Importing the devDependency "{{ dependencyName }}" in production code is ' +
  "not recommended. If you have imported a test dependency that is used only " +
  "in in-source tests at the top level, it is suggested to convert it into a " +
  "dynamic import within the in-source test.";

const cachedDevDependencies = (() => {
  let cache = null;

  return () => {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const stats = fs.statSync(packageJsonPath);

    if (!cache || cache.lastModified !== stats.mtimeMs) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      cache = {
        dependencies: new Set(Object.keys(packageJson.devDependencies || {})),
        lastModified: stats.mtimeMs,
      };
    }

    return cache.dependencies;
  };
})();

const leakingDevDependenciesRules = ESLintUtils.RuleCreator.withoutDocs({
  name: "leaking-dev-dependencies",
  meta: {
    type: "problem",
    messages: {
      devDependencyImport: message,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource.startsWith(".") || path.isAbsolute(importSource)) {
          return;
        }

        if (node.importKind === "type") {
          return;
        }

        if (cachedDevDependencies().has(importSource)) {
          context.report({
            node: node.source,
            messageId: "devDependencyImport",
            data: {
              dependencyName: importSource,
            },
          });
        }
      },
    };
  },
});

export default leakingDevDependenciesRules;
