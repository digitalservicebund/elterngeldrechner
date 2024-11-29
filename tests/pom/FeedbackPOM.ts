import { Locator, Page } from "@playwright/test";

export class FeedbackPOM {
  readonly page: Page;

  readonly appreciation: Locator;
  readonly easeQuestion: Locator;

  constructor(page: Page) {
    this.page = page;

    this.appreciation = page.getByTestId("feedback-appreciation");
    this.easeQuestion = this.page.getByTestId("ease-feedback-question");
  }

  async waehleEase(ease: 1 | 2 | 3 | 4 | 5) {
    const selector = `input[name="ease"][value="${ease}"]`;
    await this.page.locator(selector).check();
  }

  async waehleObstacle(option: string) {
    const selector = `input[name="obstacle"][value="${option}"]`;
    await this.page.locator(selector).check();
  }

  async submit() {
    const submitButton = this.page.locator("#feedback-submit-button");
    await submitButton.click();
  }
}
