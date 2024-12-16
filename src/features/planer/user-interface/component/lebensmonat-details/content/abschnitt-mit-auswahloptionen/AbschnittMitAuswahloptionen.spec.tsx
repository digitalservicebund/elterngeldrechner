import { render, screen } from "@testing-library/react";
import { AbschnittMitAuswahloptionen } from "./AbschnittMitAuswahloptionen";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";
import type { BestimmeAuswahlmoeglichkeitenFuerLebensmonat } from "@/features/planer/user-interface/service/callbackTypes";
import { AusgangslageFuerEinElternteil } from "@/features/planer/domain/ausgangslage";

vi.mock(
  import(
    "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat"
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
      .mockReturnValue(
        ANY_AUSWAHLMOEGLICHKEITEN,
      ) as BestimmeAuswahlmoeglichkeitenFuerLebensmonat<Elternteil>;

    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      bestimmeAuswahlmoeglichkeiten,
    });

    render(<AbschnittMitAuswahloptionen />);

    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledTimes(2);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Eins);
    expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(Elternteil.Zwei);
  });
});

const ANY_GEBURTSDATUM_DES_KINDES = new Date();

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
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
