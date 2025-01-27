import {
  type Arbitrary,
  array as arbitraryArray,
  assert as assertProperty,
  boolean as arbitraryBoolean,
  constant as arbitraryConstant,
  constantFrom as arbitraryConstantFrom,
  date as arbitraryDate,
  integer as arbitraryInteger,
  property,
  record as arbitraryRecord,
  tuple as arbitraryTuple,
} from "fast-check";
import { assert, describe, expect, it } from "vitest";
import { minusDays } from "./common/date-util";
import { calculateElternGeld } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldAusgabe,
  type ElternGeldDaten,
  type ElternGeldPlusErgebnis,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  type ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KassenArt,
  type Kind,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  MutterschaftsLeistung,
  PersoenlicheDaten,
  PlanungsDaten,
  RentenArt,
  SteuerKlasse,
} from "./model";
import {
  Big,
  EgrCalculation as OriginalEgrCalculation,
  Einkommen as OriginalEinkommen,
  type ElternGeldAusgabe as OriginalElternGeldAusgabe,
  type ElternGeldPlusErgebnis as OriginalElternGeldPlusErgebnis,
  ErwerbsZeitraumLebensMonat as OriginalErwerbsZeitraumLebensMonat,
  FinanzDaten as OriginalFinanzDaten,
  type Kind as OriginalKind,
  type Lohnsteuerjahr as OriginalLohnsteuerjahr,
  MischEkTaetigkeit as OriginalMischEkTaetigkeit,
  PersoenlicheDaten as OriginalPersoenlicheDaten,
  PlanungsDaten as OriginalPlanungsDaten,
  UnterstuetzteLohnsteuerjahre as OriginalUnterstuetzteLohnsteuerjahre,
  YesNo,
} from "original-rechner";

/**
 * The test coverage for the Elterngeld calculation is spare, incomplete and of
 * low quality. This makes it incredibly hard to touch the code without the
 * paralyzing fear to break anything unnoticed.
 * Therefore, these property tests create a remedy. Having a copy of the
 * "original"/legacy calculation (the last state of untouched code), the tested
 * main property is stupid simple: the refactored code should always calculate
 * the exact same result.
 *
 * This does not improve the test coverage from the perspective of a truly
 * correct calculation. But it allows to do certain kind of refactorings without
 * changing the output. That value can not be underestimated.
 * Anyhow, this approach has some limits. Despite calling the two algorithms for
 * comparison, the test has two important tasks. Generating arbitrary input data
 * and compare the output data of both algorithms.
 *
 * The arbitrary input data SHOULD be generated as much as possible using primitive
 * types (raw). These then become composed and mapped to the actual input data
 * types for the algorithms. This is partially necessary to satisfy the type
 * system (class instances) in general, but also required to allow input data
 * refactoring. The composition and mapping logic must be as trivial as possible
 * to prevent undetected mistakes.
 * Arbitrary input data MUST be always be generated in full circumference to
 * satisfy the original codes interface. The refactoring CAN always easily
 * ignore/remove any input data securely. Anyhow, mutating the input schema MUST
 * be done with great care, following the rules of trivial composition above.
 * There MUST be no logic that tries to resolve cross input data relationships.
 * Such relationships are a flaw of the original algorithm and should not be
 * compensated for, introducing security holes into this test.
 * The input data SHOULD be as dump and arbitrary as possible. Though, it might
 * make sense to limit certain arbitrary factors to the range or realistic data
 * (e.g. 10.000.000 expected children). This helps to keep the number of
 * test runs more focused on "meaningful" cases. This is especially the case
 * having the lack of proper type-driven interface design.
 *
 * The output data MUST be compared in the most reliable way possible. In best
 * case it SHOULD NOT transform the output data at all to avoid unrefracting
 * issues. Also output comparison MUST be done with great care. Rely on provided
 * expectation/assertion statements where possible.
 *
 * In case there is the same "thing" (usually a class) that is called the same
 * between both algorithm, but is no more the same or can't be the same for the
 * type-system, the types of the original calculation get an alias name with
 * `original` as prefix. The same goes for data transformation functions which
 * act on these types. For simplicity, any other type (including the same named
 * types in the refactored code) remain as they are.
 *
 * The number of runs (`numRuns`) SHOULD be adapted during actual refactoring
 * work to improve the feedback significance or to shorten feedback cycles. In
 * the end, a refactoring MUST be verified using a high number of runs to gain
 * enough confidence (e.g. 100.000 runs, which takes about 7 minutes). The
 * default is a sensitive value to ensure the tests can always run with the rest
 * of the test suite. This avoids making it a special slow test case that gets
 * sometimes skipped, opening a window for unintended breaks.
 */
