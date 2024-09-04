import { render, screen, within } from "@testing-library/react";
import { LebensmonatDetails } from "./LebensmonatDetails";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("LebensmonateDetails", () => {
  it("shows the Lebensmonatszahl", () => {
    render(<LebensmonatDetails {...ANY_PROPS} lebensmonatszahl={5} />);

    const textNode = screen.queryByText(/Lebensmonat$/)?.parentNode;

    expect(textNode?.textContent).toBe("5. Lebensmonat");
  });

  it("shows all the information for the choise made for the Lebensmonat in the summary", () => {
    const lebensmonat = {
      [Elternteil.Eins]: {
        gewaehlteOption: Variante.Basis,
        elterngeldbezug: 10,
        imMutterschutz: false as const,
      },
      [Elternteil.Zwei]: {
        gewaehlteOption: Variante.Plus,
        elterngeldbezug: 20,
        imMutterschutz: false as const,
      },
    };

    render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

    const summary = screen.getByTestId("summary");
    expect(within(summary).queryByText("Basis")).toBeVisible();
    expect(within(summary).queryByText("10 €")).toBeVisible();
    expect(within(summary).queryByText("Plus")).toBeVisible();
    expect(within(summary).queryByText("20 €")).toBeVisible();
  });

  it("shows information to be im Mutterschutz in a Lebensmonat", () => {
    const lebensmonat = {
      [Elternteil.Eins]: {
        imMutterschutz: true as const,
        gewaehlteOption: Variante.Basis as const,
        elterngeldbezug: null,
      },
      [Elternteil.Zwei]: { imMutterschutz: false as const },
    };

    render(<LebensmonatDetails {...ANY_PROPS} lebensmonat={lebensmonat} />);

    const summary = screen.getByTestId("summary");
    expect(within(summary).queryByText("Mutterschutz")).toBeVisible();
  });

  it("shows an input fieldset to choose an Option for each Elternteil in the details body", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const lebensmonat = {
      [Elternteil.Eins]: ANY_MONAT,
      [Elternteil.Zwei]: ANY_MONAT,
    };

    render(
      <LebensmonatDetails
        {...ANY_PROPS}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        lebensmonatszahl={3}
        lebensmonat={lebensmonat}
      />,
    );

    const body = screen.getByTestId("details-body");
    expect(
      within(body).getByRole("group", {
        name: "Auswahloptionen im Lebensmonat 3 für Jane",
      }),
    ).toBeInTheDocument();
    expect(
      within(body).getByRole("group", {
        name: "Auswahloptionen im Lebensmonat 3 für John",
      }),
    ).toBeInTheDocument();
  });

  it("uses the provided callback to determine the Auswahlmöglichkeiten per Elternteil", () => {
    const bestimmeAuswahlmoeglichkeiten = vi
      .fn()
      .mockReturnValue(ANY_AUSWAHLMOEGLICHKEITEN);
    const lebensmonat = {
      [Elternteil.Eins]: ANY_MONAT,
      [Elternteil.Zwei]: ANY_MONAT,
    };

    render(
      <LebensmonatDetails
        {...ANY_PROPS}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        lebensmonat={lebensmonat}
      />,
    );

    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledTimes(2);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Eins);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Zwei);
  });
});

const ANY_MONAT = { imMutterschutz: false as const };

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_PROPS = {
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: { imMutterschutz: false as const },
    [Elternteil.Zwei]: { imMutterschutz: false as const },
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  geburtsdatumDesKindes: new Date(),
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};
