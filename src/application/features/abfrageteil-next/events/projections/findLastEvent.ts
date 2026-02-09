import { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import {
  FormEvent,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing/routing";

export function findLastEvent<R extends FormEvent["route"]>(
  eventStream: EventStream,
  route: R,
): PayloadMap[R] | undefined {
  return eventStream.findLast((event) => event.route === route)?.payload as
    | PayloadMap[R]
    | undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findLastEvent", async () => {
    const { Route } = await import("../../routing/routing");

    it("it returns the last object matching the route", () => {
      const result = findLastEvent(
        [
          { route: Route.Startseite },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: true,
            },
          },
        ],
        Route.AllgemeineAngaben,
      );

      expect(result).toEqual({
        bundesland: "Berlin",
        gesamteinkommenGrenzeUeberschritten: true,
      });
    });

    it("it returns undefined if no object matches the route", () => {
      const result = findLastEvent(
        [{ route: Route.Startseite }],
        Route.AllgemeineAngaben,
      );

      expect(result).toBeUndefined();
    });
  });
}
