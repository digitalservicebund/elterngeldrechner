import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { KontingentUebersicht } from "./KontingentUebersicht";
import {
  KeinElterngeld,
  Variante,
  bestimmeVerfuegbaresKontingent,
} from "@/monatsplaner";
import * as zaehleVerplantesKontingentModule from "@/monatsplaner/lebensmonate/operation/zaehleVerplantesKontingent";

describe("KontingentUebersicht", () => {
  beforeEach(() => {
    vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
      ANY_VERFUEGBARES_KONTINGENT,
    );
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

    vi.spyOn(
      zaehleVerplantesKontingentModule,
      "zaehleVerplantesKontingent",
    ).mockReturnValue({
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

    vi.spyOn(
      zaehleVerplantesKontingentModule,
      "zaehleVerplantesKontingent",
    ).mockReturnValue({
      [Variante.Basis]: 2.5,
      [Variante.Plus]: 5,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 3,
    });

    render(<KontingentUebersicht plan={ANY_PLAN} />);

    expect(screen.queryByText("Partnerschaftsbonus")).not.toBeInTheDocument();
  });
});

vi.mock(
  import(
    "@/monatsplaner/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
  ),
);

const ANY_VERFUEGBARES_KONTINGENT = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
};

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
