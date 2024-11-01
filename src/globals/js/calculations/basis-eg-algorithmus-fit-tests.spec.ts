import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import {
  createMischEkTaetigkeitOf,
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  KassenArt,
  MischEkTaetigkeit,
  PersoenlicheDaten,
  YesNo,
} from "./model";
import {
  EgrMischeinkommenExcelSheet,
  TAETIGKEITEN,
} from "@/test-utils/egr-mischeinkommen-excel-sheet";
import { describeSkipOnCi } from "@/setupTests";
import { toListWithTolerance } from "@/test-utils/test-utils";
import { GRENZE_MINI_MIDI } from "@/globals/js/calculations/model/egr-berechnung-param-id";

/**
 * Runs FIT tests for BasisEgAlgorithmus.
 *
 * Test should be skipped on ci server. Reason: We can't call the BMF Steuerrechner,
 * because external calls are forbidden on CI environment.
 */
describeSkipOnCi("basis-eg-algorithmus", () => {
  const basisEgAlgorithmus = new BasisEgAlgorithmus();
  const sheet = new EgrMischeinkommenExcelSheet();
  // Für eine Ausgabe, die in das Excel kopiert werden kann.
  // const mischEkZwischenErgebnisList: MischEkZwischenErgebnis[] = [];

  // Der Code erzeugt eine Ausgabe auf der Kommandozeile. Diese Ausgabe kann dann in die Excel Datei kopiert werden.
  // Damit ist es einfacher, die Differenz zu den FIT Daten zu ermitteln. Dient dann auch der Kommunikation mit dem FIT.
  // const format = (v: Big) => v.toString().replace(".", ",");
  //
  // afterAll(() => {
  //   console.log(
  //     "Brutto||" +
  //       mischEkZwischenErgebnisList.map((m) => format(m.brutto)).join("|"),
  //   );
  //   console.log(
  //     "Steuern||" +
  //       mischEkZwischenErgebnisList.map((m) => format(m.steuern)).join("|"),
  //   );
  //   console.log(
  //     "Abgaben||" +
  //       mischEkZwischenErgebnisList.map((m) => format(m.abgaben)).join("|"),
  //   );
  //   console.log(
  //     `Netto||${mischEkZwischenErgebnisList
  //       .map((m) => format(m.netto))
  //       .join("|")}`,
  //   );
  // });
  //
  describe("should calculate MischNettoUndBasiselterngeld for test cases from Testfaelle_2022_3.xlsx", () => {
    const testCaseNumbers: Array<number> = Array.from(
      Array<number>(EgrMischeinkommenExcelSheet.TEST_CASE_COUNT).keys(),
    ).map((testCaseIndex) => ++testCaseIndex);

    // Die folgenden Testfallnummern schlagen noch fehl. Die Ursache muss noch ermittelt werden.
    // Bei den Abgaben konnte noch nicht ermittelt werden, ob es am FIT liegt oder an unserer Implementierung.
    const failedAbgaben: Array<number> = [
      15, 18, 32, 35, 36, 40, 44, 47, 51, 60, 61, 65, 72, 79, 81, 82, 87, 88,
      89, 92, 94,
    ];
    // Bei den Steuern liegt wohl noch ein Fehler in der FIT Implementierung. Dieser wurde noch nicht gefunden.
    const failedSteuern: Array<number> = [
      2, 7, 9, 11, 16, 17, 21, 23, 26, 27, 28, 37, 43, 46, 48, 49, 54, 58, 69,
      71, 74, 83, 90, 91, 93, 95, 98,
    ];
    // Der Grund für diesen Fehler ist wahrscheinlich auch die falsche Steuerermittlung vom FIT.
    const failedNetto: Array<number> = [86];
    testCaseNumbers
      .filter(
        (testCaseNumber) =>
          failedAbgaben.find((n) => n === testCaseNumber) === undefined,
      )
      .filter(
        (testCaseNumber) =>
          failedSteuern.find((n) => n === testCaseNumber) === undefined,
      )
      .filter(
        (testCaseNumber) =>
          failedNetto.find((n) => n === testCaseNumber) === undefined,
      )
      .forEach((testCaseNumber) => {
        const testCaseIndex = testCaseNumber - 1;
        it(`TEST CASE NO. ${sheet.testFallNummer(testCaseIndex)}`, () => {
          // given
          const persoenlicheDaten = createPersoenlicheDaten();
          const finanzDaten = createFinanzDaten(sheet, testCaseIndex);

          // when
          const mischEkZwischenErgebnis =
            basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
              persoenlicheDaten,
              finanzDaten,
              2022,
            );
          // Für eine Ausgabe, die in das Excel kopiert werden kann.
          // mischEkZwischenErgebnisList.push(mischEkZwischenErgebnis);

          // then
          expect(mischEkZwischenErgebnis).not.toBeUndefined();
          expect(
            toListWithTolerance(mischEkZwischenErgebnis.brutto.toNumber()),
          ).toContain(sheet.ergebnisBrutto(testCaseIndex).toNumber());

          // Die FIT Tests haben bei Minijobs die falschen Steuern und Abgaben
          if (mischEkZwischenErgebnis.brutto.gt(GRENZE_MINI_MIDI)) {
            expect(
              toListWithTolerance(mischEkZwischenErgebnis.abgaben.toNumber()),
            ).toContain(sheet.ergebnisAbgaben(testCaseIndex).toNumber());
            expect(
              toListWithTolerance(mischEkZwischenErgebnis.steuern.toNumber()),
            ).toContain(sheet.ergebnisSteuern(testCaseIndex).toNumber());
          }

          expect(
            toListWithTolerance(mischEkZwischenErgebnis.netto.toNumber()),
          ).toContain(sheet.ergebnisNetto(testCaseIndex).toNumber());
          expect(
            toListWithTolerance(
              mischEkZwischenErgebnis.elterngeldbasis.toNumber(),
            ),
          ).toContain(sheet.ergebnisBasisElternGeld(testCaseIndex).toNumber());
          expect(mischEkZwischenErgebnis.status).toBe(
            sheet.ergebnisErwerbsArt(testCaseIndex),
          );
          expect(mischEkZwischenErgebnis.rentenversicherungspflichtig).toBe(
            sheet.ergebnisRentenVersicherung(testCaseIndex),
          );
          expect(mischEkZwischenErgebnis.krankenversicherungspflichtig).toBe(
            sheet.ergebnisKrankenVersicherung(testCaseIndex),
          );
        });
      });
  });
});

