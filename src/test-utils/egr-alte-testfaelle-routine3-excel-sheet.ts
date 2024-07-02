import xlsx from "node-xlsx";
import Big from "big.js";
import { FitExcelSheetUtil } from "./fit-excel-sheet-util";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsZeitraumLebensMonat,
  KassenArt,
  kinderFreiBetragOfNumber,
  NettoEinkommen,
  PersoenlicheDaten,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  steuerklasseOfNumber,
  YesNo,
} from "@/globals/js/calculations/model";
import { MathUtil } from "@/globals/js/calculations/common/math-util";

export class EgrAlteTestfaelleRoutine3ExcelSheet {
  static TEST_CASE_COUNT = 60;
  private sheet: { name: string; data: unknown[][] };

  constructor() {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}/resources/Testfaelle_alte_Routine3.xlsx`,
    );
    this.sheet = workSheetsFromFile[0];
  }

  createPersoenlicheDaten(testCaseIndex: number) {
    const persoenlicheDaten = new PersoenlicheDaten(
      new Date("2022-01-01T10:37:00.000Z"),
    );
    persoenlicheDaten.sindSieAlleinerziehend = YesNo.YES;
    persoenlicheDaten.anzahlKuenftigerKinder = 1;
    persoenlicheDaten.wahrscheinlichesGeburtsDatum =
      this.geburtsDatum(testCaseIndex);
    persoenlicheDaten.etVorGeburt = this.erwerbsArt(testCaseIndex);
    persoenlicheDaten.etNachGeburt = YesNo.YES;
    return persoenlicheDaten;
  }

  geburtsDatum(testCaseIndex: number) {
    const geburtsDatum = this.numberOf(testCaseIndex, GEBURTS_DATUM_OFFSET);
    if (geburtsDatum === undefined) {
      throw new Error(`geburtsDatum ${geburtsDatum} undefined`);
    }
    return FitExcelSheetUtil.dateFromExcelSerial(geburtsDatum);
  }

  erwerbsArt(testCaseIndex: number) {
    const status = this.numberOf(testCaseIndex, STATUS_OFFSET);
    return FitExcelSheetUtil.erwerbsArtOf(status);
  }

  kirchenSteuer(testCaseIndex: number) {
    const kirchenSteuer = this.stringOf(testCaseIndex, KIRCHEN_STEUER_OFFSET);
    return kirchenSteuer === "zahlt Kirchensteuer" ? YesNo.YES : YesNo.NO;
  }

  steuerKlasse(testCaseIndex: number) {
    const steuerKlasse = this.numberOf(testCaseIndex, STEUER_KLASSE_OFFSET);
    return steuerklasseOfNumber(steuerKlasse);
  }

  splittingFaktor(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, SPLITTING_FAKTOR_OFFSET);
  }

  kinderFreiBetrag(testCaseIndex: number) {
    const kinderFreiBetragNumber = this.numberOf(
      testCaseIndex,
      KINDER_FREI_BETRAG_OFFSET,
    );
    const kinderFreiBetrag = kinderFreiBetragOfNumber(kinderFreiBetragNumber);
    if (kinderFreiBetrag === undefined) {
      throw new Error(
        `kinderFreiBetrag number ${kinderFreiBetragNumber} unknown`,
      );
    }
    return kinderFreiBetrag;
  }

  krankenVersicherung(testCaseIndex: number) {
    const kv = this.stringOf(testCaseIndex, KRANKEN_VERSICHERUNG_OFFSET);
    switch (kv) {
      case "Krankenversicherungspflichtig GKV":
        return KassenArt.GESETZLICH_PFLICHTVERSICHERT;
      case "freiwillig in der GKV versichert":
        return KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT;
      default:
        throw new Error(`krankenVersicherung ${kv} unknown`);
    }
  }

  rentenVersicherung(testCaseIndex: number) {
    const rv = this.stringOf(testCaseIndex, RENTEN_VERSICHERUNG_OFFSET);
    switch (rv) {
      case "Rentenversicherungspflichtig in der GRV":
        return RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
      case "nicht in der GRV":
        return RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG;
      default:
        throw new Error(`krankenVersicherung ${rv} unknown`);
    }
  }

  lebensmonateElterngeldArt(testCaseIndex: number) {
    const result: ElternGeldArt[] = [];
    for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      const elterngeldArt = this.stringOf(
        testCaseIndex,
        ELTERNGELD_ART_OFFSET + i,
      );
      result.push(FitExcelSheetUtil.elterngeldArtOf(elterngeldArt));
    }
    return result;
  }

  nettoVorGeburt(testCaseIndex: number): NettoEinkommen {
    const nettoVorGeburt = this.numberOf(
      testCaseIndex,
      NETTO_VOR_GEBURT_OFFSET,
    );
    return new Einkommen(nettoVorGeburt);
  }

  erwerbsZeitraumLebensMonatList(testCaseIndex: number) {
    const erwerbszeitraeumeLM: ErwerbsZeitraumLebensMonat[] = [];
    for (
      let lebensMonat = 1;
      lebensMonat <= PLANUNG_ANZAHL_MONATE;
      lebensMonat++
    ) {
      const lebensmonatBrutto = this.lebensmonatBrutto(
        testCaseIndex,
        lebensMonat,
      );
      const erwerbszeitraumLM = new ErwerbsZeitraumLebensMonat();
      erwerbszeitraumLM.vonLebensMonat = lebensMonat;
      erwerbszeitraumLM.bisLebensMonat = lebensMonat;
      erwerbszeitraumLM.bruttoProMonat = new Einkommen(lebensmonatBrutto);
      erwerbszeitraeumeLM.push(erwerbszeitraumLM);
    }
    return erwerbszeitraeumeLM;
  }

  lebensmonatBrutto(testCaseIndex: number, lebensMonat: number) {
    return new Big(
      this.numberOf(
        testCaseIndex,
        LEBENSMONAT_1_BRUTTO_OFFSET + lebensMonat - 1,
      ),
    );
  }

  testFallNummer(testCaseIndex: number) {
    return this.stringOf(testCaseIndex, TEST_FALL_NUMMER_OFFSET);
  }

  zwischenErgebnisNettoVorGeburt(testCaseIndex: number) {
    return this.numberOf(
      testCaseIndex,
      ZWISCHEN_ERGEBNIS_NETTO_VOR_GEBURT_OFFSET,
    );
  }

  zwischenErgebnisElternGeld(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, ZWISCHEN_ERGEBNIS_ELTERN_GELD);
  }

  zwischenErgebnisErsatzRate(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, ZWISCHEN_ERGEBNIS_ERSATZ_RATE);
  }

  zwischenErgebnisErsatzRateProzent(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, ZWISCHEN_ERGEBNIS_ERSATZ_RATE_PROZENT);
  }

  zwischenErgebnisGeschwisterBonus(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, ZWISCHEN_ERGEBNIS_GESCHWISTER_BONUS);
  }

  zwischenErgebnisMehrlingsZulage(testCaseIndex: number) {
    return this.numberOf(testCaseIndex, ZWISCHEN_ERGEBNIS_MEHRLINGS_ZULAGE);
  }

  zwischenErgebnisZeitraumGeschwisterBonus(testCaseIndex: number) {
    const zeitraumGeschwisterBonus = this.numberOf(
      testCaseIndex,
      ZWISCHEN_ERGEBNIS_ZEITRAUM_GESCHWISTER_BONUS,
    );
    if (zeitraumGeschwisterBonus === undefined) {
      throw new Error(
        `zeitraumGeschwisterBonus ${zeitraumGeschwisterBonus} undefined`,
      );
    }
    return FitExcelSheetUtil.dateFromExcelSerial(zeitraumGeschwisterBonus);
  }

  ergebnisBruttoBasisImBezugsZeitraumDurchschnitt(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_BRUTTO_BASIS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET,
      ),
    );
  }

  ergebnisNettoBasisImBezugsZeitraumDurchschnitt(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_NETTO_BASIS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET,
      ),
    );
  }

  ergebnisElterngeldBasisFuerMonateMitErwerbsTaetigkeit(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_ELTERNGELD_BASIS_FUER_MONATE_MIT_ERWERBS_TAETIGKEIT_OFFSET,
      ),
    );
  }

  ergebnisBruttoPlusImBezugsZeitraumDurchschnitt(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_BRUTTO_PLUS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET,
      ),
    );
  }

  ergebnisNettoPlusImBezugsZeitraumDurchschnitt(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_NETTO_PLUS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET,
      ),
    );
  }

  ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_ELTERNGELD_PLUS_FUER_MONATE_MIT_ERWERBS_TAETIGKEIT_OFFSET,
      ),
    );
  }

  ergebnisElterngeldPlusFuerMonateOhneErwerbsTaetigkeit(testCaseIndex: number) {
    return this.round(
      this.numberOf(
        testCaseIndex,
        ERGEBNIS_ELTERNGELD_PLUS_FUER_MONATE_OHNE_ERWERBS_TAETIGKEIT_OFFSET,
      ),
    );
  }

  round(value: number): number {
    return MathUtil.round(new Big(value)).toNumber();
  }

  numberOf(testCaseIndex: number, rowIndex: number) {
    return this.valueOf(testCaseIndex, rowIndex) as number;
  }

  stringOf(testCaseIndex: number, rowIndex: number) {
    return this.valueOf(testCaseIndex, rowIndex) as string;
  }

  valueOf(testCaseIndex: number, rowIndex: number) {
    return this.sheet.data[rowIndex][columnOf(testCaseIndex)];
  }
}

const TEST_DATA_COLUMN_OFFSET = 1;
const GEBURTS_DATUM_OFFSET = 0;
const STATUS_OFFSET = 1;
const KIRCHEN_STEUER_OFFSET = 2;
const STEUER_KLASSE_OFFSET = 3;
const SPLITTING_FAKTOR_OFFSET = 4;
const KINDER_FREI_BETRAG_OFFSET = 5;
const KRANKEN_VERSICHERUNG_OFFSET = 6;
const RENTEN_VERSICHERUNG_OFFSET = 7;
const ELTERNGELD_ART_OFFSET = 8;
const LEBENSMONAT_1_BRUTTO_OFFSET = 54;
const NETTO_VOR_GEBURT_OFFSET = 100;
const ERGEBNIS_AUS_ALTEM_RECHNER = 37;
const ERGEBNIS_BRUTTO_BASIS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET =
  101 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_NETTO_BASIS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET =
  102 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_ELTERNGELD_BASIS_FUER_MONATE_MIT_ERWERBS_TAETIGKEIT_OFFSET =
  103 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_BRUTTO_PLUS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET =
  104 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_NETTO_PLUS_IM_BEZUGS_ZEITRAUM_DURCHSCHNITT_OFFSET =
  105 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_ELTERNGELD_PLUS_FUER_MONATE_MIT_ERWERBS_TAETIGKEIT_OFFSET =
  106 + ERGEBNIS_AUS_ALTEM_RECHNER;
const ERGEBNIS_ELTERNGELD_PLUS_FUER_MONATE_OHNE_ERWERBS_TAETIGKEIT_OFFSET =
  107 + ERGEBNIS_AUS_ALTEM_RECHNER;
const TEST_FALL_NUMMER_OFFSET = 119;
const ZWISCHEN_ERGEBNIS_NETTO_VOR_GEBURT_OFFSET = 130;
const ZWISCHEN_ERGEBNIS_ELTERN_GELD = 131;
const ZWISCHEN_ERGEBNIS_ERSATZ_RATE = 132;
const ZWISCHEN_ERGEBNIS_ERSATZ_RATE_PROZENT = 133;
const ZWISCHEN_ERGEBNIS_GESCHWISTER_BONUS = 134;
const ZWISCHEN_ERGEBNIS_MEHRLINGS_ZULAGE = 135;
const ZWISCHEN_ERGEBNIS_ZEITRAUM_GESCHWISTER_BONUS = 136;

function columnOf(testCaseIndex: number) {
  if (testCaseIndex >= EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT) {
    throw new Error("testCaseIndex out of bound");
  }
  return testCaseIndex + TEST_DATA_COLUMN_OFFSET;
}
