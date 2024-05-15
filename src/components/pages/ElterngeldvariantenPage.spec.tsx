import { screen } from "@testing-library/react";
import { render } from "@/test-utils/test-utils";
import { ElterngeldvariantenPage } from "./ElterngeldvariantenPage";

jest.mock("../organisms/elterngeldvarianten/usePayoutAmounts");

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
