import { Temporal } from "@js-temporal/polyfill";
import {
  type Arbitrary,
  array as arbitraryArray,
  assert as assertProperty,
  boolean as arbitraryBoolean,
  constant as arbitraryConstant,
  constantFrom as arbitraryConstantFrom,
  date as arbitraryDate,
  integer as arbitraryInteger,
  oneof as arbitraryOneof,
  option as arbitraryOption,
  property,
  record as arbitraryRecord,
  string as arbitraryString,
} from "fast-check";
import { describe, expect, it } from "vitest";
import { type FormEvent } from "./FormEvent";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import { Route } from "./Route";
import { bundeslaender } from "@/application/features/abfrageteil/pages/allgemeine-angaben/AllgemeineAngabenSchema";
import { Steuerklasse } from "@/elterngeldrechner";

const arbitraryGeburtsdatum: Arbitrary<Temporal.PlainDate> = arbitraryDate({
  min: new Date("1990-01-01"),
  max: new Date("2035-12-31"),
  noInvalidDate: true,
}).map((date) => Temporal.PlainDate.from(date.toISOString().slice(0, 10)));

const arbitraryAnzahlKinder = arbitraryInteger({ min: 1, max: 8 });

const arbitraryIndex = arbitraryInteger({ min: 0, max: 7 });

const arbitraryElternteilIndex = arbitraryConstantFrom(0, 1);

const arbitraryOptionalBoolean = arbitraryOption(arbitraryBoolean(), {
  nil: undefined,
});

const arbitraryNaechsterGeschwisterIndex = arbitraryOption(arbitraryIndex, {
  nil: undefined,
});

const arbitraryZeitspanne = arbitraryRecord({
  a: arbitraryGeburtsdatum,
  b: arbitraryGeburtsdatum,
}).map(({ a, b }) =>
  Temporal.PlainDate.compare(a, b) <= 0
    ? { von: a, bis: b }
    : { von: b, bis: a },
);

const arbitrarySteuerklasse = arbitraryConstantFrom(
  ...Object.values(Steuerklasse),
);

const arbitraryBruttoJahresgewinn = arbitraryInteger({ min: 0, max: 175000 });

const arbitraryMonatsbrutto = arbitraryInteger({ min: 0, max: 15000 });

// The Tätigkeiten selection requires at least one option to be true; when the
// three Erwerbstätigkeit flags are all false the flow terminates early instead
// of going into the income pages, so keeping the constraint exercises both.
const arbitraryTaetigkeitenFlags = arbitraryRecord({
  istNichtSelbststaendig: arbitraryBoolean(),
  istSelbststaendig: arbitraryBoolean(),
  istVerbeamtet: arbitraryBoolean(),
  hatAndereLeistungen: arbitraryBoolean(),
  hatPeriodenOhneEinkommen: arbitraryBoolean(),
}).map((flags) =>
  Object.values(flags).some(Boolean)
    ? flags
    : { ...flags, hatPeriodenOhneEinkommen: true },
);

