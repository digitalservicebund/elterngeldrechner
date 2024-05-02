import { readFile } from "fs/promises";
import type { KnipConfig } from "knip";

// TODO: Remove once feature was implemented upstream (webpro/knip#613)
async function readGitInfoExcludePatterns(): Promise<string[]> {
  const buffer = await readFile(".git/info/exclude");
  return buffer
    .toString("utf-8")
    .split(/\r\n|\r|\n/)
    .filter((line) => !!line.trim())
    .filter((line) => !line.startsWith("#"))
    .map((line) => (line.endsWith("/") ? `${line}**` : line));
}

export default async function composeConfiguration(): Promise<KnipConfig> {
  const gitInfoExcludePatterns = await readGitInfoExcludePatterns();

  return {
    ignore: [...gitInfoExcludePatterns],
    ignoreDependencies: [
      "react-router", // Comes implicitly with `react-scripts`
      "eslint-config-react-app", // Comes implicitly with `react-scripts`
      "eslint-plugin-jsx-a11y", // Comes implicitly with `react-scripts`
      "sass", // Comes implicitly with `react-scripts`
      "@digitalservice4germany/angie", // no CSS integration yet
    ],
    include: ["nsExports", "nsTypes", "classMembers"],
    jest: true, // Not picked automatically due to `react-scripts`
  };
}
