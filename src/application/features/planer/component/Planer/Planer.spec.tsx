import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Planer } from "./Planer";
import { usePlanerService } from "@/application/features/planer/hooks";
import { Elternteil, KeinElterngeld, Result, Variante } from "@/monatsplaner";

describe("Planer", () => {
  beforeEach(async () => {
    vi.spyOn(
      await import("@/application/features/planer/hooks"),
      "usePlanerService",
    ).mockReturnValue(ANY_SERVICE_VALUES);
  });

  it("shows a section", () => {
    render(<Planer {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planer Anwendung")).toBeVisible();
  });

  it("shows all relevant sections of the Planer", () => {
    render(<Planer {...ANY_PROPS} />);

    expect(
      screen.getByLabelText(
        "Nutzen Sie ein Beispiel oder machen Sie Ihre eigene Planung:",
      ),
    ).toBeVisible();
    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
    expect(screen.getByLabelText("Kontingentübersicht")).toBeVisible();
    expect(screen.getByLabelText("Prüfbuttonbox")).toBeVisible();
  });

  it("forwards the given props to the service", () => {
    const initialInformation = { ausgangslage: ANY_AUSGANGSLAGE };
    const onChange = () => {};
    const onOpenErklaerung = () => {};
    const berechneElterngeldbezuege = () => ({}) as never;
    const planInAntragUebernehmen = () => ({}) as never;
    render(
      <Planer
        initialInformation={initialInformation}
        berechneElterngeldbezuege={berechneElterngeldbezuege}
        planInAntragUebernehmen={planInAntragUebernehmen}
        callbacks={{ onChange, onOpenErklaerung }}
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

  describe("neue leere Planung erstellen", () => {
    it("calls the callback to reset the Plan", async () => {
      const setzePlanZurueck = vi.fn();
      vi.mocked(usePlanerService).mockReturnValue({
        ...ANY_SERVICE_VALUES,
        setzePlanZurueck,
      });

      render(<Planer {...ANY_PROPS} />);
      await clickNeueLeerePlanungErstellen();

      expect(setzePlanZurueck).toHaveBeenCalledOnce();
    });

    it.skip("shifts focus", async () => {
      const focus = vi.fn();
      // TypeError: Cannot set property focus of #<HTMLElement> which has only a getter
      window.HTMLElement.prototype.focus = focus;
      render(<Planer {...ANY_PROPS} />);

      await clickNeueLeerePlanungErstellen();

      expect(focus).toHaveBeenCalled();
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    async function clickNeueLeerePlanungErstellen(): Promise<void> {
      const button = screen.getByRole("button", {
        name: "Neue leere Planung erstellen",
      });
      await userEvent.click(button);
    }
  });

  // describe("Drucken der Planung", () => {
  //   it("triggers the browsers in-build print function", async () => {
  //     window.print = vi.fn();
  //     render(<Planer {...ANY_PROPS} />);

  //     const button = screen.getByRole("button", {
  //       name: "Drucken der Planung",
  //     });
  //     await userEvent.click(button);

  //     expect(window.print).toHaveBeenCalled();
  //   });
  // });
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
  callbacks: { onOpenErklaerung: () => {} },
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
  schalteBonusFrei: () => {},
};
