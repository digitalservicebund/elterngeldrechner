import { FormEvent, Route } from "@/application/routing";
import { posthog } from "@/application/user-tracking";
import { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";
import { bestimmeEinkommensarten } from "@/application/features/abfrageteil/pages/elternteil/tracking";
import { Steuerklasse } from "@/elterngeldrechner";

type NichtSelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

type SozialversicherungenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenSozialversicherungen }
>;

export function trackTaetigkeitenAngaben(
  events: FormEvent[],
  elternteilIndex: number,
) {
  const anteilMinijobs = bestimmeAnteilMinijobs(events, elternteilIndex);
  const anteilOhneSV = bestimmeAnteilOhneSV(events, elternteilIndex);

  if (anteilMinijobs !== undefined || anteilOhneSV !== undefined) {
    posthog.capture("taetigkeiten_angaben_abgeschlossen", {
      anteil_minijobs: anteilMinijobs,
      anteil_ohne_sozialversicherungen: anteilOhneSV,
    });
  }
}

function bestimmeAnteilMinijobs(events: FormEvent[], elternteilIndex: number) {
  const relevanteNichtSelbststaendigEvents = events.filter(
    (e): e is NichtSelbststaendigEvent => {
      return (
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig &&
        e.params.elternteilIndex === elternteilIndex
      );
    },
  );

  return berechneAnteil(
    relevanteNichtSelbststaendigEvents,
    (e) => e.payload.istTaetigkeitMinijob === true,
  );
}

function bestimmeAnteilOhneSV(events: FormEvent[], elternteilIndex: number) {
  const relevanteSozialversicherungenEvents = events.filter(
    (e): e is SozialversicherungenEvent => {
      return (
        e.route === Route.ElternteilTaetigkeitAngabenSozialversicherungen &&
        e.params.elternteilIndex === elternteilIndex
      );
    },
  );

  return berechneAnteil(
    relevanteSozialversicherungenEvents,
    (e) =>
      e.payload.istGesetzlichKrankenpflichtversichert === false &&
      e.payload.istGesetzlichRentenversichert === false &&
      e.payload.istGesetzlichArbeitlosenversichert === false,
  );
}

function berechneAnteil<T>(
  events: T[],
  istZuBeruecksichtigen: (event: T) => boolean,
) {
  const anzahlEvents = events.length;

  if (anzahlEvents === 0) return undefined;

  const anzahlGefilterterEvents = events.filter(istZuBeruecksichtigen).length;

  return anzahlGefilterterEvents / anzahlEvents;
}