describe("tests to verify properties during refactoring", () => {
  it(
    "calculates the same result the original/legacy implementation",
    { timeout: 40_000 },
    () => {
      assertProperty(
        property(
          arbitraryPersoenlicheDatenRaw(),
          arbitraryFinanzdatenRaw(),
          arbitraryPlanungsdatenRaw(),
          arbitraryLohnsteuerjahr(),
          (
            persoenlicheDatenRaw,
            finanzdatenRaw,
            planungsdatenRaw,
            lohnsteuerjahr,
          ) => {
            const elterngelddaten = {
              persoenlicheDaten: persoenlicheDatenFrom(persoenlicheDatenRaw),
              finanzDaten: finanzDatenFrom(finanzdatenRaw),
              planungsDaten: planungsDatenFrom(planungsdatenRaw),
            };

            const result = calculateElternGeld(elterngelddaten, lohnsteuerjahr);

            const originalResult =
              new OriginalEgrCalculation().calculateElternGeld(
                {
                  persoenlicheDaten:
                    originalPersoenlicheDatenFrom(persoenlicheDatenRaw),
                  finanzDaten: originalFinanzDatenFrom(finanzdatenRaw),
                  planungsDaten: originalPlanungsDatenFrom(planungsdatenRaw),
                },
                lohnsteuerjahr,
              );

            return expectCalculatedResultToEqual(
              result,
              originalResult,
              elterngelddaten,
            );
          },
        ),
        { numRuns: 4000, endOnFailure: true },
      );
    },
  );
});

function expectCalculatedResultToEqual(
  actual: ElternGeldPlusErgebnis,
  expected: OriginalElternGeldPlusErgebnis,
  context: ElternGeldDaten,
): void {
  expectAllElterngeldausgabenToMatch(
    actual.elternGeldAusgabe,
    expected.elternGeldAusgabe,
  );
  expect(actual.ersatzRate).toEqual(expected.ersatzRate.toNumber());
  expectGeschwisterbonusDeadlineToMatch(
    actual.geschwisterBonusDeadLine,
    expected.geschwisterBonusDeadLine,
    context,
  );
  expect(actual.geschwisterBonus).toBeCloseTo(
    expected.geschwisterBonus.toNumber(),
    1,
  );
  expect(actual.mehrlingsZulage).toBeCloseTo(
    expected.mehrlingsZulage.toNumber(),
    1,
  );
  expect(actual.bruttoBasis).toBeCloseTo(expected.bruttoBasis.toNumber(), 1);
  expect(actual.nettoBasis).toBeCloseTo(expected.nettoBasis.toNumber(), 1);
  expect(actual.elternGeldBasis).toBeCloseTo(
    expected.elternGeldBasis.toNumber(),
    1,
  );
  expect(actual.elternGeldErwBasis).toBeCloseTo(
    expected.elternGeldErwBasis.toNumber(),
    1,
  );
  expect(actual.bruttoPlus).toBeCloseTo(expected.bruttoPlus.toNumber(), 1);
  expect(actual.nettoPlus).toBeCloseTo(expected.nettoPlus.toNumber(), 1);
  expect(actual.elternGeldEtPlus).toBeCloseTo(
    expected.elternGeldEtPlus.toNumber(),
    1,
  );
  expect(actual.elternGeldKeineEtPlus).toBeCloseTo(
    expected.elternGeldKeineEtPlus.toNumber(),
    1,
  );
  expect(actual.hasPartnerBonusError).toEqual(expected.hasPartnerBonusError);
  expect(actual.etVorGeburt).toEqual(expected.etVorGeburt);
}

function expectAllElterngeldausgabenToMatch(
  actual: ElternGeldAusgabe[],
  expected: OriginalElternGeldAusgabe[],
): void {
  expect(actual.length).toEqual(expected.length);

  actual.forEach((_, index) =>
    expectElterngeldausgabeToMatch(actual[index], expected[index]),
  );
}

