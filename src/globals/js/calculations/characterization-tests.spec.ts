import {
  type Arbitrary,
  array as arbitraryArray,
  boolean as arbitraryBoolean,
  constant as arbitraryConstant,
  constantFrom as arbitraryConstantFrom,
  date as arbitraryDate,
  integer as arbitraryInteger,
  record as arbitraryRecord,
  sample,
  tuple as arbitraryTuple,
} from "fast-check";
import { describe, expect, test } from "vitest";
import { calculateElternGeld } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldDaten,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  type ErwerbsZeitraumLebensMonat,
  type FinanzDaten,
  KassenArt,
  type Kind,
  KinderFreiBetrag,
  type MischEkTaetigkeit,
  MutterschaftsLeistung,
  type PersoenlicheDaten,
  type PlanungsDaten,
  RentenArt,
  SteuerKlasse,
} from "./model";

describe("characterization tests", () => {
  test("calculate Elterngeld", { timeout: MORE_THAN_ENOUGH_TIME }, () => {
    const elterngelddaten = getSaticSampleElterngelddaten(ENOUGH_SAMPLES);
    const results = elterngelddaten.map(calculateElternGeld);
    expect(results).toMatchSnapshot();
  });
});

/*
 * This does currently not cache the samples in anyway manner on purpose.
 * Besides other problems, caching cross test runs requires en- and decoding.
 * Raw JSON is not sufficient here as some domain models are implemented as
 * classes. To avoid the complexity, the data gets sampled on every test run.
 * This has disadvantages like a longer test execution time and more computation
 * resources usage.
 *
 * The parameter for the number of samples is used to shift the responsibility
 * to the caller to encourage proper syncing with the test case run timeout.
 */
function getSaticSampleElterngelddaten(
  numberOfSamples: number,
): ElternGeldDaten[] {
  return sample(
    arbitraryRecord({
      persoenlicheDaten: arbitraryPersoenlicheDaten(),
      finanzDaten: arbitraryFinanzdaten(),
      planungsDaten: arbitraryPlanungsdaten(),
    }),
    {
      seed: STATIC_SEED,
      numRuns: numberOfSamples,
    },
  );
}

/**
 * The generation of the (random) sample data sometimes vary in execution time.
 * In general we don't want the tests to fail because this took too long.
 * Anyhow, the runtime should be limited to ensure a feasible overall test suite
 * runtime (also for the continuous integration pipeline). This will be
 * controlled by the number of generated samples (see {@link ENOUGH_SAMPLES}).
 */
const MORE_THAN_ENOUGH_TIME = 60 /* seconds */ * 1000;

/**
 * The number of samples to characterize the behavior. This is a trade-off
 * between the reliability of the tests versus the execution time (see {@link MORE_THAN_ENOUGH_TIME})
 * and the storage size of the snapshots.
 */
const ENOUGH_SAMPLES = 10_000;

/**
 * Ensure statically reproducible sample data generation.
 */
const STATIC_SEED = 12345;

function arbitraryPersoenlicheDaten(): Arbitrary<PersoenlicheDaten> {
  return arbitraryRecord({
    wahrscheinlichesGeburtsDatum: arbitraryDate({
      min: new Date("2020-01-01"),
      max: new Date("2027-12-31"),
    }),
    anzahlKuenftigerKinder: arbitraryInteger({ min: 1, max: 5 }),
    etVorGeburt: arbitraryErwerbsArt(),
    hasEtNachGeburt: arbitraryBoolean(),
    geschwister: arbitraryArray(arbitraryKind(), { maxLength: 7 }),
  });
}

function arbitraryFinanzdaten(): Arbitrary<FinanzDaten> {
  return arbitraryRecord({
    bruttoEinkommen: arbitraryBruttoeinkommen(),
    istKirchensteuerpflichtig: arbitraryBoolean(),
    kinderFreiBetrag: arbitraryKinderfreibetrag(),
    steuerKlasse: arbitrarySteuerklasse(),
    kassenArt: arbitraryKassenart(),
    rentenVersicherung: arbitraryRentenart(),
    splittingFaktor: arbitrarySplittingfaktor(),
    mischEinkommenTaetigkeiten: arbitraryArray(arbitraryMischEkTaetigkeit(), {
      maxLength: 5,
    }),
    erwerbsZeitraumLebensMonatList: arbitraryArray(
      arbitraryErwerbszeitraumLebensmonat(),
      { maxLength: 5 },
    ),
  });
}

function arbitraryPlanungsdaten(): Arbitrary<PlanungsDaten> {
  return arbitraryRecord({
    mutterschaftsLeistung: arbitraryMutterschaftsleistungen(),
    planung: arbitraryArray(arbitraryElterngeldart(), { maxLength: 32 }),
  });
}

function arbitraryMischEkTaetigkeit(): Arbitrary<MischEkTaetigkeit> {
  return arbitraryRecord({
    erwerbsTaetigkeit: arbitraryErwerbstaetigkeit(),
    bruttoEinkommenDurchschnitt: arbitraryBrutto(),
    bruttoEinkommenDurchschnittMidi: arbitraryBrutto(),
    bemessungsZeitraumMonate: arbitraryArray(arbitraryBoolean(), {
      minLength: 12,
      maxLength: 12,
    }),
    istRentenVersicherungsPflichtig: arbitraryBoolean(),
    istKrankenVersicherungsPflichtig: arbitraryBoolean(),
    istArbeitslosenVersicherungsPflichtig: arbitraryBoolean(),
  });
}

function arbitraryErwerbszeitraumLebensmonat(): Arbitrary<ErwerbsZeitraumLebensMonat> {
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
    .map(([vonLebensMonat, bisLebensMonat, bruttoProMonat]) => ({
      vonLebensMonat,
      bisLebensMonat,
      bruttoProMonat,
    }));
}

function arbitraryKind(): Arbitrary<Kind> {
  return arbitraryRecord({
    geburtsdatum: arbitraryDate({
      min: new Date("2000-01-01"),
      max: new Date("2019-12-31"),
    }),
    istBehindert: arbitraryBoolean(),
  });
}

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

function arbitraryBrutto(): Arbitrary<number> {
  return arbitraryInteger({ min: 0, max: 10000 });
}

function arbitraryBruttoeinkommen(): Arbitrary<Einkommen> {
  return arbitraryBrutto().map((value) => new Einkommen(value));
}
