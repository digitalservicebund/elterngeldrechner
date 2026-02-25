import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { findeGeburtsdatum } from "@/application/features/abfrageteil-next/domain/findeGeburtsdatum";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  berechneBemessungszeitraum,
  berechneBetrachtungszeitraum,
} from "@/bemessungszeitraumrechner";

export function useBemessungszeitraumrechner(elternteilIndex: number) {
  const { filtereValideEventHistorie } = useEventContext();

  const eventStream = filtereValideEventHistorie();

  const geburtsdatum = findeGeburtsdatum(eventStream);
  const ausklammerungen = findeAusklammerungen(eventStream, elternteilIndex);

  return {
    berechneBemessungszeitraum: (erwerbstaetigkeit: Erwerbstaetigkeit) => {
      return berechneBemessungszeitraum({
        geburtsdatum,
        erwerbstaetigkeit,
        ausklammerungen,
      });
    },

    berechneBetrachtungszeitraum: () => {
      return berechneBetrachtungszeitraum(geburtsdatum, ausklammerungen);
    },
  };

  type BerechneBemessungszeitraumParameter = Parameters<
    typeof berechneBemessungszeitraum
  >[0];

  type Erwerbstaetigkeit =
    BerechneBemessungszeitraumParameter["erwerbstaetigkeit"];
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;

  vi.mock(
    import("@/application/features/abfrageteil-next/events/EventContext"),
    () => ({ useEventContext: vi.fn() }),
  );

  describe("useBemessungszeitraumrechner", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");
    const { renderHook } = await import("@testing-library/react");

    const { Route } =
      await import("@/application/features/abfrageteil-next/routing/Route");
    const { useEventContext } =
      await import("@/application/features/abfrageteil-next/events/EventContext");
    type FormEvent =
      import("@/application/features/abfrageteil-next/routing/FormEvent").FormEvent;

    const bmzRechnerPaket = await import("@/bemessungszeitraumrechner");

    type EventContextType = ReturnType<typeof useEventContext>;

    function mockEventContext(events: FormEvent[]) {
      vi.mocked(useEventContext).mockReturnValue({
        dispatch: vi.fn(),
        filtereValideEventHistorie: vi.fn().mockReturnValue(events),
        findeAlleGueltigenEvents: vi.fn(),
        findeLetztesGueltigesEvent: vi.fn(),
        findeVorherigenPfad: vi.fn(),
      } as unknown as EventContextType);
    }

    beforeEach(() => {
      vi.spyOn(bmzRechnerPaket, "berechneBemessungszeitraum").mockReturnValue([
        {
          von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
          bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
        },
      ]);

      vi.spyOn(bmzRechnerPaket, "berechneBetrachtungszeitraum").mockReturnValue(
        {
          von: Temporal.PlainDate.from({ year: 2024, month: 10, day: 1 }),
          bis: Temporal.PlainDate.from({ year: 2024, month: 10, day: 1 }),
        },
      );
    });

    describe("berechneBemessungszeitraum", () => {
      it("passes geburtsdatum, erwerbstaetigkeit and empty ausklammerungen", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
          },
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes Selbstaendig as erwerbstaetigkeit", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
          },
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes ausklammerungszeiten when present", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
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
        ]);

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
        mockEventContext([
          {
            route: Route.UngeborenesKindAngaben,
            payload: {
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-09-01"),
              anzahl: 1,
            },
          },
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-09-01"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("prioritizes geburtsdatum from WahrscheinlichGeborenesKindAbfrage over errechneterEntbindungstermin from UngeborenesKindAngaben", () => {
        mockEventContext([
          {
            route: Route.UngeborenesKindAngaben,
            payload: {
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-03-01"),
              anzahl: 1,
            },
          },
          {
            route: Route.WahrscheinlichGeborenesKindAbfrage,
            payload: { geburtsdatum: Temporal.PlainDate.from("2025-03-20") },
          },
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-03-20"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });

      it("passes ausklammerungszeiten only for the given elternteilIndex", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
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
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(1));

        result.current.berechneBemessungszeitraum("Nicht-Selbstaendig");

        expect(berechneBemessungszeitraum).toHaveBeenCalledWith({
          geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });
      });
    });

    describe("berechneBetrachtungszeitraum", () => {
      it("passes geburtsdatum and empty ausklammerungen", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
          },
        ]);

        const { result } = renderHook(() => useBemessungszeitraumrechner(0));

        result.current.berechneBetrachtungszeitraum();

        expect(berechneBetrachtungszeitraum).toHaveBeenCalledWith(
          Temporal.PlainDate.from("2025-06-15"),
          [],
        );
      });

      it("passes ausklammerungszeiten when present", () => {
        mockEventContext([
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 1,
            },
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
        ]);

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
  });
}
