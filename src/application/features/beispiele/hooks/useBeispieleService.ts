import { useCallback, useMemo, useState } from "react";
import {
  type Beispiel,
  type BeispielIdentifier,
  erstelleBeispiele,
} from "./erstelleBeispiele";
import type { Ausgangslage, Plan } from "@/monatsplaner";

export function useBeispieleService<A extends Ausgangslage>(
  ausgangslage: A,
  setzePlan: (plan: Plan<A>) => void,
  callbacks?: Callbacks<A>,
) {
  const beispiele = useMemo(
    () => erstelleBeispiele(ausgangslage),
    [ausgangslage],
  );

  const beispieleOhnePlan = useMemo(
    () => beispiele.map(({ plan: _, ...rest }) => rest),
    [beispiele],
  );

  const [
    identifierDesUebernommenenBeispiel,
    setIdentifierDesUebernommenenBeispiel,
  ] = useState<string | null>(null);

  const waehleBeispielAus = useCallback(
    (identifier: BeispielIdentifier): void => {
      const beispiel = beispiele.find(
        (beispiel) => beispiel.identifier === identifier,
      );

      if (beispiel) {
        setzePlan(beispiel.plan);
        setIdentifierDesUebernommenenBeispiel(beispiel.identifier);
        callbacks?.onWaehleBeispielAus?.(beispiel);
      }
    },
    [beispiele, setzePlan, callbacks],
  );

  const istBeispielAusgewaehlt = useCallback(
    (identifier: BeispielIdentifier): boolean =>
      identifier === identifierDesUebernommenenBeispiel,
    [identifierDesUebernommenenBeispiel],
  );

  const setzeBeispielauswahlZurueck = useCallback(
    (): void => setIdentifierDesUebernommenenBeispiel(null),
    [],
  );

  return {
    beispieleOhnePlan,
    waehleBeispielAus,
    istBeispielAusgewaehlt,
    setzeBeispielauswahlZurueck,
  };
}

export type Callbacks<A extends Ausgangslage> = Partial<{
  onWaehleBeispielAus: (beispiel: Beispiel<A>) => void;
}>;

