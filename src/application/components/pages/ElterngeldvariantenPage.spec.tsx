import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElterngeldvariantenPage } from "./ElterngeldvariantenPage";
import { render } from "@/application/test-utils";

describe("ElterngeldvariantenPage", () => {
  it("shows a section that explains the different parental allowance variants", () => {
    render(<ElterngeldvariantenPage />);

    const section = screen.getByText("Elterngeld gibt es in 3 Varianten", {
      exact: false,
    });
    expect(section).toBeVisible();
  });

  it("displays a button to navigate back", () => {
    render(<ElterngeldvariantenPage />);

    const backButton = screen.getByRole("button", { name: "Zurück" });
    expect(backButton).toBeVisible();
  });

  it("displays a button to the month planner", () => {
    render(<ElterngeldvariantenPage />);

    const nextButton = screen.getByRole("button", { name: "Zum Monatsplaner" });
    expect(nextButton).toBeVisible();
  });
});
