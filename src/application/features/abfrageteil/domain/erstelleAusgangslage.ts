import { findeAlleinerziehend } from "./findeAlleinerziehend";
import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeGeschwisterkinder } from "./findeGeschwisterkinder";
import { findeInformationenZumMutterschutz } from "./findeInformationenZumMutterschutz";
import { sindBeideElternteile } from "./sindBeideElternteile";
import { ueberpruefeErwerbstaetigkeit } from "./ueberpruefeErwerbstaetigkeit";
import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import type {
  AusgangslageFuerEinElternteil,
  AusgangslageFuerZweiElternteile,
} from "@/monatsplaner/Ausgangslage/Ausgangslage";
import { Elternteil } from "@/monatsplaner/Elternteil";
import { InformationenZumMutterschutz } from "@/monatsplaner/InformationenZumMutterschutz";

export function erstelleAusgangslage(
  events: FormEvent[],
): AusgangslageFuerEinElternteil | AusgangslageFuerZweiElternteile {
  const anzahlKinder = findeAnzahlKinder(events);
  const sindMehrlinge = anzahlKinder > 1;
  const geburtsdatumDesKindes = new Date(findeGeburtsdatum(events).toString());
  const hatBehindertesGeschwisterkind = findeGeschwisterkinder(events).some(
    (geschwisterkind) => geschwisterkind.hatBehinderung,
  );

  const mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum =
    warMindestensEinElternteilErwerbstaetig(events);

  if (findeAlleinerziehend(events)) {
    const informationenZumMutterschutz = findeInformationenZumMutterschutz(
      events,
      anzahlKinder,
    ) as InformationenZumMutterschutz<Elternteil.Eins>;

    return {
      sindMehrlinge,
      anzahlElternteile: 1,
      geburtsdatumDesKindes,
      istAlleinerziehend: true,
      hatBehindertesGeschwisterkind,
      informationenZumMutterschutz,
      mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
    };
  }

  const wirdZweitePersonBeruecksichtigt = sindBeideElternteile(events);

  if (wirdZweitePersonBeruecksichtigt) {
    const zweitePersonAngaben = findeAngabenZurZweitenPerson(events);
    const informationenZumMutterschutz = findeInformationenZumMutterschutz(
      events,
      anzahlKinder,
    );
    const nameDesErstenElternteils = findeNameDesErstenElternteils(events);

    return {
      sindMehrlinge,
      anzahlElternteile: 2,
      geburtsdatumDesKindes,
      istAlleinerziehend: false,
      hatBehindertesGeschwisterkind,
      informationenZumMutterschutz,
      mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
      namenDerElternteile: {
        [Elternteil.Eins]: nameDesErstenElternteils,
        [Elternteil.Zwei]: zweitePersonAngaben.name,
      },
    };
  } else {
    const informationenZumMutterschutz = findeInformationenZumMutterschutz(
      events,
      anzahlKinder,
    ) as InformationenZumMutterschutz<Elternteil.Eins>;

    return {
      sindMehrlinge,
      anzahlElternteile: 1,
      geburtsdatumDesKindes,
      hatBehindertesGeschwisterkind,
      informationenZumMutterschutz,
      mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
    };
  }
}

function findeAngabenZurZweitenPerson(events: FormEvent[]) {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilZweiAllgemeineAngaben,
  );

  if (!letztesGueltigesEvent) {
    throw new Error(`Missing event for Angaben of Elternteil 2.`);
  }

  return letztesGueltigesEvent;
}

function findeNameDesErstenElternteils(events: FormEvent[]): string {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilEinsAllgemeineAngaben,
  );

  if (!letztesGueltigesEvent) {
    throw new Error(`Missing event for Allgemein Angaben of Elternteil 1.`);
  }

  return letztesGueltigesEvent.name;
}

