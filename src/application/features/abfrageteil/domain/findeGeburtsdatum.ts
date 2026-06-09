import type { Temporal } from "@js-temporal/polyfill";
import type { FormEvent } from "@/application/routing/FormEvent";

import { Route } from "@/application/routing/Route";

export function findeGeburtsdatum(events: FormEvent[]): Temporal.PlainDate {
  for (const event of [...events].reverse()) {
    if (event.route === Route.GeborenesKindAngaben) {
      return event.payload.geburtsdatum;
    }

    if (event.route === Route.WahrscheinlichGeborenesKindAbfrage) {
      return event.payload.geburtsdatum;
    }

    if (event.route === Route.UngeborenesKindAngaben) {
      return event.payload.errechneterEntbindungstermin;
    }
  }

  throw new Error("At least one event of the Kind flow is required.");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeGeburtsdatum", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");
    it("returns geburtsdatum from GeborenesKindAngaben", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-20"),
            anzahl: 1,
          },
        },
      ];

      expect(findeGeburtsdatum(events)).toEqual(
        Temporal.PlainDate.from("2025-12-23"),
      );
    });

    it("returns geburtsdatum from WahrscheinlichGeborenesKindAbfrage", () => {
      const events: FormEvent[] = [
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 1,
          },
        },
        {
          route: Route.WahrscheinlichGeborenesKindAbfrage,
          payload: { geburtsdatum: Temporal.PlainDate.from("2025-03-20") },
        },
      ];

      expect(findeGeburtsdatum(events)).toEqual(
        Temporal.PlainDate.from("2025-03-20"),
      );
    });

    it("returns errechneterEntbindungstermin from UngeborenesKindAngaben", () => {
      const events: FormEvent[] = [
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-09-01"),
            anzahl: 1,
          },
        },
      ];

      expect(findeGeburtsdatum(events)).toEqual(
        Temporal.PlainDate.from("2025-09-01"),
      );
    });

    it("prefers GeborenesKindAngaben over WahrscheinlichGeborenesKindAbfrage", () => {
      const events: FormEvent[] = [
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 1,
          },
        },
        {
          route: Route.WahrscheinlichGeborenesKindAbfrage,
          payload: { geburtsdatum: Temporal.PlainDate.from("2025-03-20") },
        },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-03-22"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 1,
          },
        },
      ];

      expect(findeGeburtsdatum(events)).toEqual(
        Temporal.PlainDate.from("2025-03-22"),
      );
    });

    it("throws when no Kind event is present", () => {
      expect(() => findeGeburtsdatum([])).toThrow();
    });
  });
}
