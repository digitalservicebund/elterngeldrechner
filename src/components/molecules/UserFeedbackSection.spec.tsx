import { render, screen } from "@testing-library/react";
import { UserFeedbackSection } from "./UserFeedbackSection";

describe("UserFeedbackSection", () => {
  it("should render a section with the correct label", () => {
    render(<UserFeedbackSection />);

    const section = screen.queryByLabelText(
      "War der Elterngeldrechner mit Planer für Sie hilfreich?",
    );

    expect(section).toBeVisible();
  });

  it("should show a 'Ja' button", () => {
    render(<UserFeedbackSection />);

    const button = screen.queryByRole("button", { name: "Ja" });

    expect(button).toBeVisible();
  });

  it("should show a 'Nein' button", () => {
    render(<UserFeedbackSection />);

    const button = screen.queryByRole("button", { name: "Nein" });

    expect(button).toBeVisible();
  });
});