function expectElterngeldausgabeToMatch(
  actual: ElternGeldAusgabe | undefined,
  expected: OriginalElternGeldAusgabe | undefined,
): void {
  assert(actual !== undefined);
  assert(expected !== undefined);

  expect(actual.lebensMonat).toEqual(expected.lebensMonat);
  expect(actual.elternGeld).toBeCloseTo(expected.elternGeld.toNumber(), 1);
  expect(actual.mehrlingsZulage).toBeCloseTo(
    expected.mehrlingsZulage.toNumber(),
    1,
  );
  expect(actual.geschwisterBonus).toBeCloseTo(
    expected.geschwisterBonus.toNumber(),
    1,
  );
  expectElterngeldartToMatch(actual.elterngeldArt, expected.elterngeldArt);
  expect(actual.mutterschaftsLeistungMonat).toEqual(
    expected.mutterschaftsLeistungMonat,
  );
}

/**
 * Covers a flaw of the original calculation that unsafely accesses array
 * indexes. Thereby it returns undefined values where the type system
 * theoretically does not allow it. This was fixed and works now different for
 * the production code. Therefore it must be transformed.
 */
function expectElterngeldartToMatch(
  actual: ElternGeldArt | null,
  expected: ElternGeldArt | null,
): void {
  expect(actual).toEqual(expected ?? ElternGeldArt.KEIN_BEZUG);
}

/**
 * There was a bug fixed in regards of the deadline for the sibling bonus.
 * To maintain the property testability, it was necessary to make an exception
 * and fix the bug in the original code too. But, it has been made an effort to
 * keep the changes to the original code minimal. In contrast to the production
 * code. In result, there is a minor difference how a "no bonus" is communicated
 * in the deadline. While both algorithms declare a possible `null` value, the
 * original code always uses a `Date` that potentially causes no bonus to be
 * applied. While the productive implementation explicitly communicates "no
 * bonus" as `null`.
 */
function expectGeschwisterbonusDeadlineToMatch(
  actual: Date | null,
  expected: Date | null,
  context: ElternGeldDaten,
): void {
  const tagVorDemGeburtsdatum = minusDays(
    context.persoenlicheDaten.wahrscheinlichesGeburtsDatum,
    1,
  );

  expect(actual ?? tagVorDemGeburtsdatum).toEqual(expected);
}

function persoenlicheDatenFrom(data: PersoenlicheDatenRaw): PersoenlicheDaten {
  return {
    wahrscheinlichesGeburtsDatum: data.wahrscheinlichesGeburtsdatum,
    anzahlKuenftigerKinder: data.anzahlKuenftigerKinder,
    etVorGeburt: data.erwerbsartVorDerGeburt,
    hasEtNachGeburt: data.erwerbstaetigNachDerGeburt,
    geschwister: data.kinder.map(kindFrom),
  };
}

function originalPersoenlicheDatenFrom(
  data: PersoenlicheDatenRaw,
): OriginalPersoenlicheDaten {
  const persoenlicheDaten = new OriginalPersoenlicheDaten(
    data.wahrscheinlichesGeburtsdatum,
  );
  persoenlicheDaten.anzahlKuenftigerKinder = data.anzahlKuenftigerKinder;
  persoenlicheDaten.sindSieAlleinerziehend = yesNoFrom(
    data.sindSieAlleinerziehend,
  );
  persoenlicheDaten.etVorGeburt = data.erwerbsartVorDerGeburt;
  persoenlicheDaten.etNachGeburt = yesNoFrom(data.erwerbstaetigNachDerGeburt);
  persoenlicheDaten.kinder.push(...data.kinder.map(originalKindFrom));
  return persoenlicheDaten;
}

function finanzDatenFrom(data: FinanzdatenRaw): FinanzDaten {
  return {
    bruttoEinkommen: new Einkommen(data.bruttoeinkommen),
    istKirchensteuerpflichtig: data.zahlenSieKirchensteuer,
    kinderFreiBetrag: data.kinderfreibetrag,
    steuerKlasse: data.steuerklasse,
    kassenArt: data.kassenart,
    rentenVersicherung: data.rentenversicherung,
    splittingFaktor: data.splittingfaktor,
    mischEinkommenTaetigkeiten: data.mischEinkommenTaetigkeiten.map(
      mischEkTaetigkeitFrom,
    ),
    erwerbsZeitraumLebensMonatList: data.erwerbsZeitraumLebensmonatList.map(
      erwerbsZeitraumLebensMonatFrom,
    ),
  };
}

