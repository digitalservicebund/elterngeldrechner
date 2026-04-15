import { Temporal } from "@js-temporal/polyfill";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
  generatePathFromEvent,
} from "@/application/features/abfrageteil-next/routing";

export function filtereValideEventHistorie(
  eventStream: FormEvent[],
): FormEvent[] {
  const lastEvent = eventStream.at(-1);

  if (lastEvent === undefined) {
    return [];
  }

  return eventStream
    .reduceRight(
      (acc, event) => {
        const letzerEventPfad = generatePathFromEvent(acc[acc.length - 1]!);
        const naechsterPfad = findeNaechstenPfad(event);

        const istVorherigesEvent = naechsterPfad === letzerEventPfad;

        return [...acc, ...(istVorherigesEvent ? [event] : [])];
      },
      [lastEvent],
    )
    .toReversed();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("filtereValideEventHistorie", async () => {
    const { Steuerklasse } = await import("@/elterngeldrechner");

    it("returns empty array when no events are present", () => {
      const eventStream: FormEvent[] = [];

      const result: FormEvent[] = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([]);
    });

    it("returns all events when no events are skipped", () => {
      const eventStream: FormEvent[] = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        {
          route: Route.KindAbfrage,
          payload: {
            istGeboren: true,
          },
        },
      ];

      const result: FormEvent[] = filtereValideEventHistorie(eventStream);

      expect(result).toEqual(eventStream);
    });

    it("skips old KindAbfrage event when newer one exists with different payload", () => {
      const eventStream: FormEvent[] = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: false } },
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: true } },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: true } },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
      ]);
    });

    it("skips GeschwisterkindAngaben events when user changes istVorhanden to false", () => {
      const eventStream: FormEvent[] = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: true } },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
        {
          route: Route.GeschwisterkindAbfrage,
          payload: { istVorhanden: true },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2018-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: true } },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
        {
          route: Route.GeschwisterkindAbfrage,
          payload: { istVorhanden: true },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ]);
    });

    it("prunes old sibling events when user reduces sibling count by resubmitting index 0 with istWeiteresGeschwisterkindVorhanden false", () => {
      const eventStream: FormEvent[] = [
        {
          route: Route.GeschwisterkindAbfrage,
          payload: { istVorhanden: true },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
        {
          route: Route.GeschwisterkindAbfrage,
          payload: { istVorhanden: true },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ]);
    });

    it("prunes old income event and weiteTaetigkeitAbfrage when user resubmits with istMischeinkunft true", () => {
      const eventStream: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
          },
          dependentValues: { istPersonAlleinerziehend: false },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: false },
          dependentValues: { kannDurchschnittAngegebenWerden: true },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            steuerklasse: Steuerklasse.I,
            istKirchensteuerpflichtig: false,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            istEinkommenGleichVerteilt: true,
          },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { durchschnittlichesMonatsbrutto: 3000 },
          dependentValues: { istMischeinkunft: false },
        },
        {
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istWeitereTaetigkeitVorhanden: false },
          dependentValues: {
            istPersonAlleinerziehend: false,
            istSelbststaendigeTaetigkeitMoeglich: false,
          },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { durchschnittlichesMonatsbrutto: 3000 },
          dependentValues: { istMischeinkunft: true },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
          },
          dependentValues: { istPersonAlleinerziehend: false },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: false },
          dependentValues: { kannDurchschnittAngegebenWerden: true },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            steuerklasse: Steuerklasse.I,
            istKirchensteuerpflichtig: false,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            istEinkommenGleichVerteilt: true,
          },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { durchschnittlichesMonatsbrutto: 3000 },
          dependentValues: { istMischeinkunft: true },
        },
      ]);
    });
  });
}
