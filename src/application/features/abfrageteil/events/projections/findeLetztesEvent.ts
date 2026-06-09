import { filtereValideEventHistorie } from "./filtereValideEventHistorie";
import type { FormEvent } from "@/application/routing/FormEvent";

export function findeLetztesEvent(events: FormEvent[]): FormEvent | undefined {
  const valideHistorie = filtereValideEventHistorie(events);

  return valideHistorie[valideHistorie.length - 1];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeLetztesEvent", async () => {
    const { Route } = await import("@/application/routing/Route");

    it("returns undefined for an empty event stream", () => {
      expect(findeLetztesEvent([])).toBeUndefined();
    });

    it("returns the only event in a single-event stream", () => {
      const events: FormEvent[] = [{ route: Route.Startseite }];

      expect(findeLetztesEvent(events)).toEqual({ route: Route.Startseite });
    });

    it("returns the last event in a valid multi-event stream", () => {
      const events: FormEvent[] = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
      ];

      expect(findeLetztesEvent(events)).toEqual({
        route: Route.AllgemeineAngaben,
        payload: {
          bundesland: "Berlin",
          gesamteinkommenGrenzeUeberschritten: false,
        },
      });
    });
  });
}
