import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListeMitBezuegenProVariante } from "./ListeMitBezuegenProVariante";
import { Variante } from "@/features/planer/domain";

describe("Liste mit Bezügen pro Variante", () => {
  it("shows a list with entries for each Variante", () => {
    render(
      <ListeMitBezuegenProVariante
        {...ANY_PROPS}
        pseudonymDesElternteils="Jane"
      />,
    );

    const list = screen.getByRole("list", {
      name: "Bezüge pro Elterngeldvariante von Jane",
    });

    expect(list).toBeVisible();
    expect(within(list).queryAllByRole("listitem").length).toBe(3);
  });

  it("shows the Anzahl an Monaten and the Elterngeldbezug per Variante", () => {
    const bezuegeProVariante = {
      [Variante.Basis]: {
        anzahlMonate: 1,
        elterngeld: 2,
        bruttoeinkommen: 0,
      },
      [Variante.Plus]: {
        anzahlMonate: 3,
        elterngeld: 4,
        bruttoeinkommen: 0,
      },
      [Variante.Bonus]: {
        anzahlMonate: 5,
        elterngeld: 6,
        bruttoeinkommen: 0,
      },
    };

    render(
      <ListeMitBezuegenProVariante
        {...ANY_PROPS}
        bezuegeProVariante={bezuegeProVariante}
      />,
    );

    expect(screen.queryByText("Basiselterngeld | 1 Monate")).toBeVisible();
    expect(screen.getByText("2 €")?.parentNode).toHaveTextContent(
      "2 € (netto)",
    );

    expect(screen.queryByText("ElterngeldPlus | 3 Monate")).toBeVisible();
    expect(screen.getByText("4 €")?.parentNode).toHaveTextContent(
      "4 € (netto)",
    );

    expect(screen.queryByText("Partnerschaftsbonus | 5 Monate")).toBeVisible();
    expect(screen.getByText("6 €")?.parentNode).toHaveTextContent(
      "6 € (netto)",
    );
  });
});

const ANY_PROPS = {
  bezuegeProVariante: {
    [Variante.Basis]: { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 },
    [Variante.Plus]: { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 },
    [Variante.Bonus]: { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 },
  },
  pseudonymDesElternteils: "Jane",
};
