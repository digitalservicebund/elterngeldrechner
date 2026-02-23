import { Temporal } from "@js-temporal/polyfill";
import type { ElternteilAusklammerungZeiten } from "@/application/features/abfrageteil-next/elternteil/ElternteilSchema";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import type { PayloadMap } from "@/application/features/abfrageteil-next/routing";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import type { Ausklammerung } from "@/bemessungszeitraumrechner";
import {
  berechneBemessungszeitraum,
  berechneBetrachtungszeitraum,
} from "@/bemessungszeitraumrechner";

export function useBemessungszeitraumrechner(elternteilIndex: number) {
  const { findeLetztesGueltigesEvent } = useEventContext();

  const findeAusklammerungszeiten = (): Ausklammerung[] => {
    const event = findeLetztesGueltigesEvent(
      Route.ElternteilAusklammerungZeitenAngaben,
      { elternteilIndex },
    );

    return event ? flacheAusklammerungen(event) : [];
  };

  const findeGeburtsdatum = () => {
    const geborenesKindEvent = findeLetztesGueltigesEvent(
      Route.GeborenesKindAngaben,
    );

    if (geborenesKindEvent) {
      return geborenesKindEvent.geburtsdatum;
    }

    const wahrscheinlichGeborenesKindEvent = findeLetztesGueltigesEvent(
      Route.WahrscheinlichGeborenesKindAbfrage,
    );

    if (wahrscheinlichGeborenesKindEvent) {
      return wahrscheinlichGeborenesKindEvent.geburtsdatum;
    }

    const ungeborenesKindEvent = findeLetztesGueltigesEvent(
      Route.UngeborenesKindAngaben,
    );

    if (ungeborenesKindEvent) {
      return ungeborenesKindEvent.errechneterEntbindungstermin;
    }

    throw new Error("At least one event of the Kind flow is required.");
  };

  return {
    berechneBemessungszeitraum: (erwerbstaetigkeit: Erwerbstaetigkeit) => {
      return berechneBemessungszeitraum({
        erwerbstaetigkeit,
        geburtsdatum: findeGeburtsdatum(),
        ausklammerungen: findeAusklammerungszeiten(),
      });
    },

    berechneBetrachtungszeitraum: () => {
      return berechneBetrachtungszeitraum(
        findeGeburtsdatum(),
        findeAusklammerungszeiten(),
      );
    },
  };

  type BerechneBemessungszeitraumParameter = Parameters<
    typeof berechneBemessungszeitraum
  >[0];

  type Erwerbstaetigkeit =
    BerechneBemessungszeitraumParameter["erwerbstaetigkeit"];

  function flacheAusklammerungen(
    ausklammerungszeiten: ElternteilAusklammerungZeiten,
  ): Ausklammerung[] {
    return (
      Object.keys(
        ausklammerungszeiten,
      ) as (keyof ElternteilAusklammerungZeiten)[]
    ).flatMap((grund) =>
      ausklammerungszeiten[grund].map((zeitraum) => ({ ...zeitraum, grund })),
    );
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { beforeEach, vi } = import.meta.vitest;

  beforeEach(async () => {
    const bmzRechnerPaket = await import("@/bemessungszeitraumrechner");

    vi.spyOn(bmzRechnerPaket, "berechneBemessungszeitraum").mockReturnValue([
      {
        von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
        bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
      },
    ]);

    vi.spyOn(bmzRechnerPaket, "berechneBetrachtungszeitraum").mockReturnValue({
      von: Temporal.PlainYearMonth.from({ year: 2024, month: 10 }),
      bis: Temporal.PlainYearMonth.from({ year: 2024, month: 10 }),
    });
  });

  describe("useBemessungszeitraumrechner", async () => {
    const { renderHook } = await import("@testing-library/react");

    describe("berechneBemessungszeitraum", () => {
      it("passes geburtsdatum, erwerbstaetigkeit and empty ausklammerungen", () => {
        mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes Selbstaendig as erwerbstaetigkeit", () => {
        mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes ausklammerungszeiten when present", () => {
        mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
          [Route.ElternteilAusklammerungZeitenAngaben]: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [
            {
              grund: "mutterschutz",
              von: Temporal.PlainDate.from("2024-11-01"),
              bis: Temporal.PlainDate.from("2025-02-15"),
            },
          ],
        });
      });

      it("passes errechneterEntbindungstermin from UngeborenesKindAngaben", () => {
        mockEventContext({
          [Route.UngeborenesKindAngaben]: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-09-01"),
            anzahl: 1,
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-09-01"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("prioritizes geburtsdatum from WahrscheinlichGeborenesKindAbfrage over errechneterEntbindungstermin from UngeborenesKindAngaben", () => {
        mockEventContext({
          [Route.UngeborenesKindAngaben]: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-03-01"),
            anzahl: 1,
          },
          [Route.WahrscheinlichGeborenesKindAbfrage]: {
            geburtsdatum: Temporal.PlainDate.from("2025-03-20"),
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-03-20"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes the elternteilIndex to findeLetztesGueltigesEvent when looking up ausklammerungszeiten", () => {
        const findeLetztesGueltigesEvent = mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(1));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(findeLetztesGueltigesEvent).toHaveBeenCalledWith(
          Route.ElternteilAusklammerungZeitenAngaben,
          { elternteilIndex: 1 },
        );
      });
    });

    describe("berechneBetrachtungszeitraum", () => {
      it("passes geburtsdatum and empty ausklammerungen", () => {
        mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBetrachtungszeitraum();

        expect(berechneBetrachtungszeitraum).toHaveBeenCalledWith(
          Temporal.PlainDate.from("2025-06-15"),
          [],
        );
      });

      it("passes ausklammerungszeiten when present", () => {
        mockEventContext({
          [Route.GeborenesKindAngaben]: {
            geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
            anzahl: 1,
          },
          [Route.ElternteilAusklammerungZeitenAngaben]: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        });

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBetrachtungszeitraum();

        expect(berechneBetrachtungszeitraum).toHaveBeenCalledWith(
          Temporal.PlainDate.from("2025-06-15"),
          [
            {
              grund: "mutterschutz",
              von: Temporal.PlainDate.from("2024-11-01"),
              bis: Temporal.PlainDate.from("2025-02-15"),
            },
          ],
        );
      });
    });

    vi.mock(
      import("@/application/features/abfrageteil-next/events/EventContext"),
      () => ({
        useEventContext: vi.fn(),
      }),
    );

    const { useEventContext } =
      await import("@/application/features/abfrageteil-next/events/EventContext");

    type EventContextType = ReturnType<typeof useEventContext>;

    function mockEventContext(events: Partial<PayloadMap>) {
      const findeLetztesGueltigesEvent = vi.fn(
        (route: Route) => events[route as keyof PayloadMap],
      ) as EventContextType["findeLetztesGueltigesEvent"];

      vi.mocked(useEventContext).mockReturnValue({
        dispatch: vi.fn(),
        findeVorherigenPfad: vi.fn(),
        filtereValideEventHistorie: vi.fn(),
        findeLetztesGueltigesEvent,
      });

      return findeLetztesGueltigesEvent;
    }
  });
}
