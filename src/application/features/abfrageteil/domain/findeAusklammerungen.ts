import { Temporal } from "@js-temporal/polyfill";
import { differenceInDays } from "date-fns";
import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections/findeLetztesGueltigesEvent";
import type { ElternteilAusklammerungZeiten } from "@/application/features/abfrageteil/pages/elternteil/ElternteilSchema";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import type { Ausklammerung } from "@/bemessungszeitraumrechner";
import { berechneMutterschutz } from "@/mutterschutzrechner";

export function findeAusklammerungen(
  events: FormEvent[],
  elternteilIndex: number,
  ignoriereVerbeamtungsCheck?: boolean,
): Ausklammerung[] {
  const ausklammerungszeitenEvent = findeAusklammerungszeiten(
    events,
    elternteilIndex,
  );

  const eingegebeneAusklammerungen = ausklammerungszeitenEvent
    ? flacheAusklammerungen(ausklammerungszeitenEvent)
    : [];

  if (istImMutterschutz(events, elternteilIndex, ignoriereVerbeamtungsCheck)) {
    const errechneteAusklammerungen = [
      errechneMutterschutzAusklammerung(events),
    ];

    return [...eingegebeneAusklammerungen, ...errechneteAusklammerungen];
  } else {
    return eingegebeneAusklammerungen;
  }
}

function errechneMutterschutzAusklammerung(events: FormEvent[]) {
  const errechneterEntbindungstermin =
    findeErrechnetenEntbindungstermin(events);
  const geburtsdatum = findeGeburtsdatum(events);
  const anzahlKinder = findeAnzahlKinder(events);

  const mutterschutz = berechneMutterschutz(
    errechneterEntbindungstermin,
    geburtsdatum,
    ueberpruefeVerlaengerungsgrundMutterschutz(
      errechneterEntbindungstermin,
      anzahlKinder,
      geburtsdatum,
    ),
  );

  const startdatumMilliseconds = Temporal.Instant.fromEpochMilliseconds(
    mutterschutz.startdatum.getTime(),
  );

  const enddatumMilliseconds = Temporal.Instant.fromEpochMilliseconds(
    mutterschutz.enddatum.getTime(),
  );

  return {
    grund: "mutterschutz",
    von: startdatumMilliseconds.toZonedDateTimeISO("UTC").toPlainDate(),
    bis: enddatumMilliseconds.toZonedDateTimeISO("UTC").toPlainDate(),
  } satisfies Ausklammerung;
}

function findeErrechnetenEntbindungstermin(events: FormEvent[]): Date {
  for (const event of [...events].reverse()) {
    if (
      event.route === Route.GeborenesKindAngaben ||
      event.route === Route.UngeborenesKindAngaben
    ) {
      const { errechneterEntbindungstermin } = event.payload;

      return new Date(
        errechneterEntbindungstermin.toZonedDateTime("UTC").epochMilliseconds,
      );
    }
  }

  throw new Error("At least one event of the Kind flow is required.");
}

function findeGeburtsdatum(events: FormEvent[]): Date | undefined {
  for (const event of [...events].reverse()) {
    if (
      event.route === Route.GeborenesKindAngaben ||
      event.route === Route.WahrscheinlichGeborenesKindAbfrage
    ) {
      const { geburtsdatum } = event.payload;

      return new Date(geburtsdatum.toZonedDateTime("UTC").epochMilliseconds);
    }
  }

  return undefined;
}

function ueberpruefeVerlaengerungsgrundMutterschutz(
  errechneterEntbindungstermin: Date,
  anzahlKinder: number,
  geburtsdatum?: Date,
): boolean | undefined {
  if (anzahlKinder > 1) return true;

  if (geburtsdatum) {
    const differenzZwischenGeburtUndET = differenceInDays(
      errechneterEntbindungstermin,
      geburtsdatum,
    );
    return differenzZwischenGeburtUndET > 42;
  }

  return undefined;
}

function istImMutterschutz(
  events: FormEvent[],
  elternteilIndex: number,
  ignoriereVerbeamtungsCheck?: boolean,
): boolean {
  const route =
    elternteilIndex === 0
      ? Route.ElternteilEinsAllgemeineAngaben
      : Route.ElternteilZweiAllgemeineAngaben;

  const elternteilEvent = findeLetztesGueltigesEvent(events, route);
  const istElternteilImMutterschutz =
    elternteilEvent?.istImMutterschutz ?? false;

  if (ignoriereVerbeamtungsCheck) {
    return istElternteilImMutterschutz;
  }

  const taetigkeitenAbfrage = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenAbfrage,
    { elternteilIndex },
  );

  if (taetigkeitenAbfrage) {
    return taetigkeitenAbfrage.istVerbeamtet
      ? false
      : istElternteilImMutterschutz;
  }

  return istElternteilImMutterschutz;
}

