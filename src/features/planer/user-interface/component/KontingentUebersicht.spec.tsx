import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { KeinElterngeld, Variante } from "@/features/planer/domain";

describe("KontingentUebersicht", () => {
  it("shows a section with label", () => {
    render(<KontingentUebersicht {...ANY_PROPS} />);

    expect(screen.getByLabelText("Kontingentübersicht")).toBeVisible();
  });

  it("shows how much Monate are remaining from the Verfügbaren", () => {
    const verfuegbaresKontingent = {
      [Variante.Basis]: 4,
      [Variante.Plus]: 8,
      [Variante.Bonus]: 2,
    };
    const verplantesKontingent = {
      [Variante.Basis]: 2.5,
      [Variante.Plus]: 5,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 3,
    };

    render(
      <KontingentUebersicht
        verfuegbaresKontingent={verfuegbaresKontingent}
        verplantesKontingent={verplantesKontingent}
      />,
    );

    expect(screen.queryByText("Basiselterngeld")?.parentNode).toHaveTextContent(
      "Basiselterngeld1 von 4 verfügbar",
    );
    expect(screen.queryByText("ElterngeldPlus")?.parentNode).toHaveTextContent(
      "ElterngeldPlus3 von 8 verfügbar",
    );
    expect(
      screen.queryByText("Partnerschaftsbonus")?.parentNode,
    ).toHaveTextContent("Partnerschaftsbonus2 von 2 verfügbar");
  });

  it("does not show Kontingent for Options which are not available", () => {
    const verfuegbaresKontingent = {
      [Variante.Basis]: 4,
      [Variante.Plus]: 8,
      [Variante.Bonus]: 0,
    };
    const verplantesKontingent = {
      [Variante.Basis]: 2.5,
      [Variante.Plus]: 5,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 3,
    };

    render(
      <KontingentUebersicht
        verfuegbaresKontingent={verfuegbaresKontingent}
        verplantesKontingent={verplantesKontingent}
      />,
    );

    expect(screen.queryByText("Partnerschaftsbonus")).not.toBeInTheDocument();
  });
});

const ANY_PROPS = {
  verfuegbaresKontingent: {
    [Variante.Basis]: 0,
    [Variante.Plus]: 0,
    [Variante.Bonus]: 0,
  },
  verplantesKontingent: {
    [Variante.Basis]: 0,
    [Variante.Plus]: 0,
    [Variante.Bonus]: 0,
    [KeinElterngeld]: 0,
  },
};
