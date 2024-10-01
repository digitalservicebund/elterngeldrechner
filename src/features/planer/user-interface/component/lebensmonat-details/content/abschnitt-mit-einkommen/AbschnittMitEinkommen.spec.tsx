import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbschnittMitEinkommen } from "./AbschnittMitEinkommen";
import {
  Auswahloptionen,
  Elternteil,
  Variante,
  type Auswahloption,
} from "@/features/planer/domain";

describe("Abschnitt mit Einkommen", () => {
  it('shows the initial question "heading"', () => {
    render(<AbschnittMitEinkommen {...ANY_PROPS} />);

    expect(
      screen.getByText("Sie haben in diesem Monat Einkommen?"),
    ).toBeVisible();
  });

  it("includes a dialog with further information", () => {
    render(<AbschnittMitEinkommen {...ANY_PROPS} />);

    expect(
      screen.getByRole("button", {
        name: "Öffne Informationen zu Einkommen während des Elterngeldbezugs",
      }),
    ).toBeVisible();
  });

  describe("inputs for Bruttoeinkommen", () => {
    it("shows an input for the Bruttoeinkommen for each Elternteil", async () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(),
        [Elternteil.Zwei]: monat(),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };
      render(
        <AbschnittMitEinkommen
          {...ANY_PROPS}
          lebensmonatszahl={5}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      await toggleInputsVisibility();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen von Jane im 5. Lebensmonat",
        }),
      );
      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen von John im 5. Lebensmonat",
        }),
      );
    });

    it("shows and input fo the Bruttoeinkommen for a single Elternteil", async () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(),
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "",
      };
      render(
        <AbschnittMitEinkommen
          {...ANY_PROPS}
          lebensmonatszahl={5}
          lebensmonat={lebensmonat}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
        />,
      );

      await toggleInputsVisibility();

      expect(
        screen.getByRole("textbox", {
          name: "Bruttoeinkommen im 5. Lebensmonat",
        }),
      );
    });
  });

  describe("inputs visibility toggle behavior", () => {
    it.each(Auswahloptionen.filter((option) => option !== Variante.Bonus))(
      "hides initially the inputs when %s is chosen and no Bruttoeinkommen",
      (option) => {
        const lebensmonat = {
          [Elternteil.Eins]: monat(option, undefined),
        };

        render(
          <AbschnittMitEinkommen {...ANY_PROPS} lebensmonat={lebensmonat} />,
        );

        expectInputsNotToBeVisible();
      },
    );

    it("shows the inputs automatically when Bonus is chosen and no Bruttoeinkommen", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus, undefined),
      };

      render(
        <AbschnittMitEinkommen {...ANY_PROPS} lebensmonat={lebensmonat} />,
      );

      expectInputsToBeVisible();
    });

    it.each(Auswahloptionen)(
      "shows the inputs automatically when %s is chosen and some Bruttoeinkommen is was already specified",
      (option) => {
        const lebensmonat = {
          [Elternteil.Eins]: monat(option, 1),
        };

        render(
          <AbschnittMitEinkommen {...ANY_PROPS} lebensmonat={lebensmonat} />,
        );

        expectInputsToBeVisible();
      },
    );

    it("can not manually hide inputs again when automatically opened", async () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus, 1),
      };

      render(
        <AbschnittMitEinkommen {...ANY_PROPS} lebensmonat={lebensmonat} />,
      );

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
    render(<AbschnittMitEinkommen {...ANY_PROPS} />);

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

const ANY_PROPS = {
  lebensmonatszahl: 5 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(undefined),
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
  },
  gebeEinkommenAn: () => {},
};