if (import.meta.vitest) {
  const { describe, beforeEach, it, expect, vi } = import.meta.vitest;

  describe("use Beispiele Service", async () => {
    const { act, renderHook } = await import("@testing-library/react");
    const { Elternteil, Variante } = await import("@/monatsplaner");

    beforeEach(async () => {
      vi.spyOn(await import("./erstelleBeispiele"), "erstelleBeispiele");
    });

    describe("Beschrebiung der Beispiele", () => {
      it("correctly uses the given Ausgangslage to generate Beispiele", () => {
        const ausgangslage = {
          anzahlElternteile: 1 as const,
          geburtsdatumDesKindes: new Date(),
          istAlleinerziehend: true,
        };

        renderHook(() => useBeispieleService(ausgangslage, ANY_SETZE_PLAN));

        expect(erstelleBeispiele).toHaveBeenCalledOnce();
        expect(erstelleBeispiele).toHaveBeenCalledWith(ausgangslage);
      });

      it("provides the Beschreibungen of the generated Beispiele", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({
            identifier: "erster-identifier",
            titel: "Erster Titel",
            beschreibung: "Erste Beschreibung",
          }),
          beispiel({
            identifier: "erster-identifier",
            titel: "Erster Titel",
            beschreibung: "Erste Beschreibung",
          }),
        ]);

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, ANY_SETZE_PLAN),
        );

        expect(result.current.beispieleOhnePlan).toStrictEqual([
          {
            identifier: "erster-identifier",
            titel: "Erster Titel",
            beschreibung: "Erste Beschreibung",
          },
          {
            identifier: "erster-identifier",
            titel: "Erster Titel",
            beschreibung: "Erste Beschreibung",
          },
        ]);
      });
    });

    describe("wähle Beispiel aus", () => {
      it("does not call the given callback if there is no Beispiel for the given identifier", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({ identifier: "erster-identifier" }),
          beispiel({ identifier: "zweiter-identifier" }),
        ]);

        const setzePlan = vi.fn();

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, setzePlan),
        );

        act(() => result.current.waehleBeispielAus("does-not-exist"));

        expect(setzePlan).not.toHaveBeenCalled();
      });

      it("calls the given callback to set the Plan with the Plan of Beispiel with matching identifier", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({
            identifier: "erster-identifier",
            plan: {
              ausgangslage: {
                anzahlElternteile: 1,
                geburtsdatumDesKindes: new Date("2024-01-01"),
              },
              lebensmonate: {
                1: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Basis,
                    imMutterschutz: false,
                  },
                },
              },
            },
          }),
          beispiel({
            identifier: "zweiter-identifier",
            plan: {
              ausgangslage: {
                anzahlElternteile: 1,
                geburtsdatumDesKindes: new Date("2024-01-02"),
              },
              lebensmonate: {
                1: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Plus,
                    imMutterschutz: false,
                  },
                },
              },
            },
          }),
        ]);

        const setzePlan = vi.fn();

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, setzePlan),
        );

        act(() => result.current.waehleBeispielAus("zweiter-identifier"));

        expect(setzePlan).toHaveBeenCalledOnce();
        expect(setzePlan).toHaveBeenCalledWith({
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date("2024-01-02"),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false,
              },
            },
          },
        });
      });

      it("calls the given callback with the Beispiel", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          {
            identifier: "erster-identifier",
            titel: "Erster Titel",
            beschreibung: "Erste Beschreibung",
            plan: {
              ausgangslage: {
                anzahlElternteile: 1 as const,
                geburtsdatumDesKindes: new Date("2024-01-01"),
              },
              lebensmonate: {},
            },
          },
          {
            identifier: "zweiter-identifier",
            titel: "Zweiter Titel",
            beschreibung: "Zweite Beschreibung",
            plan: {
              ausgangslage: {
                anzahlElternteile: 1 as const,
                geburtsdatumDesKindes: new Date("2024-01-02"),
              },
              lebensmonate: {},
            },
          },
        ]);

        const onWaehleBeispielAus = vi.fn();

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, ANY_SETZE_PLAN, {
            onWaehleBeispielAus,
          }),
        );

        act(() => result.current.waehleBeispielAus("zweiter-identifier"));

        expect(onWaehleBeispielAus).toHaveBeenCalledOnce();
        expect(onWaehleBeispielAus).toHaveBeenCalledWith({
          identifier: "zweiter-identifier",
          titel: "Zweiter Titel",
          beschreibung: "Zweite Beschreibung",
          plan: {
            ausgangslage: {
              anzahlElternteile: 1 as const,
              geburtsdatumDesKindes: new Date("2024-01-02"),
            },
            lebensmonate: {},
          },
        });
      });
    });

    describe("ist Beispiel ausgewaehlt", () => {
      it("initially ther is no Beispiel ausgewaehlt", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({ identifier: "erster-identifier" }),
          beispiel({ identifier: "zweiter-identifier" }),
        ]);

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, ANY_SETZE_PLAN),
        );

        expect(result.current.istBeispielAusgewaehlt("erster-identifier")).toBe(
          false,
        );
        expect(
          result.current.istBeispielAusgewaehlt("zweiter-identifier"),
        ).toBe(false);
      });

      it("marks the correct Beispiel as selected after a selection", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({ identifier: "erster-identifier" }),
          beispiel({ identifier: "zweiter-identifier" }),
        ]);

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, ANY_SETZE_PLAN),
        );

        act(() => result.current.waehleBeispielAus("zweiter-identifier"));

        expect(result.current.istBeispielAusgewaehlt("erster-identifier")).toBe(
          false,
        );
        expect(
          result.current.istBeispielAusgewaehlt("zweiter-identifier"),
        ).toBe(true);
      });

      it("resets the selection marker when asked to", () => {
        vi.mocked(erstelleBeispiele).mockReturnValue([
          beispiel({ identifier: "erster-identifier" }),
        ]);

        const { result } = renderHook(() =>
          useBeispieleService(ANY_AUSGANGSLAGE, ANY_SETZE_PLAN),
        );

        act(() => result.current.waehleBeispielAus("zweiter-identifier"));
        act(() => result.current.setzeBeispielauswahlZurueck());

        expect(result.current.istBeispielAusgewaehlt("erster-identifier")).toBe(
          false,
        );
      });
    });

    function beispiel<A extends Ausgangslage>(
      beispiel: Partial<Beispiel<A>>,
    ): Beispiel<A> {
      return {
        identifier: crypto.randomUUID(),
        titel: "Test Titel",
        beschreibung: "Test Beschreibung",
        plan: ANY_PLAN as Plan<A>,
        ...beispiel,
      };
    }

    const ANY_AUSGANGSLAGE = {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: new Date(),
    };

    const ANY_PLAN = {
      ausgangslage: ANY_AUSGANGSLAGE,
      lebensmonate: {},
    };

    const ANY_SETZE_PLAN = () => {};
  });
}
