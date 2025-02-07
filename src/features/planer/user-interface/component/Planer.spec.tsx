import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Planer } from "./Planer";
import { Elternteil, KeinElterngeld, Variante } from "@/features/planer/domain";
import { usePlanerService } from "@/features/planer/user-interface/service";

vi.mock(import("@/features/planer/user-interface/service/usePlanerService"));

describe("Planer", () => {
  beforeEach(() => {
    vi.mocked(usePlanerService).mockReturnValue(ANY_SERVICE_VALUES);
  });

  it("shows a section", () => {
    render(<Planer {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planer Anwendung")).toBeVisible();
  });

  it("shows all relevant sections of the Planer", () => {
    render(<Planer {...ANY_PROPS} />);

    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
    expect(screen.getByLabelText("Kontingentübersicht")).toBeVisible();
    expect(screen.getByLabelText("Gesamtsumme")).toBeVisible();
    expect(screen.getByLabelText("Funktionsleiste")).toBeVisible();
    expect(screen.getByLabelText("Validierungsfehler")).toBeVisible();
  });

  it("forwards the given props to the service", () => {
    const initialInformation = { ausgangslage: ANY_AUSGANGSLAGE };
    const onPlanChanged = () => {};
    const berechneElterngeldbezuege = () => ({}) as never;
    render(
      <Planer
        initialInformation={initialInformation}
        onPlanChanged={onPlanChanged}
        berechneElterngeldbezuege={berechneElterngeldbezuege}
      />,
    );

    expect(usePlanerService).toHaveBeenCalledOnce();
    expect(usePlanerService).toHaveBeenLastCalledWith(
      initialInformation,
      berechneElterngeldbezuege,
      onPlanChanged,
      undefined,
      undefined,
    );
  });

  describe("Planung wiederholen", () => {
    it("calls the callback to reset the Plan", async () => {
      const setzePlanZurueck = vi.fn();
      vi.mocked(usePlanerService).mockReturnValue({
        ...ANY_SERVICE_VALUES,
        setzePlanZurueck,
      });

      render(<Planer {...ANY_PROPS} />);
      await clickPlanungWiederholen();

      expect(setzePlanZurueck).toHaveBeenCalledOnce();
    });

    it("triggers smooth scrolling and shifts focus", async () => {
      const scrollIntoView = vi.fn();
      const focus = vi.fn();
      window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
      window.HTMLElement.prototype.focus = focus;
      render(<Planer {...ANY_PROPS} />);

      await clickPlanungWiederholen();

      expect(scrollIntoView).toHaveBeenCalled();
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
      expect(focus).toHaveBeenCalled();
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    async function clickPlanungWiederholen(): Promise<void> {
      const button = screen.getByRole("button", {
        name: "Planung wiederholen",
      });
      await userEvent.click(button);
    }
  });

  describe("Drucken der Planung", () => {
    it("triggers the browsers in-build print function", async () => {
      window.print = vi.fn();
      render(<Planer {...ANY_PROPS} />);

      const button = screen.getByRole("button", {
        name: "Drucken der Planung",
      });
      await userEvent.click(button);

      expect(window.print).toHaveBeenCalled();
    });
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
  onPlanChanged: () => {},
  berechneElterngeldbezuege: () => ({}) as never,
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
    lebensmonate: {},
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
  setzePlanZurueck: () => {},
};
