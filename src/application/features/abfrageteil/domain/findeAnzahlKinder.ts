import { FormEvent, Route } from "@/application/routing";

export function findeAnzahlKinder(events: FormEvent[]) {
  for (const event of [...events].reverse()) {
    if (event.route === Route.GeborenesKindAngaben) {
      return event.payload.anzahl;
    }

    if (event.route === Route.UngeborenesKindAngaben) {
      return event.payload.anzahl;
    }
  }

  throw new Error(
    "Either GeborenesKindAngaben or UngeborenesKindAngaben must be present.",
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeAnzahlKinder", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns anzahl from GeborenesKindAngaben", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-20"),
            anzahl: 2,
          },
        },
      ];

      expect(findeAnzahlKinder(events)).toEqual(2);
    });

    it("returns anzahl from UngeborenesKindAngaben", () => {
      const events: FormEvent[] = [
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-09-01"),
            anzahl: 3,
          },
        },
      ];

      expect(findeAnzahlKinder(events)).toEqual(3);
    });

    it("prefers the most recent event when both routes are present", () => {
      const events: FormEvent[] = [
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 1,
          },
        },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-03-22"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 2,
          },
        },
      ];

      expect(findeAnzahlKinder(events)).toEqual(2);
    });

    it("throws when no Kind event is present", () => {
      expect(() => findeAnzahlKinder([])).toThrow();
    });
  });
}
