import xlsx from "node-xlsx";
import {
  ErwerbsTaetigkeit,
  kinderFreiBetragOfNumber,
  steuerklasseOfNumber,
} from "@/elterngeldrechner/model";
import { erwerbsArtOf } from "@/test-utils/fit-excel-sheet-util";

type Taetigkeit = 0 | 1 | 2;
export const TAETIGKEITEN: Taetigkeit[] = [0, 1, 2];

export class EgrMischeinkommenExcelSheet {
  static readonly TEST_CASE_COUNT = 100;
  private readonly sheet: { name: string; data: unknown[][] };

  constructor() {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}/resources/Testfaelle_2022_3.xlsx`,
    );
    this.sheet = workSheetsFromFile[0]!;
  }

  einkommen(taetigkeit: Taetigkeit, testCaseIndex: number): number {
    return (
      (this.sheet.data[rowOfEinkommen(taetigkeit)]?.[
        columnOf(testCaseIndex)
      ] as number) ?? 0
    );
  }

  erwerbsTaetigkeit(taetigkeit: Taetigkeit, testCaseIndex: number) {
    switch (this.erwerbsTaetigkeitString(taetigkeit, testCaseIndex)) {
      case "Selbständig":
        return ErwerbsTaetigkeit.SELBSTSTAENDIG;
      case "Nichtselbständig":
        return ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG;
      case "Nichtselbständig - Minijob":
        return ErwerbsTaetigkeit.MINIJOB;
    }
    return undefined;
  }

  private erwerbsTaetigkeitString(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ) {
    return this.sheet.data[rowOfErwerbsTaetigkeit(taetigkeit)]?.[
      columnOf(testCaseIndex)
    ] as string;
  }

  bemessungsZeitraumMonate(taetigkeit: Taetigkeit, testCaseIndex: number) {
    const bemessungsZeitraumMonate: boolean[] = [];
    for (let monatIndex = 0; monatIndex < 12; monatIndex++) {
      bemessungsZeitraumMonate.push(
        this.bemessungsZeitraumMonat(taetigkeit, testCaseIndex, monatIndex),
      );
    }
    return bemessungsZeitraumMonate;
  }

  private bemessungsZeitraumMonat(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
    monatIndex: number,
  ) {
    return (
      this.sheet.data[rowOfBemessungsZeitraumMonate(taetigkeit, monatIndex)]?.[
        columnOf(testCaseIndex)
      ] === "x"
    );
  }

  rentenVersicherungsPflichtig(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ): boolean | undefined {
    return convertJaNeinToBooleanUndefined(
      this.rentenVersicherungsPflichtigString(taetigkeit, testCaseIndex),
    );
  }

  private rentenVersicherungsPflichtigString(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ) {
    return this.sheet.data[rowOfRentenVersicherungsPflichtig(taetigkeit)]?.[
      columnOf(testCaseIndex)
    ] as string;
  }

  krankenVersicherungsPflichtig(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ): boolean | undefined {
    return convertJaNeinToBooleanUndefined(
      this.krankenVersicherungsPflichtigString(taetigkeit, testCaseIndex),
    );
  }

  private krankenVersicherungsPflichtigString(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ) {
    return this.sheet.data[rowOfKrankenVersicherungsPflichtig(taetigkeit)]?.[
      columnOf(testCaseIndex)
    ] as string;
  }

  arbeitslosenVersicherungsPflichtig(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ): boolean | undefined {
    return convertJaNeinToBooleanUndefined(
      this.arbeitslosenVersicherungsPflichtigString(taetigkeit, testCaseIndex),
    );
  }

  private arbeitslosenVersicherungsPflichtigString(
    taetigkeit: Taetigkeit,
    testCaseIndex: number,
  ) {
    return this.sheet.data[
      rowOfArbeitslosenVersicherungsPflichtig(taetigkeit)
    ]?.[columnOf(testCaseIndex)] as string;
  }

  testFallNummer(testCaseIndex: number) {
    return this.sheet.data[TEST_FALL_NUMMER_OFFSET]?.[
      columnOf(testCaseIndex)
    ] as string;
  }

  zahlenSieKirchenSteuer(testCaseIndex: number): boolean {
    const zahlenSieKirchenSteuer =
      this.sheet.data[ZAHLEN_SIE_KIRCHEN_STEUER_OFFSET]?.[
        columnOf(testCaseIndex)
      ];
    return zahlenSieKirchenSteuer === "zahlt Kirchensteuer";
  }

  steuerKlasse(testCaseIndex: number) {
    const steuerKlasse = this.sheet.data[STEUER_KLASSE_OFFSET]?.[
      columnOf(testCaseIndex)
    ] as number;
    return steuerklasseOfNumber(steuerKlasse);
  }

  splittingFaktor(testCaseIndex: number) {
    return this.sheet.data[SPLITTING_FAKTOR_OFFSET]?.[
      columnOf(testCaseIndex)
    ] as number;
  }

  kinderFreiBetrag(testCaseIndex: number) {
    const kinderFreiBetragNumber = this.sheet.data[KINDER_FREI_BETRAG_OFFSET]?.[
      columnOf(testCaseIndex)
    ] as number;
    const kinderFreiBetrag = kinderFreiBetragOfNumber(kinderFreiBetragNumber);
    if (kinderFreiBetrag === undefined) {
      throw new Error(
        `kinderFreiBetrag number ${kinderFreiBetragNumber} unknown`,
      );
    }
    return kinderFreiBetrag;
  }

  ergebnisBrutto(testCaseIndex: number): number {
    return (
      (this.sheet.data[BRUTTO_OFFSET]?.[columnOf(testCaseIndex)] as number) ?? 0
    );
  }

  ergebnisSteuern(testCaseIndex: number): number {
    return (
      (this.sheet.data[STEUERN_OFFSET]?.[columnOf(testCaseIndex)] as number) ??
      0
    );
  }

  ergebnisAbgaben(testCaseIndex: number): number {
    return (
      (this.sheet.data[ABGABEN_OFFSET]?.[columnOf(testCaseIndex)] as number) ??
      0
    );
  }

  ergebnisNetto(testCaseIndex: number): number {
    return (
      (this.sheet.data[NETTO_OFFSET]?.[columnOf(testCaseIndex)] as number) ?? 0
    );
  }

  ergebnisBasisElternGeld(testCaseIndex: number): number {
    return (
      (this.sheet.data[BASIS_ELTERN_GELD_OFFSET]?.[
        columnOf(testCaseIndex)
      ] as number) ?? 0
    );
  }

  ergebnisKrankenVersicherung(testCaseIndex: number) {
    const kv = this.sheet.data[KV_OFFSET]?.[columnOf(testCaseIndex)];
    return kv === "Krankenversicherungspflichtig GKV";
  }

  ergebnisRentenVersicherung(testCaseIndex: number) {
    const rv = this.sheet.data[RV_OFFSET]?.[columnOf(testCaseIndex)];
    return rv === "Rentenversicherungspflichtig in der GRV";
  }

  ergebnisErwerbsArt(testCaseIndex: number) {
    const ergebnisStatus = this.sheet.data[STATUS_OFFSET]?.[
      columnOf(testCaseIndex)
    ] as number;
    return erwerbsArtOf(ergebnisStatus);
  }
}

const TEST_DATA_COLUMN_OFFSET = 2;
const ERWERBS_TAETIGKEIT_OFFSET = 1;
const ERWERBS_TAETIGKEIT_FACTOR = 2;
const BEMESSUNGS_ZEITRAUM_MONATE_OFFSET = 6;
const BEMESSUNGS_ZEITRAUM_MONATE_FACTOR = 12;
const RENTEN_VERSICHERUNGS_PFLICHTIG_OFFSET = 42;
const RENTEN_VERSICHERUNGS_PFLICHTIG_FACTOR = 3;
const KRANKEN_VERSICHERUNGS_PFLICHTIG_OFFSET = 43;
const KRANKEN_VERSICHERUNGS_PFLICHTIG_FACTOR = 3;
const ARBEITSLOSEN_VERSICHERUNGS_PFLICHTIG_OFFSET = 44;
const ARBEITSLOSEN_VERSICHERUNGS_PFLICHTIG_FACTOR = 3;
const STEUER_KLASSE_OFFSET = 51;
const SPLITTING_FAKTOR_OFFSET = 52;
const KINDER_FREI_BETRAG_OFFSET = 53;
const ZAHLEN_SIE_KIRCHEN_STEUER_OFFSET = 54;
const BRUTTO_OFFSET = 55;
const STEUERN_OFFSET = 56;
const ABGABEN_OFFSET = 57;
const NETTO_OFFSET = 58;
const BASIS_ELTERN_GELD_OFFSET = 59;
const KV_OFFSET = 60;
const RV_OFFSET = 61;
const STATUS_OFFSET = 62;
const TEST_FALL_NUMMER_OFFSET = 171;

function rowOfEinkommen(taetigkeit: Taetigkeit) {
  return taetigkeit * ERWERBS_TAETIGKEIT_FACTOR;
}

function rowOfErwerbsTaetigkeit(taetigkeit: Taetigkeit) {
  return taetigkeit * ERWERBS_TAETIGKEIT_FACTOR + ERWERBS_TAETIGKEIT_OFFSET;
}

function rowOfBemessungsZeitraumMonate(
  taetigkeit: Taetigkeit,
  monatIndex: number,
) {
  return (
    taetigkeit * BEMESSUNGS_ZEITRAUM_MONATE_FACTOR +
    BEMESSUNGS_ZEITRAUM_MONATE_OFFSET +
    monatIndex
  );
}

function rowOfRentenVersicherungsPflichtig(taetigkeit: Taetigkeit) {
  return (
    taetigkeit * RENTEN_VERSICHERUNGS_PFLICHTIG_FACTOR +
    RENTEN_VERSICHERUNGS_PFLICHTIG_OFFSET
  );
}

function rowOfKrankenVersicherungsPflichtig(taetigkeit: Taetigkeit) {
  return (
    taetigkeit * KRANKEN_VERSICHERUNGS_PFLICHTIG_FACTOR +
    KRANKEN_VERSICHERUNGS_PFLICHTIG_OFFSET
  );
}

function rowOfArbeitslosenVersicherungsPflichtig(taetigkeit: Taetigkeit) {
  return (
    taetigkeit * ARBEITSLOSEN_VERSICHERUNGS_PFLICHTIG_FACTOR +
    ARBEITSLOSEN_VERSICHERUNGS_PFLICHTIG_OFFSET
  );
}

function columnOf(testCaseIndex: number) {
  if (testCaseIndex >= EgrMischeinkommenExcelSheet.TEST_CASE_COUNT) {
    throw new Error("testCaseIndex out of bound");
  }
  return testCaseIndex + TEST_DATA_COLUMN_OFFSET;
}

function convertJaNeinToBooleanUndefined(jaNein: string): boolean | undefined {
  switch (jaNein) {
    case "Nein":
      return false;
    case "Ja":
      return true;
  }
  return undefined;
}
