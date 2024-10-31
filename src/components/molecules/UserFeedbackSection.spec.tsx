import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { UserFeedbackSection } from "./UserFeedbackSection";

describe("UserFeedbackSection", () => {
  it("should render a section with the correct label", () => {
    render(<UserFeedbackSection />);

    const section = screen.queryByLabelText(
      "War der Elterngeldrechner mit Planer für Sie hilfreich?",
    );

    expect(section).toBeVisible();
  });

  it("should show a 'Ja' and 'Nein' button", () => {
    render(<UserFeedbackSection />);

    expect(screen.queryByRole("button", { name: "Ja" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Nein" })).toBeVisible();
  });

  it.each(["Ja", "Nein"])(
    "should show message when user clicked %s button",
    async (label) => {
      render(<UserFeedbackSection />);

      const button = screen.getByRole("button", { name: label });
      await userEvent.click(button);

      expect(screen.getByText("Vielen Dank für Ihr Feedback!")).toBeVisible();
    },
  );

  it.each(["Ja", "Nein"])(
    "should hide the buttons when the user clicked %s button",
    async (label) => {
      render(<UserFeedbackSection />);

      const button = screen.getByRole("button", { name: label });
      await userEvent.click(button);

      expect(
        screen.queryByRole("button", { name: "Ja" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Nein" }),
      ).not.toBeInTheDocument();
    },
  );
});
