import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Planer } from "./Planer";

import { usePlanerService } from "@/application/features/planer/hooks";
import {
  Elternteil,
  KeinElterngeld,
  Lebensmonatszahl,
  Result,
  Variante,
  berechneGesamtsumme,
} from "@/monatsplaner";

describe("Planer", () => {
  beforeEach(async () => {
    vi.spyOn(
      await import("@/application/features/planer/hooks"),
      "usePlanerService",
    ).mockReturnValue(ANY_SERVICE_VALUES);

    vi.mock(import("@/monatsplaner"), async (importOriginal) => {
      const originalMonatsplaner = await importOriginal();

      return {
        ...originalMonatsplaner,
        berechneGesamtsumme: vi.fn(),
      };
    });

    await vi.hoisted(async () => {});

    vi.mocked(berechneGesamtsumme).mockReturnValue({
      elterngeldbezug: 7041,
      proElternteil: {
        [Elternteil.Eins]: {
          anzahlMonateMitBezug: 0,
          elterngeldbezug: 0,
          bruttoeinkommen: 0,
        },
        [Elternteil.Zwei]: {
          anzahlMonateMitBezug: 0,
          elterngeldbezug: 0,
          bruttoeinkommen: 0,
        },
      },
    });
  });

  it("shows all relevant sections of the Planer", () => {
    render(<Planer {...ANY_PROPS} />);

    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
    expect(screen.getByLabelText("Kontingentübersicht")).toBeVisible();
    expect(screen.getByLabelText("Prüfbuttonbox")).toBeVisible();
  });

  it("forwards the given props to the service", () => {
    const initialInformation = { ausgangslage: ANY_AUSGANGSLAGE };

    const onChange = () => {};
    const berechneElterngeldbezuege = () => ({}) as never;
    const planInAntragUebernehmen = () => ({}) as never;

    render(
      <Planer
        initialInformation={initialInformation}
        berechneElterngeldbezuege={berechneElterngeldbezuege}
        planInAntragUebernehmen={planInAntragUebernehmen}
        callbacks={{ onChange }}
      />,
    );

    expect(usePlanerService).toHaveBeenCalledOnce();
    expect(usePlanerService).toHaveBeenLastCalledWith(
      initialInformation,
      berechneElterngeldbezuege,
      expect.objectContaining({
        onChange,
      }),
    );
  });
});

const ANY_AUSGANGSLAGE = {
  anzahlElternteile: 2 as const,
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  geburtsdatumDesKindes: new Date(),
};

const ANY_PROPS = {
  initialInformation: { ausgangslage: ANY_AUSGANGSLAGE },
  berechneElterngeldbezuege: () => ({}) as never,
  planInAntragUebernehmen: () => ({}) as never,
  callbacks: {},
};

const ANY_SERVICE_VALUES = {
  plan: {
    ausgangslage: {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate: {
      1: {
        [Elternteil.Eins]: {
          gewaehlteOption: "Basiselterngeld" as Variante,
          imMutterschutz: false as const,
        },
        [Elternteil.Zwei]: {
          imMutterschutz: false as const,
        },
      },
    },
  },
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
  gesamtsumme: {
    elterngeldbezug: 0,
    proElternteil: {
      [Elternteil.Eins]: {
        anzahlMonateMitBezug: 0,
        elterngeldbezug: 0,
        bruttoeinkommen: 0,
      },
      [Elternteil.Zwei]: {
        anzahlMonateMitBezug: 0,
        elterngeldbezug: 0,
        bruttoeinkommen: 0,
      },
    },
  },
  validierungsfehler: [],
  erstelleUngeplantenLebensmonat: () => ({
    [Elternteil.Eins]: { imMutterschutz: false as const },
    [Elternteil.Zwei]: { imMutterschutz: false as const },
  }),
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [Variante.Plus]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [Variante.Bonus]: { elterngeldbezug: 0, istAuswaehlbar: true as const },
    [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
  }),
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
  ergaenzeBruttoeinkommenFuerPartnerschaftsbonus: () => {},
  setzePlanZurueck: () => {},
  ueberschreibePlan: () => {},
  ueberpruefePlanung: () => {
    return Result.ok(undefined);
  },
  schalteBonusFrei: () => {
    return 1 as Lebensmonatszahl;
  },
};
