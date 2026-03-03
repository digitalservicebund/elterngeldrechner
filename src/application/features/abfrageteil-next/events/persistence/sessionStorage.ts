import {
  type FormEvent,
  FormEventSchema,
} from "@/application/features/abfrageteil-next/routing";

const SESSION_KEY = "EGR_SESSION_STORAGE";

export function restoreEventstream(): FormEvent[] {
  const json = sessionStorage.getItem(SESSION_KEY);

  if (!json) return [];

  try {
    const rawEventsream: unknown = JSON.parse(json);

    if (!Array.isArray(rawEventsream)) return [];

    return rawEventsream.flatMap((rawEvent: unknown) => {
      const parseEventResult = FormEventSchema.safeParse(rawEvent);

      return parseEventResult.success ? [parseEventResult.data] : [];
    });
  } catch {
    return [];
  }
}

export function persistEventstream(eventStream: FormEvent[]): void {
  const encodedEventstream = eventStream.map((event) =>
    FormEventSchema.encode(event),
  );

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(encodedEventstream));
}

if (import.meta.vitest) {
  const { beforeEach, describe, expect, it } = import.meta.vitest;

  describe("persistence", async () => {
    const { Route } =
      await import("@/application/features/abfrageteil-next/routing");

    beforeEach(() => sessionStorage.clear());

    describe("restoreEventstream", () => {
      it("returns [] when storage is empty", () => {
        expect(restoreEventstream()).toEqual([]);
      });

      it("returns [] when storage contains invalid json", () => {
        sessionStorage.setItem(SESSION_KEY, "not-json{-at-all$");

        expect(restoreEventstream()).toEqual([]);
      });

      it("returns [] when storage contains an object", () => {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ not: "an array" }),
        );

        expect(restoreEventstream()).toEqual([]);
      });

      it("discards invalid events and keeps valid ones", () => {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify([
            { route: Route.Startseite },
            { route: "unknown-route", payload: {} },
            {
              route: Route.AllgemeineAngaben,
              payload: {
                bundesland: "Berlin",
                gesamteinkommenGrenzeUeberschritten: "no",
              },
            },
          ]),
        );

        expect(restoreEventstream()).toEqual([
          { route: Route.Startseite },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
        ]);
      });
    });

    describe("persistEventstream → restoreEventstream", () => {
      it("round-trips the eventstream, decoding codec fields on restore", () => {
        const eventStream = [
          { route: Route.Startseite } as const,
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin" as const,
              gesamteinkommenGrenzeUeberschritten: false,
            },
          } as const,
        ];

        persistEventstream(eventStream);

        expect(restoreEventstream()).toEqual(eventStream);
      });
    });
  });
}
