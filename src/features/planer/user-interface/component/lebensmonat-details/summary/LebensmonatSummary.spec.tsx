import { render, within } from "@testing-library/react";
import { LebensmonatSummary } from "./LebensmonatSummary";
import {
  Elternteil,
  KeinElterngeld,
  MONAT_MIT_MUTTERSCHUTZ,
  Variante,
  type Auswahloption,
} from "@/features/planer/user-interface/service";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";

vi.mock(
  import(
    "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat"
  ),
);

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

    render(<LebensmonatSummary {...ANY_PROPS} />);

    const summary = document.querySelector("summary")!;
    expect(within(summary).queryByText("Basis")).toBeVisible();
    expect(within(summary).queryByText("10 €")).toBeVisible();
    expect(within(summary).queryByText("11 €")).toBeVisible();
    expect(within(summary).queryByText("Plus")).toBeVisible();
    expect(within(summary).queryByText("20 €")).toBeVisible();
    expect(within(summary).queryByText("21 €")).toBeVisible();
  });

  describe("description", () => {
    it("has a short discription if no Elternteil made a choice yet", () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Noch keine Auswahl getroffen./,
      );
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if one Elternteil made a choice", () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(Variante.Plus, 900),
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane hat noch keine Auswahl getroffen. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("lists the Elternteile with their Pseudonym, chosen Option and elterngeldbezug if both made a choice", () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: monat(KeinElterngeld, null),
          [Elternteil.Zwei]: monat(Variante.Plus, 900),
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane bezieht kein Elterngeld\. John bezieht ElterngeldPlus und erhält 900\u00A0€\./,
      );
    });

    it("describes only a single Elternteil in direct manner without Pseudonym", () => {
      vi.mocked(
        useInformationenZumLebensmonat<Elternteil.Eins>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: { [Elternteil.Eins]: monat(Variante.Basis, 800) },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Sie beziehen Basiselterngeld und erhalten 800\u00A0€\./,
      );
    });

    it("describes if an Elternteil is im Mutterschutz with respective Pseudonym", () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: monat(Variante.Plus, 900),
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Jane ist im Mutterschutz\./,
      );
    });

    it("describes if a single Elternteil is im Mutterschutz in direct manner without Pseudonym", () => {
      vi.mocked(
        useInformationenZumLebensmonat<Elternteil.Eins>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: { [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ },
      });

      render(<LebensmonatSummary {...ANY_PROPS} />);

      expect(document.querySelector("summary")).toHaveAccessibleDescription(
        /^Sie sind im Mutterschutz\./,
      );
    });
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
  lebensmonatszahl: 5 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(undefined),
    [Elternteil.Zwei]: monat(undefined),
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  geburtsdatumDesKindes: new Date(),
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
    [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
    [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
  }),
  waehleOption: () => {},
  gebeEinkommenAn: () => {},
};

const ANY_PROPS = {
  identifierToZeitraumLabel: "",
};
