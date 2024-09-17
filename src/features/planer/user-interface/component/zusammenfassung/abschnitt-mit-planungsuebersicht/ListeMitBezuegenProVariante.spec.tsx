import { render, screen, within } from "@testing-library/react";
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

  it("shows the Anzahl an Monaten and the total Elterngeldbezug per Variante", () => {
    const bezuegeProVariante = {
      [Variante.Basis]: { anzahlMonate: 1, totalerElterngeldbezug: 2 },
      [Variante.Plus]: { anzahlMonate: 3, totalerElterngeldbezug: 4 },
      [Variante.Bonus]: { anzahlMonate: 5, totalerElterngeldbezug: 6 },
    };

    render(
      <ListeMitBezuegenProVariante
        {...ANY_PROPS}
        bezuegeProVariante={bezuegeProVariante}
      />,
    );

    expect(screen.queryByText("Basiselterngeld | 1 Monate")).toBeVisible();
    expect(screen.queryByText("2 €")).toBeVisible();

    expect(screen.queryByText("ElterngeldPlus | 3 Monate")).toBeVisible();
    expect(screen.queryByText("4 €")).toBeVisible();

    expect(screen.queryByText("Partnerschaftsbonus | 5 Monate")).toBeVisible();
    expect(screen.queryByText("6 €")).toBeVisible();
  });
});

const ANY_PROPS = {
  bezuegeProVariante: {
    [Variante.Basis]: { anzahlMonate: 0, totalerElterngeldbezug: 0 },
    [Variante.Plus]: { anzahlMonate: 0, totalerElterngeldbezug: 0 },
    [Variante.Bonus]: { anzahlMonate: 0, totalerElterngeldbezug: 0 },
  },
  pseudonymDesElternteils: "Jane",
};
