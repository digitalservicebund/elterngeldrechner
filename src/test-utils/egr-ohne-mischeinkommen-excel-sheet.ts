import xlsx from "node-xlsx";
import {
  Einkommen,
  ElternGeldArt,
  KassenArt,
  kinderFreiBetragOfNumber,
  NettoEinkommen,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  steuerklasseOfNumber,
  YesNo,
} from "@/globals/js/calculations/model";
import {
  dateFromExcelSerial,
  elterngeldArtOf,
  erwerbsArtOf,
} from "@/test-utils/fit-excel-sheet-util";

export class EgrOhneMischeinkommenExcelSheet {
  static readonly TEST_CASE_COUNT = 60;
  private readonly sheet: { name: string; data: unknown[][] };

  constructor() {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}/resources/Testfaelle_010219.xlsx`,
    );
    this.sheet = workSheetsFromFile[1];
  }

  geburtsDatum(testCaseIndex: number) {
    const geburtsDatum = this.numberOf(testCaseIndex, GEBURTS_DATUM_OFFSET);
    if (geburtsDatum === undefined) {
      throw new Error(`geburtsDatum undefined`);
    }
    return dateFromExcelSerial(geburtsDatum);
  }

  erwerbsArt(testCaseIndex: number) {
    const status = this.numberOf(testCaseIndex, STATUS_OFFSET);
    return erwerbsArtOf(status);
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
      result.push(elterngeldArtOf(elterngeldArt));
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

  testFallNummer(testCaseIndex: number) {
    return this.stringOf(testCaseIndex, TEST_FALL_NUMMER_OFFSET);
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
const NETTO_VOR_GEBURT_OFFSET = 103;
const TEST_FALL_NUMMER_OFFSET = 116;

function columnOf(testCaseIndex: number) {
  if (testCaseIndex >= EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT) {
    throw new Error("testCaseIndex out of bound");
  }
  return testCaseIndex + TEST_DATA_COLUMN_OFFSET;
}
