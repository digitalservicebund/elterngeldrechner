import {
  type Ausgangslage,
  Elternteil,
  type PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";
import { YesNo } from "@/globals/js/calculations/model";
import { type RootState } from "@/redux";
import { parseGermanDateString } from "@/utils/locale-formatting";

export function composeAusgangslage(state: RootState): Ausgangslage {
  const { stepAllgemeineAngaben, stepNachwuchs } = state;

  const anzahlElternteile =
    stepAllgemeineAngaben.antragstellende === "EinenElternteil"
      ? (1 as const)
      : (2 as const);

  const geburtsdatumDesKindes = parseGermanDateString(
    stepNachwuchs.wahrscheinlichesGeburtsDatum,
  );

  const istAlleinerziehend =
    stepAllgemeineAngaben.alleinerziehend === YesNo.YES;

  const hatBehindertesGeschwisterkind = stepNachwuchs.geschwisterkinder.some(
    (kind) => kind.istBehindert,
  );

  const sindMehrlinge = stepNachwuchs.anzahlKuenftigerKinder > 1;

  const hatMutterschutz =
    stepAllgemeineAngaben.mutterschaftssleistungen === YesNo.YES;

  const letzterLebensmonatMitSchutz = sindMehrlinge
    ? (3 as const)
    : (2 as const);

  const sharedAusganslageProperties = {
    geburtsdatumDesKindes,
    istAlleinerziehend,
    hatBehindertesGeschwisterkind,
    sindMehrlinge,
  };

  const pseudonyme = getPseudonymeFuerAlleElternteile(
    stepAllgemeineAngaben.pseudonym,
  );

  switch (anzahlElternteile) {
    case 1: {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: pseudonyme[Elternteil.Eins],
      };
      const empfaenger = Elternteil.Eins as const;
      const informationenZumMutterschutz = hatMutterschutz
        ? { empfaenger, letzterLebensmonatMitSchutz }
        : undefined;

      return {
        ...sharedAusganslageProperties,
        anzahlElternteile,
        pseudonymeDerElternteile,
        informationenZumMutterschutz,
      };
    }

    case 2: {
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: pseudonyme[Elternteil.Eins],
        [Elternteil.Zwei]: pseudonyme[Elternteil.Zwei],
      };
      const empfaenger =
        stepAllgemeineAngaben.mutterschaftssleistungenWer === "ET1"
          ? Elternteil.Eins
          : Elternteil.Zwei;
      const informationenZumMutterschutz = hatMutterschutz
        ? { empfaenger, letzterLebensmonatMitSchutz }
        : undefined;

      return {
        ...sharedAusganslageProperties,
        anzahlElternteile,
        pseudonymeDerElternteile,
        informationenZumMutterschutz,
      };
    }
  }
}

function getPseudonymeFuerAlleElternteile(possiblyEmptyPseudonyme: {
  ET1: string;
  ET2: string;
}): Record<Elternteil, string> {
  const { ET1, ET2 } = possiblyEmptyPseudonyme;
  return {
    [Elternteil.Eins]: ET1 ? ET1 : "Elternteil 1",
    [Elternteil.Zwei]: ET2 ? ET2 : "Elternteil 2",
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Ausgangslage selector", async () => {
    const { produce } = await import("immer");
    const { INITIAL_STATE } = await import("@/test-utils/test-utils");

    describe("anzahl der Elternteile", () => {
      it("creates Ausgangslage for one Elternteil if Antragstellende is answered with Einen Elternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.anzahlElternteile).toBe(1);
      });

      it("creates Ausgangslage for two Elternteil if Antragstellende is answered with Für Beide", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.anzahlElternteile).toBe(2);
      });
    });

    describe("Pseudonyme der Elternteile", () => {
      it("correctly picks the Pseudonym for one Elternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.pseudonym = { ET1: "Jane", ET2: "John" };
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.pseudonymeDerElternteile[Elternteil.Eins]).toBe(
          "Jane",
        );
      });

      it("assigns the correct Pseudonyme for two Elternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.pseudonym = { ET1: "Jane", ET2: "John" };
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.pseudonymeDerElternteile[Elternteil.Eins]).toBe(
          "Jane",
        );
        expect(
          (
            ausgangslage.pseudonymeDerElternteile as PseudonymeDerElternteile<Elternteil>
          )[Elternteil.Zwei],
        ).toBe("John");
      });

      it("uses default Pseudonyme if kept empty", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.pseudonym = { ET1: "", ET2: "" };
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const { pseudonymeDerElternteile } = composeAusgangslage(state);

        expect(pseudonymeDerElternteile[Elternteil.Eins]).toBe("Elternteil 1");
        expect(
          (pseudonymeDerElternteile as PseudonymeDerElternteile<Elternteil>)[
            Elternteil.Zwei
          ],
        ).toBe("Elternteil 2");
      });
    });

    describe("Geburtsdatum des Kindes", () => {
      it("takes the parsed Geburtsdatum from the store", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "21.12.2013";
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date(2013, 11, 21),
        );
      });
    });

    describe("mutterschaftssleistungen", () => {
      it("is undefined if Mutterschaftssleistungen answered with No", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.NO;
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.informationenZumMutterschutz).toBeUndefined();
      });

      it("automatically sets the Empfänger to Elternteil 1 for Antragstellende Einen Elternteil and Mutterschaftssleistungen Yes", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
          draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
        });

        const ausgangslage = composeAusgangslage(state);

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
          const state = produce(INITIAL_STATE, (draft) => {
            draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
            draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
            draft.stepAllgemeineAngaben.mutterschaftssleistungenWer = answered;
          });

          const ausgangslage = composeAusgangslage(state);

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
          const state = produce(INITIAL_STATE, (draft) => {
            draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
            draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
            draft.stepNachwuchs.anzahlKuenftigerKinder = anzahlKuenftigerKinder;
          });

          const ausgangslage = composeAusgangslage(state);

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
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.alleinerziehend = answer;
        });

        const ausgangslage = composeAusgangslage(state);

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
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepNachwuchs.anzahlKuenftigerKinder = anzahlKuenftigerKinder;
        });

        const ausgangslage = composeAusgangslage(state);

        expect(ausgangslage.sindMehrlinge).toBe(sindMehrlinge);
      },
    );

    it("sets behindertes Geschwisterkind flag to false if there are no sibligs", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [];
      });

      const ausgangslage = composeAusgangslage(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to false if no sibling has a Behinderung", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(false), kind(false)];
      });

      const ausgangslage = composeAusgangslage(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to true if any sibling has a Behinderung", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(true), kind(false)];
      });

      const ausgangslage = composeAusgangslage(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(true);
    });

    function kind(istBehindert: boolean) {
      return { istBehindert, geburtsdatum: new Date().toISOString() };
    }
  });
}