function findeAusklammerungszeiten(
  events: FormEvent[],
  elternteilIndex: number,
) {
  return findeLetztesGueltigesEvent(
    events,
    Route.ElternteilAusklammerungZeitenAngaben,
    { elternteilIndex },
  );
}

function flacheAusklammerungen(
  ausklammerungszeiten: ElternteilAusklammerungZeiten,
): Ausklammerung[] {
  return (
    Object.keys(ausklammerungszeiten) as (keyof ElternteilAusklammerungZeiten)[]
  ).flatMap((grund) =>
    ausklammerungszeiten[grund].map((zeitraum) => ({ ...zeitraum, grund })),
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeAusklammerungen", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns empty array when no event exists for the elternteilIndex and Elternteil not in mutterschutz", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: false,
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([]);
    });

    it("returns only Mutterschutz for this child when no other Ausklammerung given", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2026-03-03"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2026-03-03"),
            anzahl: 1,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([
        {
          grund: "mutterschutz",
          von: Temporal.PlainDate.from("2026-01-20"),
          bis: Temporal.PlainDate.from("2026-04-28"),
        },
      ]);
    });

    it("returns empty array when Mutterschutz and no other Ausklammerung given but person is beamtet", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2026-03-03"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2026-03-03"),
            anzahl: 1,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: true,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([]);
    });

    it("returns empty array for second person when first person has mutterschutz", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2026-03-03"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2026-03-03"),
            anzahl: 1,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
            name: "Person 2",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 1 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(findeAusklammerungen(events, 1)).toEqual([]);
    });

    it("returns empty array when no event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: false,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 1 },
          payload: {
            mutterschutzGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([]);
    });

    it("flattens all Ausklammerungszeiträume with their Grund", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: false,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeldGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2023-01-01"),
                bis: Temporal.PlainDate.from("2023-06-30"),
              },
            ],
            erkrankungSchwangerschaft: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([
        {
          grund: "mutterschutzGeschwisterkind",
          von: Temporal.PlainDate.from("2024-11-01"),
          bis: Temporal.PlainDate.from("2025-02-15"),
        },
        {
          grund: "elterngeldGeschwisterkind",
          von: Temporal.PlainDate.from("2023-01-01"),
          bis: Temporal.PlainDate.from("2023-06-30"),
        },
      ]);
    });

    it("uses the most recent event for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: false,
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
        {
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2024-11-01"),
                bis: Temporal.PlainDate.from("2025-02-15"),
              },
            ],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        },
      ];

      expect(findeAusklammerungen(events, 0)).toEqual([
        {
          grund: "mutterschutzGeschwisterkind",
          von: Temporal.PlainDate.from("2024-11-01"),
          bis: Temporal.PlainDate.from("2025-02-15"),
        },
      ]);
    });
  });

  describe("ueberpruefeVerlaengerungsgrundMutterschutz", () => {
    it("returns true when anzahlKinder greater than 1", () => {
      const errechneterEntbindungstermin = new Date("2026-03-09");
      const anzahlKinder = 2;

      expect(
        ueberpruefeVerlaengerungsgrundMutterschutz(
          errechneterEntbindungstermin,
          anzahlKinder,
        ),
      ).toEqual(true);
    });

    it("returns undefined when anzahlKinder 1 and geburtsdatum undefined", () => {
      const errechneterEntbindungstermin = new Date("2026-03-09");
      const anzahlKinder = 1;

      expect(
        ueberpruefeVerlaengerungsgrundMutterschutz(
          errechneterEntbindungstermin,
          anzahlKinder,
        ),
      ).toEqual(undefined);
    });

    it("returns false when anzahlKinder 1 and geburtsdatum not 6 weeks earlier than ET", () => {
      const errechneterEntbindungstermin = new Date("2026-03-09");
      const geburtsdatum = new Date("2026-03-09");
      const anzahlKinder = 1;

      expect(
        ueberpruefeVerlaengerungsgrundMutterschutz(
          errechneterEntbindungstermin,
          anzahlKinder,
          geburtsdatum,
        ),
      ).toEqual(false);
    });

    it("returns true when anzahlKinder 1 and geburtsdatum 43 days earlier than ET", () => {
      const errechneterEntbindungstermin = new Date("2026-03-09");
      const geburtsdatum = new Date("2026-01-25");
      const anzahlKinder = 1;

      expect(
        ueberpruefeVerlaengerungsgrundMutterschutz(
          errechneterEntbindungstermin,
          anzahlKinder,
          geburtsdatum,
        ),
      ).toEqual(true);
    });
  });
}
