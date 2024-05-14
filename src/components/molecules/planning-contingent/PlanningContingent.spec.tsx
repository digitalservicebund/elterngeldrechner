import { render, screen } from "@testing-library/react";
import { PlanningContingent } from "./PlanningContingent";

describe("PlanningContingent", () => {
  it("is wraps in a header", () => {
    render(<PlanningContingent months={ANY_MONTHS} />);

    const header = screen.getByRole("banner", {
      name: "Kontingent von planbaren Monaten",
    });
    expect(header).toBeVisible();
  });

  describe("readable variant labels", () => {
    it("shows how many basis months are available of total", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, basis: { available: 1, taken: 1 } }}
        />,
      );

      const label = screen.queryByLabelText(
        "1 von 2 Basis Monaten noch verfügbar",
      );
      expect(label).toBeVisible();
    });

    it("shows how many plus months are available of total", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, plus: { available: 2, taken: 2 } }}
        />,
      );

      const label = screen.queryByLabelText(
        "2 von 4 Plus Monaten noch verfügbar",
      );
      expect(label).toBeVisible();
    });

    it("shows how many bonus months are available of total", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, bonus: { available: 1, taken: 1 } }}
        />,
      );

      const label = screen.queryByLabelText(
        "1 von 2 Bonus Monaten noch verfügbar",
      );
      expect(label).toBeVisible();
    });

    it("shows no bonus months if there are in total zero", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, bonus: { available: 0, taken: 0 } }}
        />,
      );

      const label = screen.queryByLabelText(
        "0 von 0 Bonus Monaten noch verfügbar",
      );
      expect(label).not.toBeInTheDocument();
    });
  });

  describe("visual box graph", () => {
    it("shows the correct number of available and taken basis months", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, basis: { available: 2, taken: 3 } }}
        />,
      );

      const availableBoxes = screen.queryAllByTestId("basis-available");
      const takenBoxes = screen.queryAllByTestId("basis-taken");

      expect(availableBoxes).toHaveLength(2);
      expect(takenBoxes).toHaveLength(3);
    });

    it("shows the correct number of available and taken plus months", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, plus: { available: 3, taken: 6 } }}
        />,
      );

      const availableBoxes = screen.queryAllByTestId("plus-available");
      const takenBoxes = screen.queryAllByTestId("plus-taken");

      expect(availableBoxes).toHaveLength(3);
      expect(takenBoxes).toHaveLength(6);
    });

    it("shows the correct number of available and taken bonus months", () => {
      render(
        <PlanningContingent
          months={{ ...ANY_MONTHS, bonus: { available: 2, taken: 2 } }}
        />,
      );

      const availableBoxes = screen.queryAllByTestId("bonus-available");
      const takenBoxes = screen.queryAllByTestId("bonus-taken");

      expect(availableBoxes).toHaveLength(2);
      expect(takenBoxes).toHaveLength(2);
    });
  });
});

const ANY_MONTHS = {
  basis: { available: 0, taken: 0 },
  plus: { available: 0, taken: 0 },
  bonus: { available: 0, taken: 0 },
};
