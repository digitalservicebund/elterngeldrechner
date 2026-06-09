import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { KontingentUebersicht } from "./KontingentUebersicht";
import {
  KeinElterngeld,
  Variante,
  bestimmeVerfuegbaresKontingent,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";

describe("KontingentUebersicht", () => {
  beforeEach(async () => {
    vi.spyOn(await import("@/monatsplaner"), "bestimmeVerfuegbaresKontingent");
    vi.spyOn(await import("@/monatsplaner"), "zaehleVerplantesKontingent");
  });

  it("shows a section with label", () => {
    render(<KontingentUebersicht {...ANY_PROPS} />);

    expect(screen.getByLabelText("Kontingentübersicht")).toBeVisible();
  });

  it("shows how much Monate are remaining from the Verfügbaren", () => {
    vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue({
      [Variante.Basis]: 4,
      [Variante.Plus]: 8,
      [Variante.Bonus]: 2,
    });

    vi.mocked(zaehleVerplantesKontingent).mockReturnValue({
      [Variante.Basis]: 2.5,
      [Variante.Plus]: 5,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 3,
    });

    render(<KontingentUebersicht plan={ANY_PLAN} />);

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
    vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue({
      [Variante.Basis]: 4,
      [Variante.Plus]: 8,
      [Variante.Bonus]: 0,
    });

    vi.mocked(zaehleVerplantesKontingent).mockReturnValue({
      [Variante.Basis]: 2.5,
      [Variante.Plus]: 5,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 3,
    });

    render(<KontingentUebersicht plan={ANY_PLAN} />);

    expect(screen.queryByText("Partnerschaftsbonus")).not.toBeInTheDocument();
  });
});

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonate: {},
};

const ANY_PROPS = {
  plan: ANY_PLAN,
};
