import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LebensmonatContent } from "./LebensmonatContent";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat";
import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/monatsplaner";

describe("Lebensmonat Content", () => {
  beforeEach(async () => {
    vi.spyOn(
      await import(
        "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat"
      ),
      "useInformationenZumLebensmonat",
    ).mockReturnValue(ANY_INFORMATION_ZUM_LEBENSMONAT);
  });

  it("shows the Zeitraum of the Lebensmonat", () => {
    render(<LebensmonatContent />);

    expect(screen.getByText("Zeitraum:", { exact: false })).toBeVisible();
  });

  it("shows the Lebensmonatszahl", () => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      lebensmonatszahl: 5,
    });

    render(<LebensmonatContent />);

    expect(screen.getByText("5. Lebensmonat")).toBeVisible();
  });
});

function monat(
  gewaehlteOption: Auswahloption | undefined,
  elterngeldbezug?: number | null,
) {
  return { gewaehlteOption, elterngeldbezug, imMutterschutz: false as const };
}

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
  lebensmonat: {
    [Elternteil.Eins]: monat(undefined),
    [Elternteil.Zwei]: monat(undefined),
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
