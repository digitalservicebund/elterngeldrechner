import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AbschnittMitAuswahloptionen } from "./AbschnittMitAuswahloptionen";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/planer/lebensmonatsliste/lebensmonat-details/informationenZumLebensmonat";
import {
  type AusgangslageFuerEinElternteil,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/monatsplaner";

vi.mock(
  import(
    "@/application/features/planer/component/planer/lebensmonatsliste/lebensmonat-details/informationenZumLebensmonat"
  ),
);

describe("Abschnitt mit Auswahloptionen", () => {
  beforeEach(() => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue(
      ANY_INFORMATION_ZUM_LEBENSMONAT,
    );
  });

  it("shows an input fieldset to choose an Option for each Elternteil", () => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      },
      lebensmonatszahl: 3 as const,
      lebensmonat: {
        [Elternteil.Eins]: ANY_MONAT,
        [Elternteil.Zwei]: ANY_MONAT,
      },
    });

    render(<AbschnittMitAuswahloptionen />);

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
    vi.mocked(
      useInformationenZumLebensmonat<AusgangslageFuerEinElternteil>,
    ).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      ausgangslage: {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      },
      lebensmonatszahl: 3 as const,
      lebensmonat: { [Elternteil.Eins]: ANY_MONAT },
    });

    render(<AbschnittMitAuswahloptionen />);

    expect(
      screen.getByRole("radiogroup", {
        name: "Auswahl für den 3. Lebensmonat",
      }),
    ).toBeInTheDocument();
  });

  it("uses the provided callback to determine the Auswahlmöglichkeiten per Elternteil", () => {
    const bestimmeAuswahlmoeglichkeiten = vi
      .fn()
      .mockReturnValue(ANY_AUSWAHLMOEGLICHKEITEN);

    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      bestimmeAuswahlmoeglichkeiten,
    });

    render(<AbschnittMitAuswahloptionen />);

    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Eins);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Zwei);
  });

  it("shows a hint when any Auswahlmöglichkeit is not selectable", () => {
    const bestimmeAuswahlmoeglichkeiten = vi.fn().mockReturnValue({
      ...ANY_AUSWAHLMOEGLICHKEITEN,
      [Variante.Basis]: ANY_DISABLED_AUSWAHLMOEGLICHKEIT,
    });

    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      bestimmeAuswahlmoeglichkeiten,
    });

    render(<AbschnittMitAuswahloptionen />);

    expect(
      screen.getByText("Warum sind einige Auswahlmöglichkeiten grau?"),
    ).toBeVisible();
  });
});

const ANY_GEBURTSDATUM_DES_KINDES = new Date();

const ANY_ENABLED_AUSWAHLMOEGLICHKEIT = {
  elterngeldbezug: 1,
  istAuswaehlbar: true as const,
};

const ANY_DISABLED_AUSWAHLMOEGLICHKEIT = {
  elterngeldbezug: 1,
  istAuswaehlbar: false as const,
  grundWiesoNichtAuswaehlbar: "darum",
};

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: ANY_ENABLED_AUSWAHLMOEGLICHKEIT,
  [Variante.Plus]: ANY_ENABLED_AUSWAHLMOEGLICHKEIT,
  [Variante.Bonus]: ANY_ENABLED_AUSWAHLMOEGLICHKEIT,
  [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
};

const ANY_MONAT = { imMutterschutz: false as const };

const ANY_INFORMATION_ZUM_LEBENSMONAT = {
  ausgangslage: {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    },
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonatszahl: 5 as const,
  lebensmonat: { [Elternteil.Eins]: ANY_MONAT, [Elternteil.Zwei]: ANY_MONAT },
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};
