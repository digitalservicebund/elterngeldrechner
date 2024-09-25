import { render, screen } from "@testing-library/react";
import { LebensmonatContent } from "./LebensmonatContent";
import { HinweisZumBonus } from "./HinweisZumBonus";
import type { BestimmeAuswahlmoeglichkeitenFuerLebensmonat } from "@/features/planer/user-interface/service/callbackTypes";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
  type Auswahloption,
  type Lebensmonat,
} from "@/features/planer/user-interface/service";

describe("Lebensmonat Content", () => {
  it("shows the Zeitraum of the Lebensmonat", () => {
    render(<LebensmonatContent {...ANY_PROPS} />);

    expect(screen.getByText("Zeitraum:", { exact: false })).toBeVisible();
  });

  it("shows the Lebensmonatszahl", () => {
    render(<LebensmonatContent {...ANY_PROPS} lebensmonatszahl={5} />);

    expect(screen.getByText("5. Lebensmonat")).toBeVisible();
  });

  describe("auswahl", () => {
    it("shows an input fieldset to choose an Option for each Elternteil", () => {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <LebensmonatContent
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
        [Elternteil.Eins]: monat(undefined),
      };

      render(
        <LebensmonatContent
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
        <LebensmonatContent
          {...ANY_PROPS}
          bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        />,
      );

      expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledTimes(2);
      expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(
        Elternteil.Eins,
      );
      expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(
        Elternteil.Zwei,
      );
    });
  });

  describe("hint for Bonus", () => {
    it("shows the hint when Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };
      render(<LebensmonatContent {...ANY_PROPS} lebensmonat={lebensmonat} />);

      expect(screen.queryByText("Test Bonus Hinweis Text")).toBeInTheDocument();
    });

    it("hides the hint when no Bonus is chosen", () => {
      vi.mocked(HinweisZumBonus).mockReturnValue("Test Bonus Hinweis Text");
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };
      render(<LebensmonatContent {...ANY_PROPS} lebensmonat={lebensmonat} />);

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
  zeitraum: { from: new Date(), to: new Date() },
  zeitraumLabelIdentifier: "",
  gridLayout: {
    templateClassName: "",
    areaClassNames: {
      description: "",
      hinweisZumBonus: "",
      [Elternteil.Eins]: {
        auswahl: {
          fieldset: "",
          info: "",
          input: "",
        },
      },
      [Elternteil.Zwei]: {
        auswahl: {
          fieldset: "",
          info: "",
          input: "",
        },
      },
    },
  },
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};

vi.mock("./HinweisZumBonus");