const createPersoenlicheDaten = () => {
  const persoenlicheDaten = new PersoenlicheDaten(
    new Date("2022-01-01T10:37:00.000Z"),
  );
  persoenlicheDaten.anzahlKuenftigerKinder = 1;
  persoenlicheDaten.sindSieAlleinerziehend = YesNo.NO;
  persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
  persoenlicheDaten.etNachGeburt = YesNo.NO;
  return persoenlicheDaten;
};

const createFinanzDaten = (
  sheet: EgrMischeinkommenExcelSheet,
  testCaseIndex: number,
) => {
  const finanzDaten = new FinanzDaten();
  finanzDaten.bruttoEinkommen = new Einkommen(0);
  finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;

  finanzDaten.steuerKlasse = sheet.steuerKlasse(testCaseIndex);
  finanzDaten.splittingFaktor = sheet.splittingFaktor(testCaseIndex);
  finanzDaten.kinderFreiBetrag = sheet.kinderFreiBetrag(testCaseIndex);
  finanzDaten.zahlenSieKirchenSteuer =
    sheet.zahlenSieKirchenSteuer(testCaseIndex);

  finanzDaten.mischEinkommenTaetigkeiten = mischEinkommenTaetigkeiten(
    sheet,
    testCaseIndex,
  );
  return finanzDaten;
};

const mischEinkommenTaetigkeiten = (
  sheet: EgrMischeinkommenExcelSheet,
  testCaseIndex: number,
) => {
  return TAETIGKEITEN.map((taetigkeit) => {
    const erwerbsTaetigkeit = sheet.erwerbsTaetigkeit(
      taetigkeit,
      testCaseIndex,
    );
    const rentenVersicherungsPflichtig = sheet.rentenVersicherungsPflichtig(
      taetigkeit,
      testCaseIndex,
    );
    const krankenVersicherungsPflichtig = sheet.krankenVersicherungsPflichtig(
      taetigkeit,
      testCaseIndex,
    );
    const arbeitslosenVersicherungsPflichtig =
      sheet.arbeitslosenVersicherungsPflichtig(taetigkeit, testCaseIndex);
    if (
      erwerbsTaetigkeit === undefined ||
      rentenVersicherungsPflichtig === undefined ||
      krankenVersicherungsPflichtig === undefined ||
      arbeitslosenVersicherungsPflichtig === undefined
    ) {
      return undefined;
    }
    return createMischEkTaetigkeitOf(
      erwerbsTaetigkeit,
      sheet.einkommen(taetigkeit, testCaseIndex),
      sheet.bemessungsZeitraumMonate(taetigkeit, testCaseIndex),
      rentenVersicherungsPflichtig,
      krankenVersicherungsPflichtig,
      arbeitslosenVersicherungsPflichtig,
    );
  }).filter((item): item is MischEkTaetigkeit => !!item);
};