const formEventArbitraries: Arbitrary<FormEvent>[] = [
  arbitraryConstant({ route: Route.Startseite }),
  arbitraryRecord({
    bundesland: arbitraryConstantFrom(...bundeslaender),
    gesamteinkommenGrenzeUeberschritten: arbitraryBoolean(),
  }).map((payload) => ({ route: Route.AllgemeineAngaben, payload })),
  arbitraryRecord({ istGeboren: arbitraryBoolean() }).map((payload) => ({
    route: Route.KindAbfrage,
    payload,
  })),
  arbitraryRecord({
    geburtsdatum: arbitraryGeburtsdatum,
    errechneterEntbindungstermin: arbitraryGeburtsdatum,
    anzahl: arbitraryAnzahlKinder,
  }).map((payload) => ({ route: Route.GeborenesKindAngaben, payload })),
  arbitraryRecord({ istVorhanden: arbitraryBoolean() }).map((payload) => ({
    route: Route.GeschwisterkindAbfrage,
    payload,
  })),
  arbitraryRecord({ anzahlGeschwisterkinder: arbitraryAnzahlKinder }).map(
    (payload) => ({ route: Route.GeschwisterkindAnzahlAbfrage, payload }),
  ),
  arbitraryConstant({ route: Route.GeschwisterbonusUebersicht }),
  arbitraryRecord({
    name: arbitraryString({ minLength: 1 }),
    istAlleinerziehend: arbitraryBoolean(),
    istImMutterschutz: arbitraryBoolean(),
  }).map((payload) => ({
    route: Route.ElternteilEinsAllgemeineAngaben,
    payload,
  })),
  arbitraryRecord({
    wirdZweitePersonBeruecksichtigt: arbitraryOption(arbitraryBoolean(), {
      nil: undefined,
    }),
  }).map((payload) => ({
    route: Route.ElternteilGemeinsamePlanungAbfrage,
    payload,
  })),
  // Geschwister loop: routes back to itself with the next index until the
  // recorded count is reached, then on to the Geschwisterbonus overview.
  arbitraryRecord({
    geschwisterkindIndex: arbitraryIndex,
    anzahlGeschwisterkinder: arbitraryAnzahlKinder,
    geburtsdatum: arbitraryGeburtsdatum,
    hatBehinderung: arbitraryBoolean(),
  }).map(
    ({
      geschwisterkindIndex,
      anzahlGeschwisterkinder,
      geburtsdatum,
      hatBehinderung,
    }) => ({
      route: Route.GeschwisterkindAngaben,
      params: { geschwisterkindIndex },
      payload: { geburtsdatum, hatBehinderung },
      dependentValues: { anzahlGeschwisterkinder },
    }),
  ),
  // Ausklammerung sub-flow (Erkrankung / Elternzeit / Mutterschutz). Routing
  // keys on the yes/no answer and the computed next-relevant-sibling index;
  // the Zeitspanne payloads themselves are not read here.
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    hatSchwangerschaftsbedingteErkrankung: arbitraryOptionalBoolean,
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      elternteilIndex,
      hatSchwangerschaftsbedingteErkrankung,
      naechster,
    }) => ({
      route: Route.ElternteilAusklammerungErkrankungAbfrage,
      params: { elternteilIndex },
      payload: { hatSchwangerschaftsbedingteErkrankung },
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    erkrankungSchwangerschaft: arbitraryArray(arbitraryZeitspanne, {
      maxLength: 3,
    }),
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(({ elternteilIndex, erkrankungSchwangerschaft, naechster }) => ({
    route: Route.ElternteilAusklammerungErkrankungZeitenAngaben,
    params: { elternteilIndex },
    payload: { erkrankungSchwangerschaft },
    dependentValues: {
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
    },
  })),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    geschwisterIndex: arbitraryIndex,
    hatElterngeldGeschwisterkind: arbitraryOptionalBoolean,
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      elternteilIndex,
      geschwisterIndex,
      hatElterngeldGeschwisterkind,
      naechster,
    }) => ({
      route: Route.ElternteilAusklammerungElternzeitAbfrage,
      params: { elternteilIndex, geschwisterIndex },
      payload: { hatElterngeldGeschwisterkind },
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    geschwisterIndex: arbitraryIndex,
    elterngeldGeschwisterkind: arbitraryArray(arbitraryZeitspanne, {
      maxLength: 3,
    }),
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      elternteilIndex,
      geschwisterIndex,
      elterngeldGeschwisterkind,
      naechster,
    }) => ({
      route: Route.ElternteilAusklammerungElternzeitZeitenAngaben,
      params: { elternteilIndex, geschwisterIndex },
      payload: { elterngeldGeschwisterkind },
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    geschwisterIndex: arbitraryIndex,
    hatMutterschutzGeschwisterkind: arbitraryOptionalBoolean,
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      elternteilIndex,
      geschwisterIndex,
      hatMutterschutzGeschwisterkind,
      naechster,
    }) => ({
      route: Route.ElternteilAusklammerungMutterschutzAbfrage,
      params: { elternteilIndex, geschwisterIndex },
      payload: { hatMutterschutzGeschwisterkind },
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    geschwisterIndex: arbitraryIndex,
    mutterschutzGeschwisterkind: arbitraryZeitspanne,
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      elternteilIndex,
      geschwisterIndex,
      mutterschutzGeschwisterkind,
      naechster,
    }) => ({
      route: Route.ElternteilAusklammerungMutterschutzZeitenAngaben,
      params: { elternteilIndex, geschwisterIndex },
      payload: { mutterschutzGeschwisterkind },
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  // Tätigkeiten sub-flow: which income pages follow, the Mischeinkunft loop
  // (a second Tätigkeit at index+1), and the exit to Elternteil 2 or "DONE".
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    payload: arbitraryTaetigkeitenFlags,
    istPersonAlleinerziehend: arbitraryBoolean(),
    wirdZweitePersonBeruecksichtigt: arbitraryBoolean(),
  }).map(
    ({
      elternteilIndex,
      payload,
      istPersonAlleinerziehend,
      wirdZweitePersonBeruecksichtigt,
    }) => ({
      route: Route.ElternteilTaetigkeitenAbfrage,
      params: { elternteilIndex },
      payload,
      dependentValues: {
        istPersonAlleinerziehend,
        wirdZweitePersonBeruecksichtigt,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    istPersonAlleinerziehend: arbitraryBoolean(),
    taetigkeiten: arbitraryTaetigkeitenFlags,
  }).map(({ elternteilIndex, istPersonAlleinerziehend, taetigkeiten }) => ({
    route: Route.ElternteilTaetigkeitenBMZUebersicht,
    params: { elternteilIndex },
    dependentValues: { istPersonAlleinerziehend, taetigkeiten },
  })),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    istKirchensteuerpflichtig: arbitraryBoolean(),
    istGesetzlichKrankenpflichtversichert: arbitraryBoolean(),
    istGesetzlichRentenversichert: arbitraryBoolean(),
    istGesetzlichArbeitlosenversichert: arbitraryBoolean(),
    bruttoJahresgewinn: arbitraryBruttoJahresgewinn,
  }).map(({ elternteilIndex, taetigkeitIndex, ...payload }) => ({
    route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
    params: { elternteilIndex, taetigkeitIndex },
    payload,
  })),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    istTaetigkeitMinijob: arbitraryBoolean(),
    kannDurchschnittAngegebenWerden: arbitraryBoolean(),
  }).map(
    ({
      elternteilIndex,
      taetigkeitIndex,
      istTaetigkeitMinijob,
      kannDurchschnittAngegebenWerden,
    }) => ({
      route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { istTaetigkeitMinijob },
      dependentValues: { kannDurchschnittAngegebenWerden },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    istEinkommenGleichVerteilt: arbitraryBoolean(),
  }).map(
    ({ elternteilIndex, taetigkeitIndex, istEinkommenGleichVerteilt }) => ({
      route: Route.ElternteilTaetigkeitAngabenMinijob,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { istEinkommenGleichVerteilt },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    steuerklasse: arbitrarySteuerklasse,
    istKirchensteuerpflichtig: arbitraryBoolean(),
    istGesetzlichKrankenpflichtversichert: arbitraryBoolean(),
    istGesetzlichRentenversichert: arbitraryBoolean(),
    istGesetzlichArbeitlosenversichert: arbitraryBoolean(),
    istEinkommenGleichVerteilt: arbitraryBoolean(),
  }).map(({ elternteilIndex, taetigkeitIndex, ...payload }) => ({
    route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
    params: { elternteilIndex, taetigkeitIndex },
    payload,
  })),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    durchschnittlichesMonatsbrutto: arbitraryMonatsbrutto,
    istMischeinkunft: arbitraryBoolean(),
  }).map(
    ({
      elternteilIndex,
      taetigkeitIndex,
      durchschnittlichesMonatsbrutto,
      istMischeinkunft,
    }) => ({
      route: Route.ElternteilTaetigkeitAngabenEinkommen,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { durchschnittlichesMonatsbrutto },
      dependentValues: { istMischeinkunft },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    monatsbrutto: arbitraryArray(arbitraryMonatsbrutto, {
      minLength: 12,
      maxLength: 12,
    }),
    istMischeinkunft: arbitraryBoolean(),
  }).map(
    ({ elternteilIndex, taetigkeitIndex, monatsbrutto, istMischeinkunft }) => ({
      route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { monatsbrutto },
      dependentValues: { istMischeinkunft },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    istWeitereTaetigkeitVorhanden: arbitraryBoolean(),
    istSelbststaendigeTaetigkeitMoeglich: arbitraryBoolean(),
    wirdZweitePersonBeruecksichtigt: arbitraryBoolean(),
  }).map(
    ({
      elternteilIndex,
      taetigkeitIndex,
      istWeitereTaetigkeitVorhanden,
      istSelbststaendigeTaetigkeitMoeglich,
      wirdZweitePersonBeruecksichtigt,
    }) => ({
      route: Route.ElternteilWeitereTaetigkeitAbfrage,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { istWeitereTaetigkeitVorhanden },
      dependentValues: {
        istSelbststaendigeTaetigkeitMoeglich,
        wirdZweitePersonBeruecksichtigt,
      },
    }),
  ),
  arbitraryRecord({
    elternteilIndex: arbitraryElternteilIndex,
    taetigkeitIndex: arbitraryIndex,
    istWeitereTaetigkeitSelbststaendigeTaetigkeit: arbitraryBoolean(),
  }).map(
    ({
      elternteilIndex,
      taetigkeitIndex,
      istWeitereTaetigkeitSelbststaendigeTaetigkeit,
    }) => ({
      route: Route.ElternteilWeitereTaetigkeitAngaben,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { istWeitereTaetigkeitSelbststaendigeTaetigkeit },
    }),
  ),
  // Elternteil 2: routing keys only on the dependentValues (whether a
  // pregnancy-related illness is still possible and the next relevant sibling).
  arbitraryRecord({
    name: arbitraryString({ minLength: 1 }),
    istImMutterschutz: arbitraryBoolean(),
    istSchwangerschaftsbedingteErkrankungMoeglich: arbitraryBoolean(),
    naechster: arbitraryNaechsterGeschwisterIndex,
  }).map(
    ({
      name,
      istImMutterschutz,
      istSchwangerschaftsbedingteErkrankungMoeglich,
      naechster,
    }) => ({
      route: Route.ElternteilZweiAllgemeineAngaben,
      payload: { name, istImMutterschutz },
      dependentValues: {
        istSchwangerschaftsbedingteErkrankungMoeglich,
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: naechster,
      },
    }),
  ),
  arbitraryRecord({
    errechneterEntbindungstermin: arbitraryGeburtsdatum,
    anzahl: arbitraryAnzahlKinder,
    istGeburtWahrscheinlich: arbitraryBoolean(),
  }).map(({ istGeburtWahrscheinlich, ...payload }) => ({
    route: Route.UngeborenesKindAngaben,
    payload,
    dependentValues: { istGeburtWahrscheinlich },
  })),
];

describe("findeNaechstenPfad (property)", () => {
  it("returns a known next path for every valid event", () => {
    assertProperty(
      property(arbitraryOneof(...formEventArbitraries), (event) =>
        istBekannterPfad(findeNaechstenPfad(event)),
      ),
      { numRuns: 500 },
    );
  });
});

function istBekannterPfad(pfad: string): boolean {
  return istInnerhalbAbfrageteil(pfad) || istEndeDesAbfrageteil(pfad);
}

function istInnerhalbAbfrageteil(path: string) {
  const allPathPatterns = Object.values(Route).map(
    (muster) =>
      new RegExp(`^/abfrageteil${muster.replace(/:[^/]+/g, "\\d+")}$`),
  );

  return allPathPatterns.some((pattern) => pattern.test(path));
}

function istEndeDesAbfrageteil(pfad: string) {
  return pfad === "/beispiele";
}

describe("findeNaechstenPfad (property helper functions)", () => {
  it("only accepts genuine routes as known paths", () => {
    expect(istBekannterPfad("/beispiele")).toBe(true);
    expect(istBekannterPfad("/abfrageteil/geschwisterkind/0")).toBe(true);
    expect(istBekannterPfad("/abfrageteil/gibt-es-nicht")).toBe(false);
    expect(istBekannterPfad("/abfrageteil/geschwisterkind/keinezahl")).toBe(
      false,
    );
  });
});