function originalFinanzDatenFrom(data: FinanzdatenRaw): OriginalFinanzDaten {
  const finanzdaten = new OriginalFinanzDaten();
  finanzdaten.bruttoEinkommen = new OriginalEinkommen(data.bruttoeinkommen);
  finanzdaten.zahlenSieKirchenSteuer = yesNoFrom(data.zahlenSieKirchensteuer);
  finanzdaten.kinderFreiBetrag = data.kinderfreibetrag;
  finanzdaten.steuerKlasse = data.steuerklasse;
  finanzdaten.kassenArt = data.kassenart;
  finanzdaten.rentenVersicherung = data.rentenversicherung;
  finanzdaten.splittingFaktor = data.splittingfaktor;
  finanzdaten.mischEinkommenTaetigkeiten = data.mischEinkommenTaetigkeiten.map(
    originalMischEkTaetigkeitFrom,
  );
  finanzdaten.erwerbsZeitraumLebensMonatList =
    data.erwerbsZeitraumLebensmonatList.map(
      originalErwerbsZeitraumLebensMonatFrom,
    );
  return finanzdaten;
}

function kindFrom(data: KindRaw): Kind {
  return {
    geburtsdatum: data.geburtsdatum,
    istBehindert: data.istBehindert,
  };
}

function originalKindFrom(data: KindRaw, index: number): OriginalKind {
  return {
    nummer: index + 2,
    geburtsdatum: data.geburtsdatum,
    istBehindert: data.istBehindert,
  };
}

function planungsDatenFrom(data: PlanungsdatenRaw): PlanungsDaten {
  return {
    mutterschaftsLeistung: data.mutterschaftsleistungen,
    planung: data.planung,
  };
}

function originalPlanungsDatenFrom(
  data: PlanungsdatenRaw,
): OriginalPlanungsDaten {
  const planungsdaten = new OriginalPlanungsDaten(
    data.alleinerziehend,
    data.erwerbsstatus,
    data.partnerbonus,
    data.mutterschaftsleistungen,
  );
  planungsdaten.planung = data.planung;
  return planungsdaten;
}

function mischEkTaetigkeitFrom(data: MischEkTaetigkeitRaw): MischEkTaetigkeit {
  return {
    erwerbsTaetigkeit: data.erwerbstaetigkeit,
    bruttoEinkommenDurchschnitt: data.bruttoeinkommenDurchschnitt,
    bruttoEinkommenDurchschnittMidi: data.bruttoeinkommenDurchschnittMidi,
    bemessungsZeitraumMonate: data.bemessungszeitraumMonate,
    istRentenVersicherungsPflichtig: data.rentenversicherungspflichtig,
    istKrankenVersicherungsPflichtig: data.krankenversicherungspflichtig,
    istArbeitslosenVersicherungsPflichtig:
      data.arbeitslosenversicherungspflichtig,
  };
}

function originalMischEkTaetigkeitFrom(
  data: MischEkTaetigkeitRaw,
): OriginalMischEkTaetigkeit {
  const taetigkeit = new OriginalMischEkTaetigkeit(false);
  taetigkeit.erwerbsTaetigkeit = data.erwerbstaetigkeit;
  taetigkeit.bruttoEinkommenDurchschnitt = Big(
    data.bruttoeinkommenDurchschnitt,
  );
  taetigkeit.bruttoEinkommenDurchschnittMidi = Big(
    data.bruttoeinkommenDurchschnittMidi,
  );
  taetigkeit.bemessungsZeitraumMonate = data.bemessungszeitraumMonate;
  taetigkeit.rentenVersicherungsPflichtig = yesNoFrom(
    data.rentenversicherungspflichtig,
  );
  taetigkeit.krankenVersicherungsPflichtig = yesNoFrom(
    data.krankenversicherungspflichtig,
  );
  taetigkeit.arbeitslosenVersicherungsPflichtig = yesNoFrom(
    data.arbeitslosenversicherungspflichtig,
  );
  return taetigkeit;
}

