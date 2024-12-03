import { chromium } from "@playwright/test";
import * as core from "@actions/core";

async function run() {
  try {
    // eslint-disable-next-line no-undef
    const args = process.argv.slice(2);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(args[0]);

    const versionHash = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      return window["__BUILD_VERSION_HASH__"];
    });

    core.setOutput("version-hash", versionHash);

    await browser.close();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
