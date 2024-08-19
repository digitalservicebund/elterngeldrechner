import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Planer } from "./Planer";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("Planer", () => {
  describe("Planung wiederholen", () => {
    it("calls the callback to reset the Plan", async () => {
      const setzePlanZurueck = vi.fn();
      render(<Planer {...ANY_PROPS} setzePlanZurueck={setzePlanZurueck} />);

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
});

const ANY_PROPS = {
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
  },
  lebensmonate: {},
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
  erstelleUngeplantenLebensmonat: () => ({
    [Elternteil.Eins]: { imMutterschutz: false as const },
  }),
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 0, isDisabled: false as const },
    [Variante.Plus]: { elterngeldbezug: 0, isDisabled: false as const },
    [Variante.Bonus]: { elterngeldbezug: 0, isDisabled: false as const },
    [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
  }),
  waehleOption: () => {},
  setzePlanZurueck: () => {},
};
