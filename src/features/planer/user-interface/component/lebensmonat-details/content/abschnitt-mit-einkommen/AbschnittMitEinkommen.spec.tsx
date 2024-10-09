import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbschnittMitEinkommen } from "./AbschnittMitEinkommen";
import {
  Auswahloptionen,
  Elternteil,
  KeinElterngeld,
  MONAT_MIT_MUTTERSCHUTZ,
  Variante,
  type Auswahloption,
} from "@/features/planer/domain";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";

vi.mock(
  import(
    "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat"
  ),
);

describe("Abschnitt mit Einkommen", () => {
  beforeEach(() => {
    vi.mocked(useInformationenZumLebensmonat).mockReturnValue(
      ANY_INFORMATION_ZUM_LEBENSMONAT,
    );
  });

  it('shows the initial question "heading"', () => {
    render(<AbschnittMitEinkommen />);

    expect(
      screen.getByText("Sie haben in diesem Monat Einkommen?"),
    ).toBeVisible();
  });

  it("includes a dialog with further information", () => {
    render(<AbschnittMitEinkommen />);

    expect(
      screen.getByRole("button", {
        name: "Öffne Informationen zu Einkommen während des Elterngeldbezugs",
      }),
    ).toBeVisible();
  });

  describe("inputs for Bruttoeinkommen", () => {
    it("shows an input for the Bruttoeinkommen for each Elternteil", async () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonatszahl: 5,
        lebensmonat: {
          [Elternteil.Eins]: monat(),
          [Elternteil.Zwei]: monat(),
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
      });

      render(<AbschnittMitEinkommen />);
      await toggleInputsVisibility();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen von Jane im 5. Lebensmonat",
        }),
      ).toBeVisible();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen von John im 5. Lebensmonat",
        }),
      ).toBeVisible();
    });

    it("shows some text instead of input for Elternteil with Monat im Mutterschutz", async () => {
      vi.mocked(useInformationenZumLebensmonat).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonatszahl: 5,
        lebensmonat: {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: monat(),
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
      });

      render(<AbschnittMitEinkommen />);
      await toggleInputsVisibility();

      expect(
        screen.queryByRole("textbox", {
          name: "Bruttoeinkommen von Jane im 5. Lebensmonat",
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.getByText(
          "Nach der Geburt haben Mütter in der Regel Anspruch auf acht Wochen Mutterschutz. Während dieser Zeit dürfen sie nicht arbeiten. Sie können in dieser Zeit kein Einkommen angeben.",
        ),
      ).toBeVisible();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen von John im 5. Lebensmonat",
        }),
      );
    });

    it("shows and input fo the Bruttoeinkommen for a single Elternteil", async () => {
      vi.mocked(
        useInformationenZumLebensmonat<Elternteil.Eins>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonatszahl: 5,
        lebensmonat: { [Elternteil.Eins]: monat() },
        pseudonymeDerElternteile: { [Elternteil.Eins]: "" },
      });

      render(<AbschnittMitEinkommen />);
      await toggleInputsVisibility();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen im 5. Lebensmonat",
        }),
      ).toBeVisible();
    });
  });

  describe("inputs visibility toggle behavior", () => {
    it.each(Auswahloptionen.filter((option) => option !== Variante.Bonus))(
      "hides initially the inputs when %s is chosen and no Bruttoeinkommen",
      (option) => {
        vi.mocked(
          useInformationenZumLebensmonat<Elternteil.Eins>,
        ).mockReturnValue({
          ...ANY_INFORMATION_ZUM_LEBENSMONAT,
          lebensmonat: { [Elternteil.Eins]: monat(option, undefined) },
        });

        render(<AbschnittMitEinkommen />);

        expectInputsNotToBeVisible();
      },
    );

    it("shows the inputs automatically when Bonus is chosen and no Bruttoeinkommen", () => {
      vi.mocked(
        useInformationenZumLebensmonat<Elternteil.Eins>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: { [Elternteil.Eins]: monat(Variante.Bonus, undefined) },
      });

      render(<AbschnittMitEinkommen />);

      expectInputsToBeVisible();
    });

    it.each(Auswahloptionen)(
      "shows the inputs automatically when %s is chosen and some Bruttoeinkommen is was already specified",
      (option) => {
        vi.mocked(
          useInformationenZumLebensmonat<Elternteil.Eins>,
        ).mockReturnValue({
          ...ANY_INFORMATION_ZUM_LEBENSMONAT,
          lebensmonat: { [Elternteil.Eins]: monat(option, 1) },
        });

        render(<AbschnittMitEinkommen />);

        expectInputsToBeVisible();
      },
    );

    it("can not manually hide inputs again when automatically opened", async () => {
      vi.mocked(
        useInformationenZumLebensmonat<Elternteil.Eins>,
      ).mockReturnValue({
        ...ANY_INFORMATION_ZUM_LEBENSMONAT,
        lebensmonat: { [Elternteil.Eins]: monat(Variante.Bonus, 1) },
      });

      render(<AbschnittMitEinkommen />);

      expectInputsToBeVisible();
      await toggleInputsVisibility();
      expectInputsToBeVisible();
    });

    function expectInputsToBeVisible() {
      const inputs = screen.getAllByRole("textbox", {
        name: /Bruttoeinkommen/,
      });

      inputs.forEach((input) => expect(input).toBeVisible());
    }

    function expectInputsNotToBeVisible() {
      const inputs = screen.queryAllByRole("textbox", {
        name: /Bruttoeinkommen/,
      });
      inputs.forEach((input) => expect(input).not.toBeVisible());
    }
  });

  it("shows an hint for the Wochenstunden when inputs are visible", async () => {
    render(<AbschnittMitEinkommen />);

    await toggleInputsVisibility();

    expect(
      screen.getByText(
        "*Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche arbeiten",
      ),
    );
  });

  async function toggleInputsVisibility(): Promise<void> {
    const toggle = screen.getByRole("button", {
      name: "Bruttoeinkommen hinzufügen",
    });
    await userEvent.click(toggle);
  }
});

function monat(gewaehlteOption?: Auswahloption, bruttoeinkommen?: number) {
  return { gewaehlteOption, bruttoeinkommen, imMutterschutz: false as const };
}

const ANY_INFORMATION_ZUM_LEBENSMONAT = {
  lebensmonatszahl: 5 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(),
    [Elternteil.Zwei]: monat(),
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
