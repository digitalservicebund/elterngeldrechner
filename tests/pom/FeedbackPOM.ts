import { Locator, Page } from "@playwright/test";

export class FeedbackPOM {
  readonly page: Page;

  readonly appreciation: Locator;
  readonly easeQuestion: Locator;

  constructor(page: Page) {
    this.page = page;

    this.appreciation = page.getByText(
      "Vielen Dank! Ihr Feedback hilft uns, den Elterngeldrechner für alle Nutzenden zu verbessern!",
    );
    this.easeQuestion = this.page.getByRole("radiogroup", {
      name: "Wie einfach war es für Sie den Elterngeldrechner zu nutzen?",
    });
  }

  async waehleEase(ease: 1 | 2 | 3 | 4 | 5) {
    await this.page
      .getByRole("radiogroup", {
        name: "Wie einfach war es für Sie den Elterngeldrechner zu nutzen?",
      })
      .getByRole("radio", { name: ease.toString() })
      .click();
  }

  async waehleObstacle(option: string) {
    await this.page
      .getByRole("radiogroup", { name: "Was war die größte Schwierigkeit?" })
      .getByRole("radio", { name: option })
      .click();
  }

  async submit() {
    const submitButton = this.page.locator("#feedback-submit-button");
    await submitButton.click();
  }
}
