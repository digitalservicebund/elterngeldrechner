import ZusammenfassungUndDatenPage from "./ZusammenfassungUndDatenPage";
import { render, screen } from "@/test-utils/test-utils";

describe("Zusammenfassung und Daten Page", () => {
  it("should show the user feedback section", () => {
    render(<ZusammenfassungUndDatenPage />);

    const feedbackSection = screen.queryByLabelText(
      "War der Elterngeldrechner mit Planer für Sie hilfreich?",
    );

    expect(feedbackSection).toBeVisible();
  });
});
