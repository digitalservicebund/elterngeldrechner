import { produce } from "immer";
import {
  type Ausgangslage,
  Elternteil,
} from "@/features/planer/user-interface/service";
import { YesNo } from "@/globals/js/calculations/model";
import { createAppSelector } from "@/redux/hooks";
import { INITIAL_STATE, renderHook } from "@/test-utils/test-utils";
import type { RootState } from "@/redux";

export const ausgangslageSelector = createAppSelector(
  [
    (store) => store.stepAllgemeineAngaben.antragstellende,
    (store) => store.stepAllgemeineAngaben.alleinerziehend,
    (store) => store.stepAllgemeineAngaben.mutterschaftssleistungen,
    (store) => store.stepAllgemeineAngaben.mutterschaftssleistungenWer,
    (store) => store.stepNachwuchs.anzahlKuenftigerKinder,
    (store) => store.stepNachwuchs.geschwisterkinder,
  ],
  (
    antragstellende,
    alleinerziehend,
    mutterschaftssleistungen,
    mutterschaftssleistungenWer,
    anzahlKuenftigerKinder,
    geschwisterkinder,
  ): Ausgangslage => {
    const anzahlElternteile =
      antragstellende === "EinenElternteil" ? (1 as const) : (2 as const);
    const istAlleinerziehend = alleinerziehend === YesNo.YES;
    const hatBehindertesGeschwisterkind = geschwisterkinder.some(
      (kind) => kind.istBehindert,
    );
    const sindMehrlinge = anzahlKuenftigerKinder > 1;
    const hatMutterschutz = mutterschaftssleistungen === YesNo.YES;
    const letzterLebensmonatMitSchutz = sindMehrlinge
      ? (3 as const)
      : (2 as const);

    const sharedAusganslageProperties = {
      istAlleinerziehend,
      hatBehindertesGeschwisterkind,
      sindMehrlinge,
    };

    switch (anzahlElternteile) {
      case 1: {
        const empfaenger = Elternteil.Eins as const;
        const informationenZumMutterschutz = hatMutterschutz
          ? { empfaenger, letzterLebensmonatMitSchutz }
          : undefined;

        return {
          ...sharedAusganslageProperties,
          anzahlElternteile,
          informationenZumMutterschutz,
        };
      }

      case 2: {
        const empfaenger =
          mutterschaftssleistungenWer === "ET1"
            ? Elternteil.Eins
            : Elternteil.Zwei;
        const informationenZumMutterschutz = hatMutterschutz
          ? { empfaenger, letzterLebensmonatMitSchutz }
          : undefined;

        return {
          ...sharedAusganslageProperties,
          anzahlElternteile,
          informationenZumMutterschutz,
        };
      }
    }
  },
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Ausgangslage selector", async () => {
    const { useAppSelector } = await import("@/redux/hooks");

    it("creates Ausgangslage for one Elternteil if Antragstellende is answered with Einen Elternteil", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
      });

      const ausgangslage = executeAusgangslageSelector(preloadedState);

      expect(ausgangslage.anzahlElternteile).toBe(1);
    });

    it("creates Ausgangslage for two Elternteil if Antragstellende is answered with Für Beide", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
      });

      const ausgangslage = executeAusgangslageSelector(preloadedState);

      expect(ausgangslage.anzahlElternteile).toBe(2);
    });

    describe("mutterschaftssleistungen", () => {
      it("is undefined if Mutterschaftssleistungen answered with No", () => {
        const preloadedState = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.NO;
        });

        const ausgangslage = executeAusgangslageSelector(preloadedState);

        expect(ausgangslage.informationenZumMutterschutz).toBeUndefined();
      });

      it("automatically sets the Empfänger to Elternteil 1 for Antragstellende Einen Elternteil and Mutterschaftssleistungen Yes", () => {
        const preloadedState = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
          draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
        });

        const ausgangslage = executeAusgangslageSelector(preloadedState);

        expect(ausgangslage.informationenZumMutterschutz).toBeDefined();
        expect(ausgangslage.informationenZumMutterschutz?.empfaenger).toBe(
          Elternteil.Eins,
        );
      });

      it.each([
        { answered: "ET1" as const, expected: Elternteil.Eins },
        { answered: "ET2" as const, expected: Elternteil.Zwei },
      ])(
        "sets the Empfänger to $expected for Antragstellende Für Beide and $answered was answered",
        ({ answered, expected }) => {
          const preloadedState = produce(INITIAL_STATE, (draft) => {
            draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
            draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
            draft.stepAllgemeineAngaben.mutterschaftssleistungenWer = answered;
          });

          const ausgangslage = executeAusgangslageSelector(preloadedState);

          expect(ausgangslage.informationenZumMutterschutz).toBeDefined();
          expect(ausgangslage.informationenZumMutterschutz?.empfaenger).toBe(
            expected,
          );
        },
      );

      it.each([
        { anzahlKuenftigerKinder: 1, letzterLebensmonatMitSchutz: 2 },
        { anzahlKuenftigerKinder: 2, letzterLebensmonatMitSchutz: 3 },
        { anzahlKuenftigerKinder: 5, letzterLebensmonatMitSchutz: 3 },
      ])(
        "sets letzten Lebensmonat mit Schutz to $letzterLebensmonatMitSchutz if Anzahl künftiger Kinder is $anzahlKuenftigerKinder",
        ({ anzahlKuenftigerKinder, letzterLebensmonatMitSchutz }) => {
          const preloadedState = produce(INITIAL_STATE, (draft) => {
            draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
            draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
            draft.stepNachwuchs.anzahlKuenftigerKinder = anzahlKuenftigerKinder;
          });

          const ausgangslage = executeAusgangslageSelector(preloadedState);

          expect(
            ausgangslage.informationenZumMutterschutz
              ?.letzterLebensmonatMitSchutz,
          ).toBe(letzterLebensmonatMitSchutz);
        },
      );
    });

    it.each([
      { answer: YesNo.NO, expected: false },
      { answer: YesNo.YES, expected: true },
    ])(
      "sets alleinerziehend flag to $expected if answered to be alleinerziehend with $answer",
      ({ answer, expected }) => {
        const preloadedState = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.alleinerziehend = answer;
        });

        const ausgangslage = executeAusgangslageSelector(preloadedState);

        expect(ausgangslage.istAlleinerziehend).toBe(expected);
      },
    );

    it.each([
      { anzahlKuenftigerKinder: 1, sindMehrlinge: false },
      { anzahlKuenftigerKinder: 2, sindMehrlinge: true },
      { anzahlKuenftigerKinder: 5, sindMehrlinge: true },
    ])(
      "sets Mehrlinge flag to $sindMehrlinge if Anzahl künftiger Kinder is $anzahlKuenftigerKinder",
      ({ anzahlKuenftigerKinder, sindMehrlinge }) => {
        const preloadedState = produce(INITIAL_STATE, (draft) => {
          draft.stepNachwuchs.anzahlKuenftigerKinder = anzahlKuenftigerKinder;
        });

        const ausgangslage = executeAusgangslageSelector(preloadedState);

        expect(ausgangslage.sindMehrlinge).toBe(sindMehrlinge);
      },
    );

    it("sets behindertes Geschwisterkind flag to false if there are no sibligs", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [];
      });

      const ausgangslage = executeAusgangslageSelector(preloadedState);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to false if no sibling has a Behinderung", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(false), kind(false)];
      });

      const ausgangslage = executeAusgangslageSelector(preloadedState);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to true if any sibling has a Behinderung", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(true), kind(false)];
      });

      const ausgangslage = executeAusgangslageSelector(preloadedState);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(true);
    });

    function executeAusgangslageSelector(
      preloadedState: RootState,
    ): Ausgangslage {
      const { result } = renderHook(() => useAusgangslage(), {
        preloadedState,
      });
      return result.current;
    }

    function useAusgangslage() {
      return useAppSelector(ausgangslageSelector);
    }

    function kind(istBehindert: boolean) {
      return { istBehindert, geburtsdatum: new Date().toISOString() };
    }
  });
}
