import { expect, test } from "@playwright/test";

/**
 * Post-deployment smoke test.
 *
 * The Elterngeldrechner ships as a single index.js that the Familienportal
 * CMS re-bundles and embeds into the page (see ADR 0005). Dependency updates
 * have produced artifacts that ran locally but threw once bundled, taking the
 * widget down on staging and production after a deployment. This test loads
 * the real deployed page and only verifies that the widget still comes up.
 *
 * It deliberately asserts nothing about the widget's contents beyond "it
 * mounted", so it keeps passing across feature-flag, routing and copy changes
 * and never needs maintenance for those.
 */

test("widget mounts on the deployed page", async ({ page }) => {
  // The environment-specific prefix comes from baseURL (ENVIRONMENT_URL) in
  // the config; "egr" is the widget's entry segment across all environments.
  await page.goto("egr", { waitUntil: "domcontentloaded" });

  // The bundle mounts React into #egr-root. A panicking artifact never gets
  // this far, so the root stays empty.
  const widget = page.locator("#egr-root");
  await expect(widget).not.toBeEmpty();

  // In CI the deploy stamps the commit onto the root as data-build. Asserting
  // it matches proves we tested the freshly deployed bundle, not a stale copy
  // still served by the bucket or a CDN (see ADR 0009). Skipped locally.
  const expectedBuild = process.env["EXPECTED_BUILD"];
  if (expectedBuild) {
    await expect(widget).toHaveAttribute("data-build", expectedBuild);
  }
});
