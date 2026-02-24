import type { ElternteilAusklammerungZeiten } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilSchema";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import type { Ausklammerung } from "@/bemessungszeitraumrechner";

export function findeAusklammerungen(
  events: FormEvent[],
  elternteilIndex: number,
): Ausklammerung[] {
  const event = [...events]
    .reverse()
    .find((event): event is AusklammerungZeitenEvent => {
      return (
        event.route === Route.ElternteilAusklammerungZeitenAngaben &&
        event.params.elternteilIndex === elternteilIndex
      );
    });

  return event ? flacheAusklammerungen(event.payload) : [];
}

function flacheAusklammerungen(
  ausklammerungszeiten: ElternteilAusklammerungZeiten,
): Ausklammerung[] {
  return (
    Object.keys(ausklammerungszeiten) as (keyof ElternteilAusklammerungZeiten)[]
  ).flatMap((grund) =>
    ausklammerungszeiten[grund].map((zeitraum) => ({ ...zeitraum, grund })),
  );
}

type AusklammerungZeitenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilAusklammerungZeitenAngaben }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeAusklammerungen", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns empty array when no event exists for the elternteilIndex", () => {
      expect(findeAusklammerungen([], 0)).toEqual([]);
    });

    it("returns empty array when no event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 1 },
          payload: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([]);
    });

    it("flattens all Ausklammerungszeiträume with their Grund", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeld: [
              {
                von: Temporal.PlainDate.from("2023-01-01"),
                bis: Temporal.PlainDate.from("2023-06-30"),
              },
            ],
            erkrankung: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([
        {
          grund: "mutterschutz",
          von: Temporal.PlainDate.from("2024-11-01"),
          bis: Temporal.PlainDate.from("2025-02-15"),
        },
        {
          grund: "elterngeld",
          von: Temporal.PlainDate.from("2023-01-01"),
          bis: Temporal.PlainDate.from("2023-06-30"),
        },
      ]);
    });

    it("uses the most recent event for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: { mutterschutz: [], elterngeld: [], erkrankung: [] },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([
        {
          grund: "mutterschutz",
          von: Temporal.PlainDate.from("2024-11-01"),
          bis: Temporal.PlainDate.from("2025-02-15"),
        },
      ]);
    });
  });
}
