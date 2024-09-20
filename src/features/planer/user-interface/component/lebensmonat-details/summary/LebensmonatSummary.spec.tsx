import { render, within } from "@testing-library/react";
import { LebensmonatSummary } from "./LebensmonatSummary";
import {
  Elternteil,
  KeinElterngeld,
  MONAT_MIT_MUTTERSCHUTZ,
  Variante,
  type Auswahloption,
  type Lebensmonat,
} from "@/features/planer/user-interface/service";

describe("Lebensmonat Summary", () => {
  it("shows visual indicators in the summary for the choices of the Elternteile", () => {
    const lebensmonat = {
      [Elternteil.Eins]: monat(Variante.Basis, 10),
      [Elternteil.Zwei]: monat(Variante.Plus, 20),
    };

    render(<LebensmonatSummary {...ANY_PROPS} lebensmonat={lebensmonat} />);

    const summary = document.querySelector("summary")!;
    expect(within(summary).queryByText("Basis")).toBeVisible();
    expect(within(summary).queryByText("10 €")).toBeVisible();
    expect(within(summary).queryByText("Plus")).toBeVisible();
    expect(within(summary).queryByText("20 €")).toBeVisible();
  });

  describe("description", () => {
    it("has a short discription if no Elternteil made a choice yet", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };

      render(<LebensmonatSummary {...ANY_PROPS} lebensmonat={lebensmonat} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Noch keine Auswahl getätigt./,
      );
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if one Elternteil made a choice", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(Variante.Plus, 900),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <LebensmonatSummary
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane hat noch keine Auswahl getroffen. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if both made a choice", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(KeinElterngeld, null),
        [Elternteil.Zwei]: monat(Variante.Plus, 900),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      render(
        <LebensmonatSummary
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane bezieht kein Elterngeld\. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("describes if an Elternteil is im Mutterschutz", () => {
      const lebensmonat: Lebensmonat<Elternteil.Eins> = {
        [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
      };

      render(
        <LebensmonatSummary
          {...ANY_PROPS}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane ist im Mutterschutz\./,
      );
    });
  });
});

function monat(
  gewaehlteOption: Auswahloption | undefined,
  elterngeldbezug?: number | null,
) {
  return { gewaehlteOption, elterngeldbezug, imMutterschutz: false as const };
}

const ANY_PROPS = {
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(undefined),
    [Elternteil.Zwei]: monat(undefined),
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  identifierForDetailsAriaLabel: "",
  zeitraumIdentifierForAriaDescription: "",
  gridLayout: {
    templateClassName: "",
    areaClassNames: {
      lebensmonatszahl: "",
      [Elternteil.Eins]: {
        elterngeldbezug: "",
        gewaehlteOption: "",
      },
      [Elternteil.Zwei]: {
        elterngeldbezug: "",
        gewaehlteOption: "",
      },
    },
  },
};