function warMindestensEinElternteilErwerbstaetig(events: FormEvent[]): boolean {
  const hatElternteilEinsErwerbstaetigkeit = ueberpruefeErwerbstaetigkeit(
    events,
    0,
  );
  const hatElternteilZweiErwerbstaetigkeit = ueberpruefeErwerbstaetigkeit(
    events,
    1,
  );

  return (
    hatElternteilEinsErwerbstaetigkeit || hatElternteilZweiErwerbstaetigkeit
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleAusgangslage", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    const zweitePersonNichtBeruecksichtigt: FormEvent = {
      route: Route.ElternteilGemeinsamePlanungAbfrage,
      payload: { wirdZweitePersonBeruecksichtigt: false },
    };

    describe("geburtsdatumDesKindes", () => {
      it("uses geburtsdatum from GeborenesKindAngaben", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date("2025-12-23"),
        );
      });

      it("uses geburtsdatum from WahrscheinlichGeborenesKindAbfrage", () => {
        const events: FormEvent[] = [
          {
            route: Route.UngeborenesKindAngaben,
            payload: {
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-03-01"),
              anzahl: 1,
            },
          },
          {
            route: Route.WahrscheinlichGeborenesKindAbfrage,
            payload: { geburtsdatum: Temporal.PlainDate.from("2025-03-20") },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date("2025-03-20"),
        );
      });

      it("uses errechneterEntbindungstermin from UngeborenesKindAngaben", () => {
        const events: FormEvent[] = [
          {
            route: Route.UngeborenesKindAngaben,
            payload: {
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-09-01"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date("2025-09-01"),
        );
      });
    });

    describe("anzahlElternteile", () => {
      it("is 1 when Person 1 is alleinerziehend and no ElternteilZweiAllgemeineAngaben event exists", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: true,
              istImMutterschutz: false,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.anzahlElternteile).toEqual(1);
      });

      it("throws when neither ElternteilZweiAllgemeineAngaben nor ElternteilEinsAllgemeineAngaben for Elternteil 1 is present", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
        ];

        expect(() => erstelleAusgangslage(events)).toThrow();
      });

      it("is 1 when only Elternteil 1 event exists", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: true,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.anzahlElternteile).toEqual(1);
      });

      it("is 2 when ElternteilZweiAllgemeineAngaben has wirdZweitePersonBeruecksichtigt unknown", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
          },
          {
            route: Route.ElternteilGemeinsamePlanungAbfrage,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
            },
          },
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: {
              name: "Max",
            },
            dependentValues: {
              istSchwangerschaftsbedingteErkrankungMoeglich: true,
              anzahlGeschwister: 1,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.anzahlElternteile).toEqual(2);
      });

      it("is 2 when ElternteilZweiAllgemeineAngaben has wirdZweitePersonBeruecksichtigt true", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
          },
          {
            route: Route.ElternteilGemeinsamePlanungAbfrage,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
            },
          },
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: { name: "Max" },
            dependentValues: {
              istSchwangerschaftsbedingteErkrankungMoeglich: true,
              anzahlGeschwister: 1,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.anzahlElternteile).toEqual(2);
      });
    });

    describe("sindMehrlinge", () => {
      it("is false when anzahl is 1", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.sindMehrlinge).toEqual(false);
      });

      it("is true when anzahl is greater than 1", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 2,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.sindMehrlinge).toEqual(true);
      });
    });

    describe("hatBehindertesGeschwisterkind", () => {
      const kindEvent: FormEvent = {
        route: Route.GeborenesKindAngaben,
        payload: {
          geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
          errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-20"),
          anzahl: 1,
        },
      };

      it("is false when GeschwisterkindAbfrage says not present", () => {
        const events: FormEvent[] = [
          kindEvent,
          {
            route: Route.GeschwisterkindAbfrage,
            payload: { istVorhanden: false },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.hatBehindertesGeschwisterkind).toEqual(false);
      });

      it("is false when all Geschwisterkinder have no Behinderung", () => {
        const events: FormEvent[] = [
          kindEvent,
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 0 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2022-05-10"),
              hatBehinderung: false,
            },
            dependentValues: {
              anzahlGeschwister: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.hatBehindertesGeschwisterkind).toEqual(false);
      });

      it("is true when any Geschwisterkind has a Behinderung", () => {
        const events: FormEvent[] = [
          kindEvent,
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 0 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
              hatBehinderung: false,
            },
            dependentValues: {
              anzahlGeschwister: 2,
            },
          },
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 1 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
              hatBehinderung: true,
            },
            dependentValues: {
              anzahlGeschwister: 2,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Person 1",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.hatBehindertesGeschwisterkind).toEqual(true);
      });
    });

    describe("informationenZumMutterschutz", () => {
      const kindEvent: FormEvent = {
        route: Route.GeborenesKindAngaben,
        payload: {
          geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
          errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-20"),
          anzahl: 1,
        },
      };

      const elternteil1OhneMutterschutz: FormEvent = {
        route: Route.ElternteilEinsAllgemeineAngaben,
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: false,
        },
      };

      const elternteil1MitMutterschutz: FormEvent = {
        route: Route.ElternteilEinsAllgemeineAngaben,
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      };

      it("is undefined when Elternteil 1 is not in Mutterschutz", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1OhneMutterschutz,
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.informationenZumMutterschutz).toBeUndefined();
      });

      it("sets Elternteil.Eins as Empfänger for one Elternteil in Mutterschutz", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1MitMutterschutz,
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.informationenZumMutterschutz?.empfaenger).toEqual(
          Elternteil.Eins,
        );
      });

      it("sets letzterLebensmonatMitSchutz to 2 for a single child", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1MitMutterschutz,
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.informationenZumMutterschutz
            ?.letzterLebensmonatMitSchutz,
        ).toEqual(2);
      });

      it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 2,
            },
          },
          elternteil1MitMutterschutz,
          zweitePersonNichtBeruecksichtigt,
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.informationenZumMutterschutz
            ?.letzterLebensmonatMitSchutz,
        ).toEqual(3);
      });
    });

    describe("namenDerElternteile", () => {
      it("assigns names to both Elternteile", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
          },
          {
            route: Route.ElternteilGemeinsamePlanungAbfrage,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
            },
          },
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: { name: "Max" },
            dependentValues: {
              istSchwangerschaftsbedingteErkrankungMoeglich: true,
              anzahlGeschwister: 1,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.namenDerElternteile).toEqual({
          [Elternteil.Eins]: "Hanna",
          [Elternteil.Zwei]: "Max",
        });
      });
    });

    describe("mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum", () => {
      const kindEvent: FormEvent = {
        route: Route.GeborenesKindAngaben,
        payload: {
          geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
          errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-20"),
          anzahl: 1,
        },
      };

      const elternteil1Event: FormEvent = {
        route: Route.ElternteilEinsAllgemeineAngaben,
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      };

      const zweitePersonEvent: FormEvent = {
        route: Route.ElternteilZweiAllgemeineAngaben,
        payload: { name: "Max" },
        dependentValues: {
          istSchwangerschaftsbedingteErkrankungMoeglich: true,
          anzahlGeschwister: 1,
        },
      };

      it("is false when alleinerziehend Elternteil has only hatPeriodenOhneEinkommen", () => {
        const events: FormEvent[] = [
          kindEvent,
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: true,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toEqual(false);
      });

      it("is true when alleinerziehend Elternteil is angestellt", () => {
        const events: FormEvent[] = [
          kindEvent,
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: false,
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
              hatPeriodenOhneEinkommen: true,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toEqual(true);
      });

      it("is false when both Elternteile have only hatPeriodenOhneEinkommen", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1Event,
          zweitePersonEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: true,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 1 },
            payload: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: true,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toEqual(false);
      });

      it("is false when both Elternteile have only hatAndereLeistungen true", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1Event,
          zweitePersonEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              hatAndereLeistungen: true,
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 1 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              hatAndereLeistungen: true,
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toEqual(false);
      });

      it("is true when any Elternteil does not have only hatPeriodenOhneEinkommen", () => {
        const events: FormEvent[] = [
          kindEvent,
          elternteil1Event,
          zweitePersonEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: true,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 1 },
            payload: {
              hatPeriodenOhneEinkommen: true,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(
          ausgangslage.mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
        ).toEqual(true);
      });
    });

    describe("istAlleinerziehend", () => {
      it("is true if Elterteil Eins is alleinerziehend", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-20"),
              anzahl: 1,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: false,
            },
          },
          {
            route: Route.ElternteilGemeinsamePlanungAbfrage,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
            },
          },
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: { name: "Max" },
            dependentValues: {
              istSchwangerschaftsbedingteErkrankungMoeglich: true,
              anzahlGeschwister: 1,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.istAlleinerziehend).toEqual(true);
      });
    });
  });
}
