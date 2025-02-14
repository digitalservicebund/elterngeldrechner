import { berechneMischNettoUndBasiselterngeld } from "./basis-eg-algorithmus";
import { nettoEinkommenZwischenErgebnis } from "./brutto-netto-rechner/brutto-netto-rechner";
import { elterngeldZwischenergebnis } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldDaten,
  ElternGeldPlusErgebnis,
  ErwerbsArt,
  MischEkZwischenErgebnis,
  finanzDatenOf,
} from "./model";
import { elterngeldPlusErgebnis } from "./plus-eg-algorithmus";

export function calculateElternGeld(
  elternGeldDaten: ElternGeldDaten,
): ElternGeldPlusErgebnis {
  const clonedElterngeldDaten = {
    persoenlicheDaten: structuredClone(elternGeldDaten.persoenlicheDaten),
    finanzDaten: finanzDatenOf(elternGeldDaten.finanzDaten),
    planungsDaten: elternGeldDaten.planungsDaten,
  };

  const zwischenErgebnisEinkommen = zwischenErgebnisEinkommenOf(
    clonedElterngeldDaten,
    clonedElterngeldDaten.persoenlicheDaten.wahrscheinlichesGeburtsDatum,
  );

  const zwischenErgebnis = elterngeldZwischenergebnis(
    clonedElterngeldDaten.persoenlicheDaten,
    zwischenErgebnisEinkommen.nettoEinkommen,
  );

  if (!clonedElterngeldDaten.persoenlicheDaten.hasEtNachGeburt) {
    clonedElterngeldDaten.finanzDaten.erwerbsZeitraumLebensMonatList = [];
  }

  if (
    clonedElterngeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0 &&
    zwischenErgebnisEinkommen.mischEkZwischenErgebnis === null
  ) {
    throw new Error("MischEinkommenEnabledButMissingMischEinkommen");
  }

  return elterngeldPlusErgebnis(
    clonedElterngeldDaten.planungsDaten,
    clonedElterngeldDaten.persoenlicheDaten,
    clonedElterngeldDaten.finanzDaten,
    zwischenErgebnisEinkommen.mischEkZwischenErgebnis,
    zwischenErgebnis,
  );
}

function zwischenErgebnisEinkommenOf(
  elternGeldDaten: ElternGeldDaten,
  geburtsdatumDesKindes: Date,
) {
  korrigiereErwerbsart(elternGeldDaten);

  const zwischenErgebnisEinkommen: ZwischenErgebnisEinkommen = {
    mischEkZwischenErgebnis: null,
    nettoEinkommen: new Einkommen(0),
  };
  if (elternGeldDaten.persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN) {
    if (
      elternGeldDaten.persoenlicheDaten.etVorGeburt ===
      ErwerbsArt.JA_MISCHEINKOMMEN
    ) {
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis =
        berechneMischNettoUndBasiselterngeld(
          elternGeldDaten.persoenlicheDaten,
          elternGeldDaten.finanzDaten,
        );
    } else {
      zwischenErgebnisEinkommen.nettoEinkommen = nettoEinkommenZwischenErgebnis(
        elternGeldDaten.finanzDaten,
        elternGeldDaten.persoenlicheDaten.etVorGeburt,
        geburtsdatumDesKindes,
      );
    }
  }
  return zwischenErgebnisEinkommen;
}

function korrigiereErwerbsart(elternGeldDaten: ElternGeldDaten) {
  // mischeinkommen löschen, falls welche vorhanden sind, der der Algorithmus
  if (
    elternGeldDaten.persoenlicheDaten.etVorGeburt !==
      ErwerbsArt.JA_MISCHEINKOMMEN &&
    elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0
  ) {
    elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten = [];
  }
}

