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
  integer as arbitraryInteger,
  property,
  record as arbitraryRecord,
  tuple as arbitraryTuple,
} from "fast-check";
import { describe, it } from "vitest";
import { EgrCalculation } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  ErwerbsZeitraumLebensMonat,
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
  YesNo,
} from "./model";
import {
  Big as OriginalBig,
  EgrCalculation as OriginalEgrCalculation,
  ErwerbsZeitraumLebensMonat as OriginalErwerbsZeitraumLebensMonat,
  FinanzDaten as OriginalFinanzDaten,
  type Lohnsteuerjahr as OriginalLohnsteuerjahr,
  PersoenlicheDaten as OriginalPersoenlicheDaten,
  PlanungsDaten as OriginalPlanungsDaten,
  UnterstuetzteLohnsteuerjahre as OriginalUnterstuetzteLohnsteuerjahre,
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
 * case it SHOULD not transform the output data at all to avoid unrefracting
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
 * The number of runs (`numRuns`) MIGHT be adapted during actual refactoring
 * work to shorten the feedback cycles. In the end, a refactoring MUST be
 * verified using at least the original configuration to gain enough confidence
 * (i.e. 100.000 runs, which takes about 7 minutes). More runs might be used to
 * gain further confidence depending on the refactoring.
 * The number of runs is reduced for the continuous integration pipeline, just
 * because of the test duration
 * To run the tests, the environment variable `ALLOW_EXTREMELY_SLOW_TESTS` must
 * be set to `true`. This is a current workaround for the shortcomings of the
 * test runner to provide more suitable alternatives.
 */
describe("tests to verify properties during refactoring", () => {
  it.runIf(extremelySlowTestsAreAllowed())(
    "calculates the same result the original/legacy implementation",
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
            const result = new EgrCalculation().calculateElternGeld(
              {
                persoenlicheDaten: persoenlicheDatenFrom(persoenlicheDatenRaw),
                finanzDaten: finanzDatenFrom(finanzdatenRaw),
                planungsDaten: planungsDatenFrom(planungsdatenRaw),
              },
              lohnsteuerjahr,
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

            return assert.deepStrictEqual(
              transformDataRecursively(result, [convertBigsToNumbers]),
              transformDataRecursively(originalResult, [convertBigsToNumbers]),
            );
          },
        ),
        {
          numRuns: runsInContinuousIntegrationPipeline() ? 30000 : 100000,
          endOnFailure: true,
        },
      );
    },
  );
});

function transformDataRecursively(
  data: unknown,
  transformers: DataTransformer[],
): unknown {
  const transformedData = transformers.reduce(
    (transformedData, transformer) => transformer(transformedData),
    data,
  );

  if (typeof transformedData === "object" && transformedData !== null) {
    return Object.fromEntries(
      Object.entries(transformedData).map(([key, value]) => [
        key,
        transformDataRecursively(value, transformers),
      ]),
    );
  } else if (Array.isArray(transformedData)) {
    return transformedData.map((entry) =>
      transformDataRecursively(entry, transformers),
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

type DataTransformer = (data: unknown) => unknown;

function persoenlicheDatenFrom(data: PersoenlicheDatenRaw): PersoenlicheDaten {
  const persoenlicheDaten = new PersoenlicheDaten(
    data.wahrscheinlichesGeburtsdatum,
  );
  persoenlicheDaten.anzahlKuenftigerKinder = data.anzahlKuenftigerKinder;
  persoenlicheDaten.etVorGeburt = data.erwerbsartVorDerGeburt;
  persoenlicheDaten.etNachGeburt = yesNoFrom(data.erwerbstaetigNachDerGeburt);
  persoenlicheDaten.kinder.push(...data.kinder.map(kindFrom));
  return persoenlicheDaten;
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
  persoenlicheDaten.kinder.push(...data.kinder.map(kindFrom));
  return persoenlicheDaten;
}

function finanzDatenFrom(data: FinanzdatenRaw): FinanzDaten {
  const finanzdaten = new FinanzDaten();
  finanzdaten.bruttoEinkommen = new Einkommen(data.bruttoeinkommen);
  finanzdaten.zahlenSieKirchenSteuer = yesNoFrom(data.zahlenSieKirchensteuer);
  finanzdaten.kinderFreiBetrag = data.kinderfreibetrag;
  finanzdaten.steuerKlasse = data.steuerklasse;
  finanzdaten.kassenArt = data.kassenart;
  finanzdaten.rentenVersicherung = data.rentenversicherung;
  finanzdaten.splittingFaktor = data.splittingfaktor;
  finanzdaten.mischEinkommenTaetigkeiten = data.mischEinkommenTaetigkeiten.map(
    mischEkTaetigkeitFrom,
  );
  finanzdaten.erwerbsZeitraumLebensMonatList =
    data.erwerbsZeitraumLebensmonatList.map(erwerbsZeitraumLebensMonatFrom);
  return finanzdaten;
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
    mischEkTaetigkeitFrom,
  );
  finanzdaten.erwerbsZeitraumLebensMonatList =
    data.erwerbsZeitraumLebensmonatList.map(
      originalErwerbsZeitraumLebensMonatFrom,
    );
  return finanzdaten;
}

function kindFrom(data: KindRaw, index: number): Kind {
  return {
    nummer: index + 2,
    geburtsdatum: data.geburtsdatum,
    istBehindert: data.istBehindert,
  };
}

function planungsDatenFrom(data: PlanungsdatenRaw): PlanungsDaten {
  const planungsdaten = new PlanungsDaten(data.mutterschaftsleistungen);
  planungsdaten.planung = data.planung;
  return planungsdaten;
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
  const taetigkeit = new MischEkTaetigkeit(false);
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
  return new ErwerbsZeitraumLebensMonat(
    data.vonLebensmonat,
    data.bisLebensmonat,
    new Einkommen(data.bruttoProMonat),
  );
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

function extremelySlowTestsAreAllowed(): boolean {
  return import.meta.env.ALLOW_EXTREMELY_SLOW_TESTS === "true";
}

function runsInContinuousIntegrationPipeline(): boolean {
  return import.meta.env.CI === "true";
}
