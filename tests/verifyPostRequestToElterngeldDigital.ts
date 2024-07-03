import { Page, expect } from "@playwright/test";

export default async function verifyPostRequestToElterngeldDigital({
  page,
  expectedPostData,
}: {
  page: Page;
  expectedPostData: any;
}) {
  const url =
    "https://www.elterngeld-digital.de/wizardFrontServlet?_m=Elterngeld";

  await page.route(url, async (route) => {
    await route.fulfill();
  });

  page.once("request", async (request) => {
    expect(request.url()).toEqual(url);
    expect(await request.postDataJSON()).toEqual(expectedPostData);
  });
}
