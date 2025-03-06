import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AbschnittMitPlanungsuebersicht } from "./AbschnittMitPlanungsuebersicht";
import { erstellePlanungsuebersicht } from "./erstellePlanungsuebersicht";
import { Elternteil, Variante } from "@/monatsplaner";

vi.mock(import("./erstellePlanungsuebersicht"));

describe("Abschnitt mit Planungsübersicht", () => {
  beforeEach(() => {
    vi.mocked(erstellePlanungsuebersicht).mockReturnValue(
      ANY_PLANUNGSUEBERSICHT,
    );
  });

  it("shows a section for the Planungsübersicht", () => {
    render(<AbschnittMitPlanungsuebersicht {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planungsübersicht"));
  });

  it("shows the Pseudonym and the Gesamtbezug for each Elternteil", () => {
    vi.mocked(erstellePlanungsuebersicht).mockReturnValue({
      [Elternteil.Eins]: {
        ...ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
        gesamtbezug: { anzahlMonate: 15, elterngeld: 5019, bruttoeinkommen: 0 },
      },
      [Elternteil.Zwei]: {
        ...ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
        gesamtbezug: { anzahlMonate: 8, elterngeld: 2407, bruttoeinkommen: 0 },
      },
    });

    const plan = { ...ANY_PLAN, ausgangslage: ausgangslage("Jane", "John") };

    render(<AbschnittMitPlanungsuebersicht {...ANY_PROPS} plan={plan} />);

    expect(screen.queryByText("Jane")).toBeVisible();
    expect(screen.queryByText("15 Monate Elterngeld"));
    expect(screen.queryByText("5.019 €"));

    expect(screen.queryByText("John")).toBeVisible();
    expect(screen.queryByText("8 Monate Elterngeld"));
    expect(screen.queryByText("2.407 €"));
  });

  it("shows a list with the Zeiträume for each Elternteil in correct order", () => {
    const plan = { ...ANY_PLAN, ausgangslage: ausgangslage("Jane", "John") };

    render(<AbschnittMitPlanungsuebersicht {...ANY_PROPS} plan={plan} />);

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
    const plan = { ...ANY_PLAN, ausgangslage: ausgangslage("Jane", "John") };

    render(<AbschnittMitPlanungsuebersicht {...ANY_PROPS} plan={plan} />);

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

function ausgangslage(pseudonymEins: string, pseudonymZwei: string) {
  return {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: pseudonymEins,
      [Elternteil.Zwei]: pseudonymZwei,
    },
    geburtsdatumDesKindes: new Date(),
  };
}

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

const ANY_PLANUNGSUEBERSICHT = {
  [Elternteil.Eins]: ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
  [Elternteil.Zwei]: ANY_PLANUNGSUEBERSICHT_FUER_ELTERNTEIL,
};

const ANY_PLAN = {
  ausgangslage: ausgangslage("Jane", "John"),
  lebensmonate: {},
};

const ANY_PROPS = {
  plan: ANY_PLAN,
};