interface ZwischenErgebnisEinkommen {
  mischEkZwischenErgebnis: MischEkZwischenErgebnis | null;
  nettoEinkommen: Einkommen;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("egr-calculation", async () => {
    const {
      ElternGeldArt,
      KassenArt,
      KinderFreiBetrag,
      PLANUNG_ANZAHL_MONATE,
      RentenArt,
      SteuerKlasse,
      ErwerbsTaetigkeit,
      MutterschaftsLeistung,
    } = await import("./model");

    describe("should calculate EgrErgebnis", () => {
      it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
        // given
        const planungsDaten = {
          mutterschaftsLeistung:
            MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
          planung: new Array(PLANUNG_ANZAHL_MONATE).fill(
            ElternGeldArt.ELTERNGELD_PLUS,
          ),
        };

        const persoenlicheDaten = {
          wahrscheinlichesGeburtsDatum: new Date("2022-11-25"),
          anzahlKuenftigerKinder: 1,
          etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          hasEtNachGeburt: true,
        };

        const finanzDaten = {
          ...ANY_FINANZDATEN,
          bruttoEinkommen: new Einkommen(2800),
          steuerKlasse: SteuerKlasse.SKL1,
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
          erwerbsZeitraumLebensMonatList: [
            {
              vonLebensMonat: 1,
              bisLebensMonat: 2,
              bruttoProMonat: new Einkommen(100),
            },
            {
              vonLebensMonat: 3,
              bisLebensMonat: 4,
              bruttoProMonat: new Einkommen(1000),
            },
            {
              vonLebensMonat: 5,
              bisLebensMonat: 6,
              bruttoProMonat: new Einkommen(5000),
            },
          ],
        };

        // when
        const ergebnis = calculateElternGeld({
          finanzDaten,
          persoenlicheDaten,
          planungsDaten,
        });

        // then
        expect(ergebnis.bruttoBasis).toBe(0);
        expect(ergebnis.nettoBasis).toBe(0);
        expect(ergebnis.elternGeldErwBasis).toBe(0);
        expect(ergebnis.bruttoPlus).toBe(1950);
        expect(ergebnis.nettoPlus).toBe(1350.09);
        expect(ergebnis.elternGeldEtPlus).toBe(279.82);
        expect(ergebnis.elternGeldKeineEtPlus).toBe(578.69);
      });

      it("Test with 'Erwerbstaetigkeit nach Geburt' 2", () => {
        // given
        const planungsDaten = {
          mutterschaftsLeistung:
            MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
          planung: new Array(PLANUNG_ANZAHL_MONATE).fill(
            ElternGeldArt.BASIS_ELTERNGELD,
          ),
        };

        const persoenlicheDaten = {
          wahrscheinlichesGeburtsDatum: new Date("2022-11-25"),
          anzahlKuenftigerKinder: 1,
          etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          hasEtNachGeburt: false,
        };

        const finanzDaten = {
          ...ANY_FINANZDATEN,
          bruttoEinkommen: new Einkommen(2100),
          steuerKlasse: SteuerKlasse.SKL4,
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
          erwerbsZeitraumLebensMonatList: [],
        };

        // when
        const ergebnis = calculateElternGeld({
          finanzDaten,
          persoenlicheDaten,
          planungsDaten,
        });

        // then
        expect(ergebnis.bruttoBasis).toBe(0);
        expect(ergebnis.nettoBasis).toBe(0);
        expect(ergebnis.elternGeldErwBasis).toBe(0);
        expect(ergebnis.bruttoPlus).toBe(0);
        expect(ergebnis.nettoPlus).toBe(0);
        expect(ergebnis.elternGeldEtPlus).toBe(0);
        expect(ergebnis.elternGeldKeineEtPlus).toBe(451.21);
      });
    });

    it("should always calculate the same result for the same inputs with Mischeinkommen", () => {
      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date(),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_MISCHEINKOMMEN,
      };

      const finanzDaten = {
        ...ANY_FINANZDATEN,
        mischEinkommenTaetigkeiten: [ANY_MISCHEINKOMMEN_TAETIGKEIT],
      };

      const planungsDaten = {
        mutterschaftsLeistung:
          MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
        planung: [ElternGeldArt.BASIS_ELTERNGELD],
      };

      const calculate = () =>
        calculateElternGeld({ persoenlicheDaten, finanzDaten, planungsDaten });

      expect(calculate()).toStrictEqual(calculate());
    });

    const ANY_FINANZDATEN = {
      bruttoEinkommen: new Einkommen(0),
      steuerKlasse: SteuerKlasse.SKL1,
      kinderFreiBetrag: KinderFreiBetrag.ZKF0,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    const ANY_MISCHEINKOMMEN_TAETIGKEIT = {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
      bruttoEinkommenDurchschnitt: 1000,
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: [],
    };
  });
}
