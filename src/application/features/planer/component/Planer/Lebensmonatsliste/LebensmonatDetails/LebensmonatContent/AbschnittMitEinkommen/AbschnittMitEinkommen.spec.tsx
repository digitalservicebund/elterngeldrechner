import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AbschnittMitEinkommen } from "./AbschnittMitEinkommen";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat";
import {
  AusgangslageFuerEinElternteil,
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  MONAT_MIT_MUTTERSCHUTZ,
  Variante,
} from "@/monatsplaner";

describe("Abschnitt mit Einkommen", () => {
  beforeEach(async () => {
    vi.spyOn(
      await import(
        "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat"
      ),
      "useInformationenZumLebensmonat",
    ).mockReturnValue(ANY_INFORMATION_ZUM_LEBENSMONAT);
  });

  it('shows the initial question "heading"', () => {
    render(<AbschnittMitEinkommen />);

    expect(
      screen.getByText(
        "Haben Sie neben dem Elterngeld noch andere Einnahmen in diesem Monat?",
      ),
    ).toBeVisible();
  });

  describe("inputs for Bruttoeinkommen", () => {
    it("shows an input for the Bruttoeinkommen for each Elternteil", () => {
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
        lebensmonatszahl: 5,
        lebensmonat: {
          [Elternteil.Eins]: monat(),
          [Elternteil.Zwei]: monat(),
        },
      });

      render(<AbschnittMitEinkommen />);

      expect(
        screen.getByRole("combobox", {
          name: "Bruttoeinkommen von Jane im 5. Lebensmonat",
        }),
      ).toBeVisible();

      expect(
        screen.getByRole("combobox", {
          name: "Bruttoeinkommen von John im 5. Lebensmonat",
        }),
      ).toBeVisible();
    });

    it("shows some text instead of input for Elternteil with Monat im Mutterschutz", () => {
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
        lebensmonatszahl: 5,
        lebensmonat: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: monat(),
        },
      });

      render(<AbschnittMitEinkommen />);

      expect(
        screen.queryByRole("combobox", {
          name: "Bruttoeinkommen von Jane im 5. Lebensmonat",
        }),
      ).toBeDisabled();

      expect(
        screen.getByText("Arbeiten im Mutterschutz ist nicht erlaubt"),
      ).toBeVisible();

      expect(
        screen.getByRole("combobox", {
          name: "Bruttoeinkommen von John im 5. Lebensmonat",
        }),
      );
    });

    it("shows and input fo the Bruttoeinkommen for a single Elternteil", () => {
      vi.mocked(
        useInformationenZumLebensmonat<AusgangslageFuerEinElternteil>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        ausgangslage: {
          anzahlElternteile: 1 as const,
          geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
        },
        lebensmonatszahl: 5,
        lebensmonat: { [Elternteil.Eins]: monat() },
      });

      render(<AbschnittMitEinkommen />);

      expect(
        screen.getByRole("combobox", {
          name: "Bruttoeinkommen im 5. Lebensmonat",
        }),
      ).toBeVisible();
    });

    it("uses the provided callback to determine the Vorschläge for the Einkommen per Elternteil", () => {
      const erstelleVorschlaegeFuerAngabeDesEinkommens = vi.fn(() => []);
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        erstelleVorschlaegeFuerAngabeDesEinkommens,
      });

      render(<AbschnittMitEinkommen />);

      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledTimes(
        2,
      );
      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledWith(
        Elternteil.Eins,
      );
      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledWith(
        Elternteil.Zwei,
      );
    });
  });
});

function monat(gewaehlteOption?: Auswahloption, bruttoeinkommen?: number) {
  return { gewaehlteOption, bruttoeinkommen, imMutterschutz: false as const };
}

const ANY_GEBURTSDATUM_DES_KINDES = new Date();

const ANY_INFORMATION_ZUM_LEBENSMONAT = {
  ausgangslage: {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    },
    geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
  },
  lebensmonatszahl: 5 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(),
    [Elternteil.Zwei]: monat(),
  },
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
    [Variante.Plus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
    [Variante.Bonus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
    [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
  }),
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
  ergaenzeBruttoeinkommenFuerPartnerschaftsbonus: () => {},
};