function originalErwerbsZeitraumLebensMonatFrom(
  data: ErwerbsZeitraumLebensMonatRaw,
): OriginalErwerbsZeitraumLebensMonat {
  return new OriginalErwerbsZeitraumLebensMonat(
    data.vonLebensmonat,
    data.bisLebensmonat,
    new OriginalEinkommen(data.bruttoProMonat),
  );
}

function erwerbsZeitraumLebensMonatFrom(
  data: ErwerbsZeitraumLebensMonatRaw,
): ErwerbsZeitraumLebensMonat {
  return {
    vonLebensMonat: data.vonLebensmonat,
    bisLebensMonat: data.bisLebensmonat,
    bruttoProMonat: new Einkommen(data.bruttoProMonat),
  };
}

function yesNoFrom(value: boolean): YesNo {
  return value ? YesNo.YES : YesNo.NO;
}

function arbitraryPersoenlicheDatenRaw(): Arbitrary<PersoenlicheDatenRaw> {
  return arbitraryRecord({
    anzahlKuenftigerKinder: arbitraryInteger({ min: 1, max: 5 }),
    wahrscheinlichesGeburtsdatum: arbitraryDate({
      min: new Date(
        Math.min(...OriginalUnterstuetzteLohnsteuerjahre) - 1,
        0,
        1,
      ),
      max: new Date(
        Math.max(...OriginalUnterstuetzteLohnsteuerjahre) - 1,
        11,
        31,
      ),
    }),
    sindSieAlleinerziehend: arbitraryBoolean(),
    erwerbsartVorDerGeburt: arbitraryErwerbsArt(),
    erwerbstaetigNachDerGeburt: arbitraryBoolean(),
    kinder: arbitraryArray(arbitraryKind(), { maxLength: 7 }),
  });
}

type PersoenlicheDatenRaw = {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsdatum: Date;
  sindSieAlleinerziehend: boolean;
  erwerbsartVorDerGeburt: ErwerbsArt;
  erwerbstaetigNachDerGeburt: boolean;
  kinder: KindRaw[];
};

function arbitraryFinanzdatenRaw(): Arbitrary<FinanzdatenRaw> {
  return arbitraryRecord({
    bruttoeinkommen: arbitraryBruttoeinkommen(),
    zahlenSieKirchensteuer: arbitraryBoolean(),
    kinderfreibetrag: arbitraryKinderfreibetrag(),
    steuerklasse: arbitrarySteuerklasse(),
    kassenart: arbitraryKassenart(),
    rentenversicherung: arbitraryRentenart(),
    splittingfaktor: arbitrarySplittingfaktor(),
    mischEinkommenTaetigkeiten: arbitraryArray(
      arbitraryMischEkTaetigkeitRaw(),
      {
        maxLength: 10,
      },
    ),
    erwerbsZeitraumLebensmonatList: arbitraryArray(
      arbitraryErwerbszeitraumLebensmonat(),
      { maxLength: 10 },
    ),
  });
}

type FinanzdatenRaw = {
  bruttoeinkommen: number;
  zahlenSieKirchensteuer: boolean;
  kinderfreibetrag: KinderFreiBetrag;
  steuerklasse: SteuerKlasse;
  kassenart: KassenArt;
  rentenversicherung: RentenArt;
  splittingfaktor: number;
  mischEinkommenTaetigkeiten: MischEkTaetigkeitRaw[];
  erwerbsZeitraumLebensmonatList: ErwerbsZeitraumLebensMonatRaw[];
};

function arbitraryPlanungsdatenRaw(): Arbitrary<PlanungsdatenRaw> {
  return arbitraryRecord({
    alleinerziehend: arbitraryBoolean(),
    erwerbsstatus: arbitraryBoolean(),
    partnerbonus: arbitraryBoolean(),
    mutterschaftsleistungen: arbitraryMutterschaftsleistungen(),
    planung: arbitraryArray(arbitraryElterngeldart(), { maxLength: 32 }),
  });
}

type PlanungsdatenRaw = {
  alleinerziehend: boolean;
  erwerbsstatus: boolean;
  partnerbonus: boolean;
  mutterschaftsleistungen: MutterschaftsLeistung;
  planung: ElternGeldArt[];
};

function arbitraryLohnsteuerjahr(): Arbitrary<OriginalLohnsteuerjahr> {
  return arbitraryConstantFrom(...OriginalUnterstuetzteLohnsteuerjahre);
}

