import {
  type Arbitrary,
  array as arbitraryArray,
  boolean as arbitraryBoolean,
  constantFrom as arbitraryConstantFrom,
  date as arbitraryDate,
  integer as arbitraryInteger,
  record as arbitraryRecord,
  sample,
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
  Geburtstag,
  KassenArt,
  type Kind,
  KinderFreiBetrag,
  type MischEkTaetigkeit,
  MutterschaftsLeistung,
  type PersoenlicheDaten,
  type PlanungsDaten,
  RentenArt,
  Steuerklasse,
} from "./model";

describe("characterization tests", () => {
  test("calculate Elterngeld", { timeout: MORE_THAN_ENOUGH_TIME }, () => {
    // Use loop to avoid a huge array that might cause out of memory issues
    for (let _ = 0; _ < ENOUGH_SAMPLES; _++) {
      const elterngelddaten = getSaticSampleOfElterngelddaten();
      expect(calculateElternGeld(elterngelddaten)).toMatchSnapshot();
    }
  });
});

/*
 * This does currently not cache the samples in anyway manner on purpose.
 * Besides other problems, caching cross test runs requires en- and decoding.
 * Raw JSON is not sufficient here as some domain models are implemented as
 * classes. To avoid the complexity, the data gets sampled on every test run.
 * This has disadvantages like a longer test execution time and more computation
 * resources usage.
 */
function getSaticSampleOfElterngelddaten(): ElternGeldDaten {
  return sample(
    arbitraryRecord(
      {
        persoenlicheDaten: arbitraryPersoenlicheDaten(),
        finanzDaten: arbitraryFinanzdaten(),
        planungsDaten: arbitraryPlanungsdaten(),
      },
      { noNullPrototype: true },
    ),
    {
      seed: STATIC_SEED,
      numRuns: 1,
    },
  )[0]!;
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
  return arbitraryRecord(
    {
      geburtstagDesKindes: arbitraryDate({
        min: new Date("2020-01-01"),
        max: new Date("2027-12-31"),
        noInvalidDate: true,
      }).map((date) => new Geburtstag(date)),
      anzahlKuenftigerKinder: arbitraryInteger({ min: 1, max: 5 }),
      etVorGeburt: arbitraryErwerbsArt(),
      hasEtNachGeburt: arbitraryBoolean(),
      geschwister: arbitraryArray(arbitraryKind(), { maxLength: 7 }),
    },
    { noNullPrototype: true },
  );
}

function arbitraryFinanzdaten(): Arbitrary<FinanzDaten> {
  return arbitraryRecord(
    {
      bruttoEinkommen: arbitraryBruttoeinkommen(),
      istKirchensteuerpflichtig: arbitraryBoolean(),
      kinderFreiBetrag: arbitraryKinderfreibetrag(),
      steuerklasse: arbitrarySteuerklasse(),
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
    },
    { noNullPrototype: true },
  );
}

function arbitraryPlanungsdaten(): Arbitrary<PlanungsDaten> {
  return arbitraryRecord(
    {
      mutterschaftsLeistung: arbitraryMutterschaftsleistungen(),
      planung: arbitraryArray(arbitraryElterngeldart(), { maxLength: 32 }),
    },
    { noNullPrototype: true },
  );
}

function arbitraryMischEkTaetigkeit(): Arbitrary<MischEkTaetigkeit> {
  return arbitraryRecord(
    {
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
    },
    { noNullPrototype: true },
  );
}

function arbitraryErwerbszeitraumLebensmonat(): Arbitrary<ErwerbsZeitraumLebensMonat> {
  return arbitraryRecord(
    {
      vonLebensMonat: arbitraryInteger({ min: 1, max: 32 }),
      bruttoProMonat: arbitraryBruttoeinkommen(),
    },
    { noNullPrototype: true },
  ).chain(({ vonLebensMonat, bruttoProMonat }) =>
    arbitraryInteger({ min: vonLebensMonat, max: 32 }).map(
      (bisLebensMonat) => ({
        vonLebensMonat,
        bisLebensMonat,
        bruttoProMonat,
      }),
    ),
  );
}

function arbitraryKind(): Arbitrary<Kind> {
  return arbitraryRecord(
    {
      geburtstag: arbitraryDate({
        min: new Date("2000-01-01"),
        max: new Date("2019-12-31"),
        noInvalidDate: true,
      }).map((date) => new Geburtstag(date)),
      istBehindert: arbitraryBoolean(),
    },
    { noNullPrototype: true },
  );
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

function arbitrarySteuerklasse(): Arbitrary<Steuerklasse> {
  return arbitraryConstantFrom(...Object.values(Steuerklasse));
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