export function ueberpruefeTrackingEinkommensarten(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
) {
  const relevanteNichtSelbststaendigEvents = events.filter(
    (e): e is NichtSelbststaendigEvent => {
      return (
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig &&
        e.params.elternteilIndex === elternteilIndex
      );
    },
  );

  if (relevanteNichtSelbststaendigEvents.length > 0) {
    const korrigierteTaetigkeiten: ElternteilTaetigkeitenAbfrage = {
      ...taetigkeiten,
      istNichtSelbststaendig: true,
    };

    const superProperty = `einkommensarten_elternteil_${elternteilIndex + 1}`;
    posthog.register({
      [superProperty]: bestimmeEinkommensarten(korrigierteTaetigkeiten),
    });
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach, afterEach } = import.meta
    .vitest;

  function nichtSelbststaendigEvent(
    elternteilIndex: number,
    taetigkeitIndex: number,
    istTaetigkeitMinijob: boolean,
  ): NichtSelbststaendigEvent {
    return {
      route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
      params: { elternteilIndex, taetigkeitIndex },
      payload: { istTaetigkeitMinijob },
      dependentValues: { kannDurchschnittAngegebenWerden: false },
    };
  }

  function sozialversicherungenEvent(
    elternteilIndex: number,
    taetigkeitIndex: number,
    sv: {
      istGesetzlichKrankenpflichtversichert: boolean;
      istGesetzlichRentenversichert: boolean;
      istGesetzlichArbeitlosenversichert: boolean;
    },
  ): SozialversicherungenEvent {
    return {
      route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
      params: { elternteilIndex, taetigkeitIndex },
      payload: {
        steuerklasse: Steuerklasse.I,
        istKirchensteuerpflichtig: false,
        istEinkommenGleichVerteilt: false,
        ...sv,
      },
    };
  }

  const MIT_SV = {
    istGesetzlichKrankenpflichtversichert: true,
    istGesetzlichRentenversichert: true,
    istGesetzlichArbeitlosenversichert: true,
  };

  const OHNE_SV = {
    istGesetzlichKrankenpflichtversichert: false,
    istGesetzlichRentenversichert: false,
    istGesetzlichArbeitlosenversichert: false,
  };

  afterEach(() => vi.restoreAllMocks());

  describe("trackTaetigkeitenAngaben", () => {
    let captureSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      captureSpy = vi.spyOn(posthog, "capture").mockReturnValue(undefined);
    });

    it("does not capture anything when there are no relevant Tätigkeiten", () => {
      trackTaetigkeitenAngaben([], 0);

      expect(captureSpy).not.toHaveBeenCalled();
    });

    it("captures anteil_minijobs alone when no Sozialversicherungen data exists yet", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0, anteil_ohne_sozialversicherungen: undefined },
      );
    });

    it("captures anteil_minijobs as 0 when none of the Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, false),
        nichtSelbststaendigEvent(0, 1, false),
        sozialversicherungenEvent(0, 0, MIT_SV),
        sozialversicherungenEvent(0, 1, MIT_SV),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0, anteil_ohne_sozialversicherungen: 0 },
      );
    });

    it("captures anteil_minijobs as 1 when all Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, true),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 1, anteil_ohne_sozialversicherungen: undefined },
      );
    });

    it("captures the ratio for a mix of Minijob and regular Tätigkeiten", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, false),
        sozialversicherungenEvent(0, 1, MIT_SV),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0.5, anteil_ohne_sozialversicherungen: 0 },
      );
    });

    it("captures anteil_ohne_sozialversicherungen as 1 when no Sozialversicherung applies at all", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, false),
        sozialversicherungenEvent(0, 0, OHNE_SV),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0, anteil_ohne_sozialversicherungen: 1 },
      );
    });

    it("only counts a Sozialversicherungen event as 'ohne SV' when all three Versicherungsarten are false", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, false),
        sozialversicherungenEvent(0, 0, {
          ...OHNE_SV,
          istGesetzlichRentenversichert: true,
        }),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0, anteil_ohne_sozialversicherungen: 0 },
      );
    });

    it("ignores Tätigkeiten belonging to a different Elternteil", () => {
      const events = [
        nichtSelbststaendigEvent(1, 0, true),
        sozialversicherungenEvent(1, 0, MIT_SV),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).not.toHaveBeenCalled();
    });
  });

  describe("ueberpruefeTrackingEinkommensarten", () => {
    const taetigkeiten: ElternteilTaetigkeitenAbfrage = {
      istSelbststaendig: false,
      istNichtSelbststaendig: false,
      istVerbeamtet: false,
      hatAndereLeistungen: false,
      hatPeriodenOhneEinkommen: false,
    };

    let registerSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      registerSpy = vi.spyOn(posthog, "register");
    });

    it("does not register anything when there are no relevant Tätigkeiten", () => {
      ueberpruefeTrackingEinkommensarten([], 0, taetigkeiten);

      expect(registerSpy).not.toHaveBeenCalled();
    });

    it("corrects istNichtSelbststaendig to true before deriving Einkommensarten", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      ueberpruefeTrackingEinkommensarten(events, 0, taetigkeiten);

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_1: ["Angestellt"],
      });
    });

    it("does not mutate the taetigkeiten object passed in", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      ueberpruefeTrackingEinkommensarten(events, 0, taetigkeiten);

      expect(taetigkeiten.istNichtSelbststaendig).toBe(false);
    });

    it("keeps other Einkommensarten alongside the corrected one", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      ueberpruefeTrackingEinkommensarten(events, 0, {
        ...taetigkeiten,
        istSelbststaendig: true,
      });

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_1: ["Selbstständig", "Angestellt"],
      });
    });

    it("builds the superProperty key from elternteilIndex + 1", () => {
      const events = [nichtSelbststaendigEvent(1, 0, false)];

      ueberpruefeTrackingEinkommensarten(events, 1, taetigkeiten);

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_2: ["Angestellt"],
      });
    });
  });
}
