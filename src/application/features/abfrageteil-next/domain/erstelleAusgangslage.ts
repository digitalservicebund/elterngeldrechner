import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeGeschwisterkinder } from "./findeGeschwisterkinder";
import { findeInformationenZumMutterschutz } from "./findeInformationenZumMutterschutz";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import type { Ausgangslage } from "@/monatsplaner/Ausgangslage/Ausgangslage";
import { Elternteil } from "@/monatsplaner/Elternteil";

export function erstelleAusgangslage(events: FormEvent[]): Ausgangslage {
  const anzahlKinder = findeAnzahlKinder(events);
  const sindMehrlinge = anzahlKinder > 1;
  const geburtsdatumDesKindes = new Date(findeGeburtsdatum(events).toString());
  const hatBehindertesGeschwisterkind = findeGeschwisterkinder(events).some(
    (geschwisterkind) => geschwisterkind.hatBehinderung,
  );
  const informationenZumMutterschutz = findeInformationenZumMutterschutz(
    events,
    anzahlKinder,
  );

  return {
    sindMehrlinge,
    anzahlElternteile: 1,
    geburtsdatumDesKindes,
    hatBehindertesGeschwisterkind,
    informationenZumMutterschutz,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleAusgangslage", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

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
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.geburtsdatumDesKindes).toEqual(
          new Date("2025-09-01"),
        );
      });
    });

    describe("anzahlElternteile", () => {
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
            route: Route.ElternteilAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: true,
            },
            params: {
              elternteilIndex: 0,
            },
          },
        ];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.anzahlElternteile).toEqual(1);
      });

      it("is 2 when Elternteil 2 event also exists", () => {
        // TODO: Implement once the schema for Elternteil 2 is in place.
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
              istWeiteresGeschwisterkindVorhanden: false,
            },
          },
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
              istWeiteresGeschwisterkindVorhanden: true,
            },
          },
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 1 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
              hatBehinderung: true,
              istWeiteresGeschwisterkindVorhanden: false,
            },
          },
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
        route: Route.ElternteilAllgemeineAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: false,
        },
      };

      const elternteil1MitMutterschutz: FormEvent = {
        route: Route.ElternteilAllgemeineAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      };

      it("is undefined when Elternteil 1 is not in Mutterschutz", () => {
        const events: FormEvent[] = [kindEvent, elternteil1OhneMutterschutz];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.informationenZumMutterschutz).toBeUndefined();
      });

      it("sets Elternteil.Eins as Empfänger for one Elternteil in Mutterschutz", () => {
        const events: FormEvent[] = [kindEvent, elternteil1MitMutterschutz];

        const ausgangslage = erstelleAusgangslage(events);

        expect(ausgangslage.informationenZumMutterschutz?.empfaenger).toEqual(
          Elternteil.Eins,
        );
      });

      it("sets letzterLebensmonatMitSchutz to 2 for a single child", () => {
        const events: FormEvent[] = [kindEvent, elternteil1MitMutterschutz];

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
        // TODO: Implement once the schema for Elternteil 2 is in place.
      });
    });

    describe("mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum", () => {
      it("is false when both Elternteile have hatKeinEinkommen", () => {
        // TODO: Implement once the schema for Elternteil 2 is in place.
      });

      it("is true when any Elternteil does not have hatKeinEinkommen", () => {
        // TODO: Implement once the schema for Elternteil 2 is in place.
      });
    });
  });
}
