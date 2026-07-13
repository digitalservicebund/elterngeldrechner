import { FormEvent, Route } from "@/application/routing";
import { posthog } from "@/application/user-tracking";
import { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";
import { bestimmeEinkommensarten } from "@/application/features/abfrageteil/pages/elternteil/tracking";

type NichtSelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

export function trackMinijobAnteil(
  events: FormEvent[],
  elternteilIndex: number,
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
    const nichtSelbststaendigMinijobEvents =
      relevanteNichtSelbststaendigEvents.filter(
        (e) => e.payload.istTaetigkeitMinijob === true,
      );

    const anteilMinijobs =
      nichtSelbststaendigMinijobEvents.length /
      relevanteNichtSelbststaendigEvents.length;

    posthog.capture("taetigkeiten_angaben_abgeschlossen", {
      anteil_minijobs: anteilMinijobs,
    });
  }
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

  afterEach(() => vi.restoreAllMocks());

  describe("trackMinijobAnteil", () => {
    let captureSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      captureSpy = vi.spyOn(posthog, "capture").mockReturnValue(undefined);
    });

    it("does not capture anything when there are no relevant Tätigkeiten", () => {
      trackMinijobAnteil([], 0);

      expect(captureSpy).not.toHaveBeenCalled();
    });

    it("captures anteil_minijobs as 0 when none of the Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, false),
        nichtSelbststaendigEvent(0, 1, false),
      ];

      trackMinijobAnteil(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0 },
      );
    });

    it("captures anteil_minijobs as 1 when all Tätigkeiten are Minijobs", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, true),
      ];

      trackMinijobAnteil(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 1 },
      );
    });

    it("captures the ratio for a mix of Minijob and regular Tätigkeiten", () => {
      const events = [
        nichtSelbststaendigEvent(0, 0, true),
        nichtSelbststaendigEvent(0, 1, false),
      ];

      trackMinijobAnteil(events, 0);

      expect(captureSpy).toHaveBeenCalledWith(
        "taetigkeiten_angaben_abgeschlossen",
        { anteil_minijobs: 0.5 },
      );
    });

    it("ignores Tätigkeiten belonging to a different Elternteil", () => {
      const events = [nichtSelbststaendigEvent(1, 0, true)];

      trackMinijobAnteil(events, 0);

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
