import { render, screen } from "@testing-library/react";
import { AbschnittMitEinkommen } from "./AbschnittMitEinkommen";
import { Elternteil } from "@/features/planer/domain";

describe("Abschnitt mit Einkommen", () => {
  it('shows the initial question "heading"', () => {
    render(<AbschnittMitEinkommen {...ANY_PROPS} />);

    expect(
      screen.getByText("Sie haben in diesem Monat einkommen?"),
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

  it("shows an input for the Bruttoeinkommen for each Elternteil", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };
    render(
      <AbschnittMitEinkommen
        {...ANY_PROPS}
        lebensmonatszahl={5}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
      />,
    );

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

  it("shows and input fo the Bruttoeinkommen for a single Elternteil", () => {
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

    expect(
      screen.getByRole("textbox", {
        name: "Bruttoeinkommen im 5. Lebensmonat",
      }),
    );
  });

  it("shows an hint for the Wochenstunden", () => {
    render(<AbschnittMitEinkommen {...ANY_PROPS} />);

    expect(
      screen.getByText(
        "*Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche arbeiten",
      ),
    );
  });
});

function monat() {
  return { imMutterschutz: false as const };
}

const ANY_PROPS = {
  lebensmonatszahl: 5 as const,
  lebensmonat: {
    [Elternteil.Eins]: monat(),
    [Elternteil.Zwei]: monat(),
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  gebeEinkommenAn: () => {},
};
