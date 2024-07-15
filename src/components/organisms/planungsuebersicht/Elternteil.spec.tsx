import { render, screen, within } from "@testing-library/react";
import { Elternteil } from "./Elternteil";
import {
  DetailsOfVariante,
  PlanungsdatenFuerElternteil,
  VariantenDetails,
} from "./types";

describe("Elternteil", () => {
  it("displays the name of the parent as heading", () => {
    render(<Elternteil {...ANY_PROPS} name="John" />);

    expect(screen.queryByRole("heading", { name: "John" })).toBeVisible();
  });

  it("displays the total number of planned months with the total money", () => {
    render(
      <Elternteil
        {...ANY_PROPS}
        totalNumberOfMonths={7}
        geldInsgesamt={7159}
      />,
    );

    expect(
      screen.queryByText(/7 Monate Elterngeld | insgesamt 7.159€/),
    ).toBeVisible();
  });

  it("displays the list of Zeiträume formatted correctly", () => {
    const zeitraeueme = [
      { from: new Date(2024, 0, 3), to: new Date(2024, 4, 2) },
      { from: new Date(2024, 10, 3), to: new Date(2025, 2, 2) },
    ];
    render(<Elternteil {...ANY_PROPS} zeitraeueme={zeitraeueme} />);

    const list = screen.getByLabelText("Elterngeld im Zeitraum:");
    const listItems = within(list).queryAllByRole("listitem");

    expect(listItems).toHaveLength(2);
    expect(listItems[0].textContent).toEqual("03.01. bis 02.05.2024");
    expect(listItems[1].textContent).toEqual("03.11.2024 bis 02.03.2025");
  });

  it("displays number of planned months and Elterngeld per Variante", () => {
    const details = {
      BEG: { ...ANY_DETAILS_OF_VARIANTE, numberOfMonths: 5, elterngeld: 1000 },
      "EG+": {
        ...ANY_DETAILS_OF_VARIANTE,
        numberOfMonths: 8,
        elterngeld: 2000,
      },
      PSB: { ...ANY_DETAILS_OF_VARIANTE, numberOfMonths: 2, elterngeld: 500 },
    };
    const { container } = render(
      <Elternteil {...ANY_PROPS} details={details} />,
    );

    // FIXME: Put Elterngeld values better in relation to the Varianten label.
    expect(container).toHaveTextContent("BasisElterngeld | 5 Monate");
    expect(screen.queryByText("1.000 €")).toBeVisible();

    expect(screen.queryByText("ElterngeldPlus | 8 Monate")).toBeVisible();
    expect(screen.queryByText("2.000 €")).toBeVisible();

    expect(screen.queryByText("Partnerschaftsbonus | 2 Monate")).toBeVisible();
    expect(screen.queryByText("500 €")).toBeVisible();
  });

  it("displays additional Netto Einkommen for a Variante if it is greater than zero", () => {
    const details = {
      ...ANY_DETAILS,
      BEG: { ...ANY_DETAILS_OF_VARIANTE, nettoEinkommen: 3210 },
      PSB: { ...ANY_DETAILS_OF_VARIANTE, nettoEinkommen: 0 },
    };
    render(<Elternteil {...ANY_PROPS} details={details} />);

    expect(
      screen.queryByText(/BasisElterngeld.*zusätzliches Einkommen 3.210 €/),
    ).toBeVisible();

    expect(
      screen.queryByText(/Partnerschaftsbonus.*zusätzliches Einkommen/),
    ).not.toBeInTheDocument();
  });
});

const ANY_DETAILS_OF_VARIANTE: DetailsOfVariante = {
  numberOfMonths: 0,
  elterngeld: 0,
  nettoEinkommen: 0,
};

const ANY_DETAILS: VariantenDetails = {
  BEG: ANY_DETAILS_OF_VARIANTE,
  "EG+": ANY_DETAILS_OF_VARIANTE,
  PSB: ANY_DETAILS_OF_VARIANTE,
};

const ANY_PROPS: PlanungsdatenFuerElternteil = {
  name: "Jane",
  totalNumberOfMonths: 0,
  geldInsgesamt: 0,
  zeitraeueme: [],
  details: ANY_DETAILS,
  lebensmonate: [],
};
