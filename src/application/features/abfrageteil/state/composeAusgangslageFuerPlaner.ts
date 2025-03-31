import { YesNo } from "./YesNo";
import { stepNachwuchsSelectors } from "./stepNachwuchsSlice";
import { type RootState } from "@/application/redux";
import { type Ausgangslage, Elternteil } from "@/monatsplaner";

export function composeAusgangslageFuerPlaner(state: RootState): Ausgangslage {
  const { stepAllgemeineAngaben, stepNachwuchs, stepErwerbstaetigkeit } = state;

  const anzahlElternteile =
    stepAllgemeineAngaben.antragstellende === "EinenElternteil"
      ? (1 as const)
      : (2 as const);

  const geburtsdatumDesKindes =
    stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum(state);

  const istAlleinerziehend = yesNoToBoolean(
    stepAllgemeineAngaben.alleinerziehend,
  );

  const hatBehindertesGeschwisterkind = stepNachwuchs.geschwisterkinder.some(
    (kind) => kind.istBehindert,
  );

  const sindMehrlinge = stepNachwuchs.anzahlKuenftigerKinder > 1;

  const letzterLebensmonatMitSchutz = sindMehrlinge
    ? (3 as const)
    : (2 as const);

  const mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum =
    yesNoToBoolean(stepErwerbstaetigkeit.ET1.vorGeburt) ||
    yesNoToBoolean(stepErwerbstaetigkeit.ET2.vorGeburt);

  const sharedAusganslageProperties = {
    geburtsdatumDesKindes,
    hatBehindertesGeschwisterkind,
    sindMehrlinge,
    mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
  };

  switch (anzahlElternteile) {
    case 1: {
      const informationenZumMutterschutz =
        stepAllgemeineAngaben.mutterschutz === "ET1"
          ? {
              empfaenger: Elternteil.Eins as const,
              letzterLebensmonatMitSchutz,
            }
          : undefined;

      return {
        ...sharedAusganslageProperties,
        anzahlElternteile,
        informationenZumMutterschutz,
        istAlleinerziehend,
      };
    }

    case 2: {
      const pseudonyme = getPseudonymeFuerAlleElternteile(
        stepAllgemeineAngaben.pseudonym,
      );
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: pseudonyme[Elternteil.Eins],
        [Elternteil.Zwei]: pseudonyme[Elternteil.Zwei],
      };
      let empfaenger;
      switch (stepAllgemeineAngaben.mutterschutz) {
        case "ET1": {
          empfaenger = Elternteil.Eins;
          break;
        }
        case "ET2": {
          empfaenger = Elternteil.Zwei;
          break;
        }
      }
      const informationenZumMutterschutz = empfaenger
        ? { empfaenger, letzterLebensmonatMitSchutz }
        : undefined;

      return {
        ...sharedAusganslageProperties,
        anzahlElternteile,
        pseudonymeDerElternteile,
        informationenZumMutterschutz,
        istAlleinerziehend: false,
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
    [Elternteil.Eins]: ET1 || "Elternteil 1",
    [Elternteil.Zwei]: ET2 || "Elternteil 2",
  };
}

function yesNoToBoolean(value: YesNo | null): boolean {
  switch (value) {
    case YesNo.YES:
      return true;
    case YesNo.NO:
    case null:
      return false;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Ausgangslage selector", async () => {
    const { produce } = await import("immer");
    const { INITIAL_STATE } = await import("@/application/test-utils");

    describe("anzahl der Elternteile", () => {
      it("creates Ausgangslage for one Elternteil if Antragstellende is answered with Einen Elternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.anzahlElternteile).toBe(1);
      });

      it("creates Ausgangslage for two Elternteil if Antragstellende is answered with Für Beide", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.anzahlElternteile).toBe(2);
      });
    });

    describe("Pseudonyme der Elternteile", () => {
      it("assigns the correct Pseudonyme for two Elternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.pseudonym = { ET1: "Jane", ET2: "John" };
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const { pseudonymeDerElternteile } =
          composeAusgangslageFuerPlaner(state);

        expect(pseudonymeDerElternteile?.[Elternteil.Eins]).toBe("Jane");
        expect(pseudonymeDerElternteile?.[Elternteil.Zwei]).toBe("John");
      });

      it("uses default Pseudonyme if kept empty", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.pseudonym = { ET1: "", ET2: "" };
          draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        });

        const { pseudonymeDerElternteile } =
          composeAusgangslageFuerPlaner(state);

        expect(pseudonymeDerElternteile?.[Elternteil.Eins]).toBe(
          "Elternteil 1",
        );
        expect(pseudonymeDerElternteile?.[Elternteil.Zwei]).toBe(
          "Elternteil 2",
        );
      });
    });

    describe("Geburtsdatum des Kindes", () => {
      it("takes the parsed Geburtsdatum from the store", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "21.12.2013";
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date("2013-12-21"),
        );
      });
    });

    describe("mutterschutz", () => {
      it("is undefined if Mutterschutz answered with No", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.mutterschutz = YesNo.NO;
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.informationenZumMutterschutz).toBeUndefined();
      });

      it("automatically sets the Empfänger to Elternteil 1 for Antragstellende Einen Elternteil and Mutterschutz Yes", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
          draft.stepAllgemeineAngaben.mutterschutz = "ET1";
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

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
            draft.stepAllgemeineAngaben.mutterschutz = answered;
          });

          const ausgangslage = composeAusgangslageFuerPlaner(state);

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
            draft.stepAllgemeineAngaben.mutterschutz = "ET1";
            draft.stepNachwuchs.anzahlKuenftigerKinder = anzahlKuenftigerKinder;
          });

          const ausgangslage = composeAusgangslageFuerPlaner(state);

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
          draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
          draft.stepAllgemeineAngaben.alleinerziehend = answer;
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.istAlleinerziehend).toBe(expected);
      },
    );

    it("sets alleinerziehend always to false for two Elternteile", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "FuerBeide";
        draft.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;
      });

      const ausgangslage = composeAusgangslageFuerPlaner(state);

      expect(ausgangslage.istAlleinerziehend).toBe(false);
    });

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

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(ausgangslage.sindMehrlinge).toBe(sindMehrlinge);
      },
    );

    it("sets behindertes Geschwisterkind flag to false if there are no sibligs", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [];
      });

      const ausgangslage = composeAusgangslageFuerPlaner(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to false if no sibling has a Behinderung", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(false), kind(false)];
      });

      const ausgangslage = composeAusgangslageFuerPlaner(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(false);
    });

    it("sets behindertes Geschwisterkind flag to true if any sibling has a Behinderung", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.geschwisterkinder = [kind(true), kind(false)];
      });

      const ausgangslage = composeAusgangslageFuerPlaner(state);

      expect(ausgangslage.hatBehindertesGeschwisterkind).toBe(true);
    });

    describe("mindestens ein Elternteil war erwerbstätig im Bemessungszeitraum property", () => {
      it("sets it to false both Elternteile answered no", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepErwerbstaetigkeit.ET1.vorGeburt = YesNo.NO;
          draft.stepErwerbstaetigkeit.ET2.vorGeburt = YesNo.NO;
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toBe(false);
      });

      it.each([
        { ET1: YesNo.YES, ET2: YesNo.NO },
        { ET1: YesNo.NO, ET2: YesNo.YES },
        { ET1: YesNo.YES, ET2: YesNo.YES },
      ])("sets it to true if any Elternteil answered yes", ({ ET1, ET2 }) => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepErwerbstaetigkeit.ET1.vorGeburt = ET1;
          draft.stepErwerbstaetigkeit.ET2.vorGeburt = ET2;
        });

        const ausgangslage = composeAusgangslageFuerPlaner(state);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toBe(true);
      });
    });

    function kind(istBehindert: boolean) {
      return { istBehindert, geburtsdatum: new Date().toISOString() };
    }
  });
}
