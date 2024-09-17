import { render, screen } from "@testing-library/react";
import { ZeitraumLabel } from "./ZeitraumLabel";

describe("Zeitraum Label", () => {
  it("shows no year for the start date if equal to the final date's year", () => {
    const zeitraum = { from: new Date(2013, 3, 7), to: new Date(2013, 4, 6) };
    render(<ZeitraumLabel zeitraum={zeitraum} />);

    expect(screen.getByText("07.04. bis 06.05.2013")).toBeVisible();
  });

  it("shows year for the start date if not equal to the final date's year", () => {
    const zeitraum = { from: new Date(2013, 3, 7), to: new Date(2014, 4, 6) };
    render(<ZeitraumLabel zeitraum={zeitraum} />);

    expect(screen.getByText("07.04.2013 bis 06.05.2014")).toBeVisible();
  });

  it("uses a better label for screen-readers with full month names", () => {
    const zeitraum = { from: new Date(2013, 3, 7), to: new Date(2013, 4, 6) };
    render(<ZeitraumLabel zeitraum={zeitraum} />);

    expect(screen.getByTestId("label")).toHaveAccessibleName(
      "vom 7. April bis zum 6. Mai 2013",
    );
  });

  it("uses given prefix", () => {
    const zeitraum = { from: new Date(2013, 3, 7), to: new Date(2013, 4, 6) };
    render(<ZeitraumLabel zeitraum={zeitraum} prefix="Zeitraum" />);

    expect(screen.getByText("Zeitraum: 07.04. bis 06.05.2013")).toBeVisible();
    expect(screen.getByTestId("label")).toHaveAccessibleName(
      "Zeitraum vom 7. April bis zum 6. Mai 2013",
    );
  });

  describe("adaptive HTML element type", () => {
    it("renders per default a span", () => {
      render(<ZeitraumLabel {...ANY_PROPS} htmlElementType={undefined} />);
      const label = screen.getByTestId("label");

      expect(label.nodeName.toLowerCase()).toBe("span");
    });

    it("renders a HTML element of given type", () => {
      render(<ZeitraumLabel {...ANY_PROPS} htmlElementType="li" />);
      const label = screen.getByTestId("label");

      expect(label.nodeName.toLowerCase()).toBe("li");
    });
  });
});

const ANY_PROPS = {
  zeitraum: {
    from: new Date(),
    to: new Date(),
  },
};
