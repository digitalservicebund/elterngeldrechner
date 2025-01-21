import assert from "assert";
import Big from "big.js";
import {
  type Arbitrary,
  array as arbitraryArray,
  assert as assertProperty,
  boolean as arbitraryBoolean,
  constant as arbitraryConstant,
  constantFrom as arbitraryConstantFrom,
  date as arbitraryDate,
  double as arbitraryDouble,
  float as arbitraryFloat,
  integer as arbitraryInteger,
  object as arbitraryObject,
  oneof as arbitraryOneOf,
  property,
  record as arbitraryRecord,
  string as arbitraryString,
  tuple as arbitraryTuple,
} from "fast-check";
import { DateTime } from "luxon";
import { describe, it } from "vitest";
import { EgrCalculation } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldDaten,
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
  Big as OriginalBig,
  EgrCalculation as OriginalEgrCalculation,
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
 * issues.
 * Also the algorithm to compare the output data SHOULD be based on
 * a solid library or platform native functionality. This MIGHT be weaken if
 * absolutely necessary to allow a certain refactoring, but MUST be done with
 * great care.
 * Especially the simplification of the output format during refactoring MUST be
 * done purposefully.
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
    { timeout: 10_000 },
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

            const result = new EgrCalculation().calculateElternGeld(
              elterngelddaten,
              lohnsteuerjahr,
            );

            const transformedResultForComparison = transformDataRecursively(
              result,
              [convertBigsToNumbers, replaceNullGeschwisterbonusDeadline],
              elterngelddaten,
            );

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

            const transformedOriginalResultForComparison =
              transformDataRecursively(
                originalResult,
                [
                  convertBigsToNumbers,
                  mapUndefinedElterngeldartToKeinBezug,
                  deleteElterngeldperioden,
                ],
                elterngelddaten,
              );

            return assert.deepStrictEqual(
              transformedResultForComparison,
              transformedOriginalResultForComparison,
            );
          },
        ),
        { numRuns: 5000, endOnFailure: true },
      );
    },
  );

  describe("transform data recursively", () => {
    it("provides the same output as input if no transformer given", () => {
      assertProperty(
        property(arbitraryAnything(), (data) => {
          const transformedData = transformDataRecursively(data, [], null);

          assert.deepStrictEqual(transformedData, data);
        }),
      );
    });

    it("provides the same output as input if given an identify function as transformer", () => {
      assertProperty(
        property(arbitraryAnything(), (data) => {
          const identity = (data: unknown) => data;

          const transformedData = transformDataRecursively(
            data,
            [identity],
            null,
          );

          assert.deepStrictEqual(transformedData, data);
        }),
      );
    });

    it("applies all transformers correctly and recursively", () => {
      const doubleNumbers = (data: unknown) =>
        typeof data === "number" ? data * 2 : data;

      const replaceFooWithBar = (data: unknown) =>
        data === "foo" ? "bar" : data;

      const data = {
        a: "foo",
        b: "baz",
        c: 1,
        d: ["foo", "baz", undefined, 2, null, { lorem: ["ipsum", 3] }],
        e: { f: 4, g: "dolor" },
      };

      const transformedData = transformDataRecursively(
        data,
        [doubleNumbers, replaceFooWithBar],
        null,
      );

      expect(transformedData).toStrictEqual({
        a: "bar",
        b: "baz",
        c: 2,
        d: ["bar", "baz", undefined, 4, null, { lorem: ["ipsum", 6] }],
        e: { f: 8, g: "dolor" },
      });
    });

    it("can transform data based on given context", () => {
      const replaceFooByContext = (
        data: unknown,
        contextInformation: { fooReplacement: string },
      ) => (data === "foo" ? contextInformation.fooReplacement : data);

      const data = { a: "foo", b: ["foo", "baz"] };

      const transformedData = transformDataRecursively(
        data,
        [replaceFooByContext],
        { fooReplacement: "bar" },
      );

      expect(transformedData).toStrictEqual({ a: "bar", b: ["bar", "baz"] });
    });
  });
});

