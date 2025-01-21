import { render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LebensmonatSummary } from "./LebensmonatSummary";
import {
  beschreibePlanungImLebensmonat,
  beschreibeZeitraumDesLebensmonats,
} from "./beschreibeLebensmonat";
import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/domain";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";

vi.mock(
  import(
    "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat"
  ),
);

vi.mock(import("./beschreibeLebensmonat"));

describe("Lebensmonat Summary", () => {
  beforeEach(() => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue(
      ANY_INFORMATION_ZUM_LEBENSMONAT,
    );
  });

  it("shows visual indicators in the summary for the choices of the Elternteile", () => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      lebensmonat: {
        [Elternteil.Eins]: monat(Variante.Basis, 10, 11),
        [Elternteil.Zwei]: monat(Variante.Plus, 20, 21),
      },
    });

    render(<LebensmonatSummary />);

    const summary = document.querySelector("summary")!;
    expect(within(summary).queryByText("Basis")).toBeVisible();
    expect(within(summary).queryByText("10 €")).toBeVisible();
    expect(within(summary).queryByText("11 €")).toBeVisible();
    expect(within(summary).queryByText("Plus")).toBeVisible();
    expect(within(summary).queryByText("20 €")).toBeVisible();
    expect(within(summary).queryByText("21 €")).toBeVisible();
  });

  it("uses the computed Beschreibungen of the Lebensmonat as accessibility description", () => {
    vi.mocked(beschreibePlanungImLebensmonat).mockReturnValue(
      "Ausführliche Beschreibung des Lebensmonats.",
    );
    vi.mocked(beschreibeZeitraumDesLebensmonats).mockReturnValue(
      "Von Datum A bis zum Datum B.",
    );

    render(<LebensmonatSummary />);

    expect(document.querySelector("summary")).toHaveAccessibleDescription(
      "Ausführliche Beschreibung des Lebensmonats. Von Datum A bis zum Datum B.",
    );
  });
});

function monat(
  gewaehlteOption: Auswahloption | undefined,
  elterngeldbezug?: number | null,
  bruttoeinkommen?: number | null,
) {
  return {
    gewaehlteOption,
    elterngeldbezug,
    bruttoeinkommen,
    imMutterschutz: false as const,
  };
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
    [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
    [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
  }),
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};
