import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AbschnittMitPlanungsuebersicht } from "./AbschnittMitPlanungsuebersicht";
import { Elternteil, Variante } from "@/features/planer/user-interface/service";

describe("Abschnitt mit Planungsübersicht", () => {
  it("shows a section for the Planungsübersicht", () => {
    render(<AbschnittMitPlanungsuebersicht {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planungsübersicht"));
  });

  it("shows the Pseudonym and the Gesamtbezug for each Elternteil", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };
    const planungsuebersicht = {
      [Elternteil.Eins]: {
        ...ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
        gesamtbezug: { anzahlMonate: 15, elterngeld: 5019, bruttoeinkommen: 0 },
      },
      [Elternteil.Zwei]: {
        ...ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
        gesamtbezug: { anzahlMonate: 8, elterngeld: 2407, bruttoeinkommen: 0 },
      },
    };

    render(
      <AbschnittMitPlanungsuebersicht
        {...ANY_PROPS}
        planungsuebersicht={planungsuebersicht}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
      />,
    );

    expect(screen.queryByText("Jane")).toBeVisible();
    expect(screen.queryByText("15 Monate Elterngeld"));
    expect(screen.queryByText("5.019 €"));

    expect(screen.queryByText("John")).toBeVisible();
    expect(screen.queryByText("8 Monate Elterngeld"));
    expect(screen.queryByText("2.407 €"));
  });

  it("shows a list with the Zeiträume for each Elternteil in correct order", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    render(
      <AbschnittMitPlanungsuebersicht
        {...ANY_PROPS}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
      />,
    );

    const listJane = screen.getByRole("list", {
      name: "Zeiträume mit Elterngeldbezug von Jane",
    });
    const listJohn = screen.getByRole("list", {
      name: "Zeiträume mit Elterngeldbezug von John",
    });

    expect(listJane).toBeVisible();
    expect(listJohn).toBeVisible();
    expect(listJane.compareDocumentPosition(listJohn)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("shows a list with the Bezügen per Elterngeldvariante for each Elternteil in correct order", () => {
    const pseudonymeDerElternteile = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    render(
      <AbschnittMitPlanungsuebersicht
        {...ANY_PROPS}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
      />,
    );

    const listJane = screen.getByRole("list", {
      name: "Bezüge pro Elterngeldvariante von Jane",
    });
    const listJohn = screen.getByRole("list", {
      name: "Bezüge pro Elterngeldvariante von John",
    });

    expect(listJane).toBeVisible();
    expect(listJohn).toBeVisible();
    expect(listJane.compareDocumentPosition(listJohn)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});

const ANY_BEZUG = { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 };

const ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL = {
  gesamtbezug: ANY_BEZUG,
  zeitraeumeMitDurchgaenigenBezug: [],
  bezuegeProVariante: {
    [Variante.Basis]: ANY_BEZUG,
    [Variante.Plus]: ANY_BEZUG,
    [Variante.Bonus]: ANY_BEZUG,
  },
};

const ANY_PROPS = {
  planungsuebersicht: {
    [Elternteil.Eins]: ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
    [Elternteil.Zwei]: ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
};