function transformDataRecursively<ContextInformation>(
  data: unknown,
  transformers: DataTransformer<ContextInformation>[],
  contextInformation: ContextInformation,
): unknown {
  const transformedData = transformers.reduce(
    (transformedData, transformer) =>
      transformer(transformedData, contextInformation),
    data,
  );

  if (Array.isArray(transformedData)) {
    return transformedData.map((entry) =>
      transformDataRecursively(entry, transformers, contextInformation),
    );
  } else if (
    typeof transformedData === "object" &&
    transformedData !== null &&
    Object.keys(transformedData).length > 0
  ) {
    return Object.fromEntries(
      Object.entries(transformedData).map(([key, value]) => [
        key,
        transformDataRecursively(value, transformers, contextInformation),
      ]),
    );
  } else {
    return transformedData;
  }
}

/**
 * Unfortunately, without "neutralizing" Big numbers, the assertion that two
 * data points that include instances of Big will always fail. This is happens,
 * because the original calculation has its own Big dependency bundled.
 * Anyhow, it is also useful to neutralize the usage of Big numbers for
 * refactoring purposes. So the first case might become obsolete.
 */
function convertBigsToNumbers(data: unknown): unknown {
  if (data instanceof Big || data instanceof OriginalBig) {
    return data.toNumber();
  } else {
    return data;
  }
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
function replaceNullGeschwisterbonusDeadline(
  data: unknown,
  contextInformation: ElternGeldDaten,
): unknown {
  const hasGeschwisterBonusDealineProperty =
    typeof data === "object" &&
    data !== null &&
    "geschwisterBonusDeadLine" in data;

  const hasNullDeadline =
    hasGeschwisterBonusDealineProperty &&
    data.geschwisterBonusDeadLine === null;

  if (hasNullDeadline) {
    const { wahrscheinlichesGeburtsDatum } =
      contextInformation.persoenlicheDaten;

    const dayBeforeBirthday = DateTime.fromJSDate(wahrscheinlichesGeburtsDatum)
      .minus({ days: 1 })
      .toJSDate();

    data.geschwisterBonusDeadLine = dayBeforeBirthday;
  }

  return data;
}

/**
 * Covers a flaw of the original calculation that unsafely accesses array
 * indexes. Thereby it plays out undefined values where the type system
 * theoretically does not allow it. This was fixed and works now different for
 * the production code. Therefore it must be transformed.
 */
function mapUndefinedElterngeldartToKeinBezug(data: unknown): unknown {
  const hasElterngeldartProperty =
    typeof data === "object" && data !== null && "elterngeldArt" in data;

  if (hasElterngeldartProperty) {
    data.elterngeldArt ??= ElternGeldArt.KEIN_BEZUG;
  }

  return data;
}

/**
 * As a follow up issue of {@link mapUndefinedElterngeldartToKeinBezug}, the
 * calculated periods of Elterngeld where calculated wrong too. There is no
 * simple fix to resolve this. However, as this data is not used anymore, it was
 * removed in production code. So it gets removed here for the original result.
 */
function deleteElterngeldperioden(data: unknown): unknown {
  const hasElterngeldperiodenProperties =
    typeof data === "object" &&
    data !== null &&
    "anfangEGPeriode" in data &&
    "endeEGPeriode" in data;

  if (hasElterngeldperiodenProperties) {
    delete data.anfangEGPeriode;
    delete data.endeEGPeriode;
  }

  return data;
}

type DataTransformer<ContextInformation> =
  | ((data: unknown) => unknown)
  | ((data: unknown, contextInformation: ContextInformation) => unknown);

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
  finanzdaten.bruttoEinkommen = new Einkommen(data.bruttoeinkommen);
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
    bruttoEinkommenDurchschnitt: Big(data.bruttoeinkommenDurchschnitt),
    bruttoEinkommenDurchschnittMidi: Big(data.bruttoeinkommenDurchschnittMidi),
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
    new Einkommen(data.bruttoProMonat),
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

function arbitraryPrimitive(): Arbitrary<
  undefined | null | boolean | number | string | Date
> {
  return arbitraryOneOf(
    arbitraryConstantFrom(undefined, null),
    arbitraryBoolean(),
    arbitraryInteger(),
    arbitraryFloat(),
    arbitraryDouble(),
    arbitraryString(),
    arbitraryDate(),
  );
}

function arbitraryAnything(): Arbitrary<unknown> {
  return arbitraryOneOf(
    arbitraryPrimitive(),
    arbitraryArray(arbitraryPrimitive()),
    arbitraryObject(),
  );
}