function arbitraryMischEkTaetigkeitRaw(): Arbitrary<MischEkTaetigkeitRaw> {
  return arbitraryRecord({
    erwerbstaetigkeit: arbitraryErwerbstaetigkeit(),
    bruttoeinkommenDurchschnitt: arbitraryBruttoeinkommen(),
    bruttoeinkommenDurchschnittMidi: arbitraryBruttoeinkommen(),
    bemessungszeitraumMonate: arbitraryArray(arbitraryBoolean(), {
      minLength: 12,
      maxLength: 12,
    }),
    rentenversicherungspflichtig: arbitraryBoolean(),
    krankenversicherungspflichtig: arbitraryBoolean(),
    arbeitslosenversicherungspflichtig: arbitraryBoolean(),
  });
}

type MischEkTaetigkeitRaw = {
  erwerbstaetigkeit: ErwerbsTaetigkeit;
  bruttoeinkommenDurchschnitt: number;
  bruttoeinkommenDurchschnittMidi: number;
  bemessungszeitraumMonate: boolean[];
  rentenversicherungspflichtig: boolean;
  krankenversicherungspflichtig: boolean;
  arbeitslosenversicherungspflichtig: boolean;
};

function arbitraryErwerbszeitraumLebensmonat(): Arbitrary<ErwerbsZeitraumLebensMonatRaw> {
  return arbitraryInteger({
    min: 1,
    max: 32,
  })
    .chain((vonLebensmonat) =>
      arbitraryTuple(
        arbitraryConstant(vonLebensmonat),
        arbitraryInteger({ min: vonLebensmonat, max: 32 }),
        arbitraryBruttoeinkommen(),
      ),
    )
    .map(([vonLebensmonat, bisLebensmonat, bruttoProMonat]) => ({
      vonLebensmonat,
      bisLebensmonat,
      bruttoProMonat,
    }));
}

type ErwerbsZeitraumLebensMonatRaw = {
  vonLebensmonat: number;
  bisLebensmonat: number;
  bruttoProMonat: number;
};

function arbitraryKind(): Arbitrary<KindRaw> {
  return arbitraryRecord({
    geburtsdatum: arbitraryDate({
      min: new Date(
        Math.min(...OriginalUnterstuetzteLohnsteuerjahre) - 20,
        0,
        1,
      ),
      max: new Date(
        Math.max(...OriginalUnterstuetzteLohnsteuerjahre) - 1,
        11,
        31,
      ),
    }),
    istBehindert: arbitraryBoolean(),
  });
}

type KindRaw = {
  geburtsdatum: Date;
  istBehindert: boolean;
};

function arbitraryErwerbsArt(): Arbitrary<ErwerbsArt> {
  return arbitraryConstantFrom(...Object.values(ErwerbsArt));
}

function arbitraryMutterschaftsleistungen(): Arbitrary<MutterschaftsLeistung> {
  return arbitraryConstantFrom(...Object.values(MutterschaftsLeistung));
}

function arbitraryElterngeldart(): Arbitrary<ElternGeldArt> {
  return arbitraryConstantFrom(...Object.values(ElternGeldArt));
}

function arbitraryKinderfreibetrag(): Arbitrary<KinderFreiBetrag> {
  return arbitraryConstantFrom(...Object.values(KinderFreiBetrag));
}

function arbitrarySteuerklasse(): Arbitrary<SteuerKlasse> {
  return arbitraryConstantFrom(...Object.values(SteuerKlasse));
}

function arbitraryKassenart(): Arbitrary<KassenArt> {
  return arbitraryConstantFrom(...Object.values(KassenArt));
}

function arbitraryRentenart(): Arbitrary<RentenArt> {
  return arbitraryConstantFrom(...Object.values(RentenArt));
}

function arbitrarySplittingfaktor(): Arbitrary<number> {
  return arbitraryInteger({ min: 0, max: 2 });
}

function arbitraryErwerbstaetigkeit(): Arbitrary<ErwerbsTaetigkeit> {
  return arbitraryConstantFrom(...Object.values(ErwerbsTaetigkeit));
}

function arbitraryBruttoeinkommen(): Arbitrary<number> {
  return arbitraryInteger({ min: 0, max: 30000 });
}
