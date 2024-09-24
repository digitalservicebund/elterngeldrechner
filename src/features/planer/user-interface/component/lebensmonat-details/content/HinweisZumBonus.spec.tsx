import { render, screen } from "@testing-library/react";
import { HinweisZumBonus } from "./HinweisZumBonus";

describe("Hinweis zum Bonus", () => {
  it("shows information for automatic selection of two Lebensmonate", () => {
    render(<HinweisZumBonus />);

    expect(
      screen.queryByText(
        /Sie müssen Partnerschaftbonus für mindestens 2 Lebensmonate beantragen – deshalb wurde gegebenenfalls automatisch auch der folgende Monat ausgewählt./,
      ),
    ).toBeVisible();
  });

  it("shows hint for automatic parallel selection if has multiple Elternteile", () => {
    render(<HinweisZumBonus hasMultipleElternteile />);

    expect(
      screen.queryByText(
        /Wenn Sie den Partnerschaftsbonus auswählen, wird er auch automatisch für das andere Elternteil ausgewählt. Partnerschaftsbonus kann immer nur parallel genommen werden./,
      ),
    ).toBeVisible();
  });

  it("shows no hint for automatic parallel selection if has single Elternteil", () => {
    render(<HinweisZumBonus hasMultipleElternteile={false} />);

    expect(
      screen.queryByText(
        /Wenn Sie den Partnerschaftsbonus auswählen, wird er auch automatisch für das andere Elternteil ausgewählt. Partnerschaftsbonus kann immer nur parallel genommen werden./,
      ),
    ).not.toBeInTheDocument();
  });
});
