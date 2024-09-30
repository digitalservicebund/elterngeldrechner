import { render, screen } from "@testing-library/react";
import { AbschnittMitAuswahloptionen } from "./AbschnittMitAuswahloptionen";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
  type Lebensmonat,
} from "@/features/planer/user-interface/service";
import type { BestimmeAuswahlmoeglichkeitenFuerLebensmonat } from "@/features/planer/user-interface/service/callbackTypes";

describe("Abschnitt mit Auswahloptionen", () => {
  it("shows an input fieldset to choose an Option for each Elternteil", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    render(
      <AbschnittMitAuswahloptionen
        {...ANY_PROPS}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        lebensmonatszahl={3}
      />,
    );

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl von Jane für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl von John für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();
  });

  it("shows an input fieldset to choose an Option for single Elternteil", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "",
    };
    const lebensmonat: Lebensmonat<Elternteil.Eins> = {
      [Elternteil.Eins]: ANY_MONAT,
    };

    render(
      <AbschnittMitAuswahloptionen
        {...ANY_PROPS}
        lebensmonatszahl={3}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
      />,
    );

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();
  });

  it("uses the provided callback to determine the Auswahlmöglichkeiten per Elternteil", () => {
    const bestimmeAuswahlmoeglichkeiten = vi
      .fn()
      .mockReturnValue(
        ANY_AUSWAHLMOEGLICHKEITEN,
      ) as BestimmeAuswahlmoeglichkeitenFuerLebensmonat<Elternteil>;

    render(
      <AbschnittMitAuswahloptionen
        {...ANY_PROPS}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
      />,
    );

    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledTimes(2);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Eins);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Zwei);
  });
});

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_MONAT = { imMutterschutz: false as const };

const ANY_PROPS = {
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: ANY_MONAT,
    [Elternteil.Zwei]: ANY_MONAT,
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};
