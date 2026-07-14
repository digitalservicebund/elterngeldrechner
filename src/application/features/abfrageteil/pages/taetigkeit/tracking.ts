import { FormEvent, Route } from "@/application/routing";
import { posthog } from "@/application/user-tracking";
import { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";
import { bestimmeEinkommensarten } from "@/application/features/abfrageteil/pages/elternteil/tracking";
import { Steuerklasse } from "@/elterngeldrechner";

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

export function trackEinkommensarten(
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

function bestimmeAnteilMinijobs(events: FormEvent[], elternteilIndex: number) {
  const relevanteNichtSelbststaendigEvents = events.filter(
    (e): e is NichtSelbststaendigEvent => {
      return (
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig &&
        e.params.elternteilIndex === elternteilIndex
      );
    },
  );

  return calculateShare(
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

  return calculateShare(
    relevanteSozialversicherungenEvents,
    (e) =>
      e.payload.istGesetzlichKrankenpflichtversichert === false &&
      e.payload.istGesetzlichRentenversichert === false &&
      e.payload.istGesetzlichArbeitlosenversichert === false,
  );
}

function calculateShare<T>(elements: T[], predicate: (event: T) => boolean) {
  return elements.length > 0
    ? elements.filter(predicate).length / elements.length
    : undefined;
}

type NichtSelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

type SozialversicherungenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenSozialversicherungen }
>;

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

    it("captures both ratios when both kinds of Tätigkeiten data exist", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        sozialversicherungenEvent(0, 0, OHNE_SV),
      ];

      trackTaetigkeitenAngaben(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 1, anteil_ohne_sozialversicherungen: 1 },
      );
    });
  });

  describe("trackEinkommensarten", () => {
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
      trackEinkommensarten([], 0, taetigkeiten);

      expect(registerSpy).not.toHaveBeenCalled();
    });

    it("corrects istNichtSelbststaendig to true before deriving Einkommensarten", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      trackEinkommensarten(events, 0, taetigkeiten);

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_1: ["Angestellt"],
      });
    });

    it("does not mutate the taetigkeiten object passed in", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      trackEinkommensarten(events, 0, taetigkeiten);

      expect(taetigkeiten.istNichtSelbststaendig).toBe(false);
    });

    it("keeps other Einkommensarten alongside the corrected one", () => {
      const events = [nichtSelbststaendigEvent(0, 0, false)];

      trackEinkommensarten(events, 0, {
        ...taetigkeiten,
        istSelbststaendig: true,
      });

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_1: ["Selbstständig", "Angestellt"],
      });
    });

    it("builds the superProperty key from elternteilIndex + 1", () => {
      const events = [nichtSelbststaendigEvent(1, 0, false)];

      trackEinkommensarten(events, 1, taetigkeiten);

      expect(registerSpy).toHaveBeenCalledWith({
        einkommensarten_elternteil_2: ["Angestellt"],
      });
    });
  });

  describe("bestimmeAnteilMinijobs", () => {
    it("returns undefined when there are no relevant Tätigkeiten", () => {
      expect(bestimmeAnteilMinijobs([], 0)).toBeUndefined();
    });

    it("returns 0 when none of the Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, false),
        nichtSelbststaendigEvent(0, 1, false),
      ];

      expect(bestimmeAnteilMinijobs(events, 0)).toBe(0);
    });

    it("returns 1 when all Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, true),
      ];

      expect(bestimmeAnteilMinijobs(events, 0)).toBe(1);
    });

    it("returns the ratio for a mix of Minijob and regular Tätigkeiten", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, false),
      ];

      expect(bestimmeAnteilMinijobs(events, 0)).toBe(0.5);
    });

    it("ignores Tätigkeiten belonging to a different Elternteil", () => {
      const events = [nichtSelbststaendigEvent(1, 0, true)];

      expect(bestimmeAnteilMinijobs(events, 0)).toBeUndefined();
    });
  });

  describe("bestimmeAnteilOhneSV", () => {
    it("returns undefined when there are no relevant Sozialversicherungen events", () => {
      expect(bestimmeAnteilOhneSV([], 0)).toBeUndefined();
    });

    it("returns 0 when Sozialversicherung applies", () => {
      const events = [sozialversicherungenEvent(0, 0, MIT_SV)];

      expect(bestimmeAnteilOhneSV(events, 0)).toBe(0);
    });

    it("returns 1 when no Sozialversicherung applies at all", () => {
      const events = [sozialversicherungenEvent(0, 0, OHNE_SV)];

      expect(bestimmeAnteilOhneSV(events, 0)).toBe(1);
    });

    it("returns the ratio for a mix of no Sozialversicherung and with Sozialversicherung", () => {
      const events = [
        sozialversicherungenEvent(0, 0, MIT_SV),
        sozialversicherungenEvent(0, 1, OHNE_SV),
      ];

      expect(bestimmeAnteilOhneSV(events, 0)).toBe(0.5);
    });

    it("only counts an event as 'ohne SV' when all three Versicherungsarten are false", () => {
      const events = [
        sozialversicherungenEvent(0, 0, {
          ...OHNE_SV,
          istGesetzlichRentenversichert: true,
        }),
      ];

      expect(bestimmeAnteilOhneSV(events, 0)).toBe(0);
    });

    it("ignores events belonging to a different Elternteil", () => {
      const events = [sozialversicherungenEvent(1, 0, MIT_SV)];

      expect(bestimmeAnteilOhneSV(events, 0)).toBeUndefined();
    });
  });
}
