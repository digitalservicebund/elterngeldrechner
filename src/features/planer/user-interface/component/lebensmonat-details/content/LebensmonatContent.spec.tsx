import { render, screen } from "@testing-library/react";
import { HinweisZumBonus } from "./HinweisZumBonus";
import { LebensmonatContent } from "./LebensmonatContent";
import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/domain";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";

vi.mock(import("./HinweisZumBonus"));
vi.mock(
  import(
    "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat"
  ),
);

describe("Lebensmonat Content", () => {
  beforeEach(() => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue(
      ANY_INFORMATION_ZUM_LEBENSMONAT,
    );
  });

  it("shows the Zeitraum of the Lebensmonat", () => {
    render(<LebensmonatContent {...ANY_PROPS} />);

    expect(screen.getByText("Zeitraum:", { exact: false })).toBeVisible();
  });

  it("shows the Lebensmonatszahl", () => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
      ...ANY_INFORMATION_ZUM_LEBENSMONAT,
      lebensmonatszahl: 5,
    });

    render(<LebensmonatContent {...ANY_PROPS} />);

    expect(screen.getByText("5. Lebensmonat")).toBeVisible();
  });

  describe("hint for Bonus", () => {
    it("shows the hint when Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      });

      render(<LebensmonatContent {...ANY_PROPS} />);

      expect(screen.queryByText("Test Bonus Hinweis Text")).toBeInTheDocument();
    });

    it("hides the hint when no Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      });

      render(<LebensmonatContent {...ANY_PROPS} />);

      expect(
        screen.queryByText("Test Bonus Hinweis Text"),
      ).not.toBeInTheDocument();
    });
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
    [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
    [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
  }),
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};

const ANY_PROPS = {
  zeitraumLabelIdentifier: "",
};
