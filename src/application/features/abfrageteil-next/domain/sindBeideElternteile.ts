import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function sindBeideElternteile(events: FormEvent[]): boolean {
  const zweitePersonEvent = [...events]
    .reverse()
    .find((e): e is ZweitePersonAngabenEvent => {
      return e.route === Route.ElternteilZweitePersonAngaben;
    });

  return zweitePersonEvent?.payload.wirdZweitePersonBeruecksichtigt === true;
}

type ZweitePersonAngabenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilZweitePersonAngaben }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("sindBeideElternteile", () => {
    it("returns false when no ZweitePersonAngaben event exists", () => {
      expect(sindBeideElternteile([])).toBe(false);
    });

    it("returns false when wirdZweitePersonBeruecksichtigt is false", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false, name: "Max" },
        },
      ]);

      expect(result).toBe(false);
    });

    it("returns true when wirdZweitePersonBeruecksichtigt is true", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
        },
      ]);

      expect(result).toBe(true);
    });

    it("uses the last ZweitePersonAngaben event when multiple exist", () => {
      const result = sindBeideElternteile([
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
        },
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false, name: "Max" },
        },
      ]);

      expect(result).toBe(false);
    });
  });
}
