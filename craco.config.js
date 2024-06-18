const path = require("path");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig, { env, paths }) => {
      // disable minification in production build
      // files will be minified by the CMS' minifier
      webpackConfig.optimization.minimize = false;
      return webpackConfig;
    },
  },
  jest: {
    configure: {
      preset: "ts-jest",
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/",
      }),
    },
  },
};
