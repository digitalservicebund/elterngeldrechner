import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";

export function sindBeideElternteile(events: FormEvent[]): boolean {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilZweiAllgemeineAngaben,
  );

  return (
    letztesGueltigesEvent !== undefined &&
    letztesGueltigesEvent.wirdZweitePersonBeruecksichtigt !== false
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("sindBeideElternteile", () => {
    it("returns false when no ZweitePersonAngaben event exists", () => {
      expect(sindBeideElternteile([])).toBe(false);
    });

    it("returns false when wirdZweitePersonBeruecksichtigt is false", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false, name: "Max" },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ]);

      expect(result).toBe(false);
    });

    it("returns true when wirdZweitePersonBeruecksichtigt is true", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ]);

      expect(result).toBe(true);
    });

    it("returns true when wirdZweitePersonBeruecksichtigt is unknown", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: undefined,
            name: "Person 2",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ]);

      expect(result).toBe(true);
    });

    it("uses the last ZweitePersonAngaben event when multiple exist", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false, name: "Max" },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ]);

      expect(result).toBe(false);
    });
  });
}
