import { render, screen } from "@testing-library/react";
import { ZeitraumLabel } from "./ZeitraumLabel";

describe("Zeitraum Label", () => {
  it("shows no year for the start date if equal to the final date's year", () => {
    const zeitraum = { from: new Date(2013, 3, 17), to: new Date(2013, 4, 16) };
    render(<ZeitraumLabel zeitraum={zeitraum} />);

    expect(screen.queryByText("Zeitraum: 17.04. bis 16.05.2013")).toBeVisible();
  });

  it("shows year for the start date if not equal to the final date's year", () => {
    const zeitraum = { from: new Date(2013, 3, 17), to: new Date(2014, 4, 16) };
    render(<ZeitraumLabel zeitraum={zeitraum} />);

    expect(
      screen.queryByText("Zeitraum: 17.04.2013 bis 16.05.2014"),
    ).toBeVisible();
  });
});
