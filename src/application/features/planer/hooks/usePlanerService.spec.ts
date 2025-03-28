import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  type Callbacks,
  type InitialInformation,
  usePlanerService,
} from "./usePlanerService";
import { INITIAL_STATE, act, renderHook } from "@/application/test-utils";
import {
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  type Elterngeldbezug,
  Elternteil,
  KeinElterngeld,
  type PlanMitBeliebigenElternteilen,
  Result,
  Variante,
  aktualisiereElterngeldbezuege,
  bestimmeAuswahlmoeglichkeiten,
  erstelleInitialeLebensmonate,
  erstelleVorschlaegeFuerAngabeDesEinkommens,
  gebeEinkommenAn,
  setzePlanZurueck,
  validierePlanFuerFinaleAbgabe,
  waehleOption,
} from "@/monatsplaner";

describe("use Planer service", () => {
  beforeEach(async () => {
    const monatsplaner = await import("@/monatsplaner");

    vi.spyOn(monatsplaner, "erstelleInitialeLebensmonate").mockReturnValue({});
    vi.spyOn(monatsplaner, "validierePlanFuerFinaleAbgabe").mockReturnValue(
      Result.ok(undefined),
    );
    vi.spyOn(monatsplaner, "waehleOption").mockImplementation((_, plan) =>
      Result.ok(plan),
    );
    vi.spyOn(monatsplaner, "gebeEinkommenAn").mockImplementation(
      (_, plan) => plan,
    );
    vi.spyOn(monatsplaner, "setzePlanZurueck").mockReturnValue(ANY_PLAN);
    vi.spyOn(monatsplaner, "bestimmeAuswahlmoeglichkeiten").mockReturnValue(
      ANY_AUSWAHLMOEGLICHKEITEN,
    );
    vi.spyOn(monatsplaner, "erstelleVorschlaegeFuerAngabeDesEinkommens");
  });

  describe("initialization", () => {
    it("creates a new plan with given Ausgangslage if no old plan is given", () => {
      vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});
      const ausgangslage = {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      };

      const { result } = renderPlanerServiceHook({
        initialInformation: { ausgangslage, plan: undefined },
      });

      expect(erstelleInitialeLebensmonate).toHaveBeenCalledOnce();
      expect(erstelleInitialeLebensmonate).toHaveBeenLastCalledWith(
        ausgangslage,
      );
      expect(result.current.plan.ausgangslage).toStrictEqual(ausgangslage);
      expect(result.current.plan.lebensmonate).toStrictEqual({});
    });

    it("uses the given old Plan instead to create a new one", () => {
      const plan = ANY_PLAN;

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan, ausgangslage: undefined },
      });

      expect(erstelleInitialeLebensmonate).not.toHaveBeenCalled();
      expect(erstelleInitialeLebensmonate).not.toHaveBeenCalled();
      expect(result.current.plan).toStrictEqual(plan);
    });
  });

  describe("Validierungsfehler", () => {
    it("initially has no Fehler when validation for a gültigen Plan is satisifed", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.ok(undefined),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler.length).toBe(0);
    });

    it("initially has Fehler when validation for a gültigen Plan is unsatisfied", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "falsch" }, { message: "ungültig" }]),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual([
        "falsch",
        "ungültig",
      ]);
    });

    it("updates the Fehler when choosing an Option and the resulting Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler).toStrictEqual([]);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual(["falsch"]);
    });

    it("clears the Fehler when choosing an Option and the resulting Plan valid again", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler).toStrictEqual(["falsch"]);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual([]);
    });

    // TODO: Do we need to validate on Einkommen?

    it("updates the Fehler when resetting the Plan and the empty Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler.length).toBe(0);
      vi.clearAllMocks();

      act(() => result.current.setzePlanZurueck());

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler.length).toBe(1);
    });
  });

  describe("bestimme Auswahlmöglichkeiten", () => {
    it("forwards the given callback to calculate Elterngeldbezüge", () => {
      const berechneElterngeldbezuege = () => ({});
      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: ANY_PLAN },
        berechneElterngeldbezuege,
      });

      act(() => {
        result.current.bestimmeAuswahlmoeglichkeiten(1, Elternteil.Eins);
      });

      expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledOnce();
      expect(bestimmeAuswahlmoeglichkeiten).toHaveBeenCalledWith(
        berechneElterngeldbezuege,
        ANY_PLAN,
        1,
        Elternteil.Eins,
      );
    });
  });

  describe("wähle Option", () => {
    it("updates the Lebensmonate when chosing an Option", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };

      const updatedPlan = {
        ...ANY_PLAN,
        lebensmonate: { 1: ANY_LEBENSMONAT },
      };

      vi.mocked(waehleOption).mockReturnValue(Result.ok(updatedPlan));

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.plan.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });
      expect(result.current.plan.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
      );
    });

    it("forwards the given callback to calculate Elterngeldbezüge", () => {
      const berechneElterngeldbezuege = () => ({});
      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: ANY_PLAN },
        berechneElterngeldbezuege,
      });

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(waehleOption).toHaveBeenCalledOnce();
      expect(waehleOption).toHaveBeenCalledWith(
        berechneElterngeldbezuege,
        ANY_PLAN,
        1,
        Elternteil.Eins,
        Variante.Basis,
      );
    });

    it("keeps the last Lebensmonate and logs the error if choosing an Option fails", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };
      vi.mocked(waehleOption).mockReturnValue(
        Result.error([{ message: "invalid plan" }]),
      );
      vi.spyOn(global.console, "error").mockImplementation(() => {});

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.plan.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      waehleAnyOption(result.current.waehleOption);

      expect(result.current.plan.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledOnce();
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith([{ message: "invalid plan" }]);
    });

    it("triggers the given callback function", () => {
      const onWaehleOption = vi.fn();
      const { result } = renderPlanerServiceHook({
        callbacks: { onWaehleOption },
      });

      waehleAnyOption(result.current.waehleOption);

      expect(onWaehleOption).toHaveBeenCalledOnce();
    });
  });

  describe("erstelle Vorschläge für Angabe des Einkommens", () => {
    it("uses the current Lebensmonate to determine the Vorschläge", async () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
      vi.mocked(erstelleVorschlaegeFuerAngabeDesEinkommens).mockReturnValue([
        100,
      ]);
      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });

      const vorschlaege = await act(() =>
        result.current.erstelleVorschlaegeFuerAngabeDesEinkommens(
          7,
          Elternteil.Zwei,
        ),
      );

      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledOnce();
      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledWith(
        { 1: ANY_LEBENSMONAT },
        7,
        Elternteil.Zwei,
      );
      expect(vorschlaege).toStrictEqual([100]);
    });
  });

  describe("gebe Einkommen an", () => {
    it("updates the Lebensmonate when specifying an Einkommen", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };
      const updatedPlan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
      vi.mocked(gebeEinkommenAn).mockReturnValue(updatedPlan);

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.plan.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => result.current.gebeEinkommenAn(1, Elternteil.Eins, 300));
      expect(result.current.plan.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
      );
    });

    it("forwards the given callback to calculate Elterngeldbezüge", () => {
      const berechneElterngeldbezuege = () => ({});
      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: ANY_PLAN },
        berechneElterngeldbezuege,
      });

      act(() => result.current.gebeEinkommenAn(1, Elternteil.Eins, 300));

      expect(gebeEinkommenAn).toHaveBeenCalledOnce();
      expect(gebeEinkommenAn).toHaveBeenCalledWith(
        berechneElterngeldbezuege,
        ANY_PLAN,
        1,
        Elternteil.Eins,
        300,
      );
    });
  });

  describe("setze Plan zurück", () => {
    it("updates the Plan state", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue({
        ...ANY_PLAN,
        lebensmonate: {},
      });

      const { result } = renderPlanerServiceHook({
        initialInformation: {
          plan: { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } },
        },
      });

      act(() => result.current.setzePlanZurueck());

      expect(result.current.plan).toStrictEqual({
        ...ANY_PLAN,
        lebensmonate: {},
      });
    });

    it("triggers the given callback function", () => {
      const onSetzePlanZurueck = vi.fn();
      const { result } = renderPlanerServiceHook({
        callbacks: { onSetzePlanZurueck },
      });

      act(() => result.current.setzePlanZurueck());

      expect(onSetzePlanZurueck).toHaveBeenCalledOnce();
    });
  });

  describe("on Plan changed", () => {
    it("triggers the given callback when chosing an Option", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      const onChange = vi.fn();
      const { result } = renderPlanerServiceHook({
        callbacks: { onChange },
      });

      waehleAnyOption(result.current.waehleOption);

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });

    it("triggers the callback with an undefined Plan when the chosen Plan is invalid", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );

      const onChange = vi.fn();

      const { result } = renderPlanerServiceHook({
        callbacks: { onChange },
      });
      waehleAnyOption(result.current.waehleOption);

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenLastCalledWith(ANY_PLAN, false);
    });

    it("does not trigger callback if the initial Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onChange = vi.fn();
      renderPlanerServiceHook({ callbacks: { onChange } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("triggers the given callback when specifying an Einkommen", () => {
      vi.mocked(gebeEinkommenAn).mockReturnValue(ANY_PLAN);
      const onChange = vi.fn();
      const { result } = renderPlanerServiceHook({
        callbacks: { onChange },
      });

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });

    it("triggers the given callback when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onChange = vi.fn();
      const { result } = renderPlanerServiceHook({
        callbacks: { onChange },
      });

      act(() => result.current.setzePlanZurueck());

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });
  });

  describe("überschreibe Plan", () => {
    it("overwrites the current plan and calculates the Bezüge", async () => {
      vi.spyOn(
        await import("@/monatsplaner"),
        "aktualisiereElterngeldbezuege",
      ).mockReturnValue({
        ausgangslage: {
          anzahlElternteile: 1,
          geburtsdatumDesKindes: new Date("2024-01-02"),
        },
        lebensmonate: {
          1: { [Elternteil.Eins]: monat(Variante.Plus, 100) },
        },
      } as PlanMitBeliebigenElternteilen);

      const { result } = renderPlanerServiceHook({
        initialInformation: {
          plan: {
            ausgangslage: {
              anzahlElternteile: 1,
              geburtsdatumDesKindes: new Date("2024-01-01"),
            },
            lebensmonate: {},
          },
        },
      });

      act(() =>
        result.current.ueberschreibePlan({
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date("2024-01-02"),
          },
          lebensmonate: {
            1: { [Elternteil.Eins]: monat(Variante.Plus, undefined) },
          },
        } as PlanMitBeliebigenElternteilen),
      );

      expect(aktualisiereElterngeldbezuege).toHaveBeenCalledOnce();
      expect(result.current.plan).toStrictEqual({
        ausgangslage: {
          anzahlElternteile: 1,
          geburtsdatumDesKindes: new Date("2024-01-02"),
        },
        lebensmonate: {
          1: { [Elternteil.Eins]: monat(Variante.Plus, 100) },
        },
      });
    });
  });
});

function renderPlanerServiceHook(options?: {
  initialInformation?: InitialInformation;
  berechneElterngeldbezuege?: BerechneElterngeldbezuegeCallback;
  callbacks?: Callbacks;
}) {
  const initialInformation = options?.initialInformation ?? {
    ausgangslage: ANY_AUSGANGSLAGE,
  };

  const berechneElterngeldbezuege =
    options?.berechneElterngeldbezuege ?? (() => ({}));

  return renderHook(
    () =>
      usePlanerService(
        initialInformation,
        berechneElterngeldbezuege,
        options?.callbacks,
      ),
    {
      preloadedState: INITIAL_STATE,
    },
  );
}

function waehleAnyOption(
  callback: ReturnType<typeof usePlanerService>["waehleOption"],
) {
  act(() => callback(1, Elternteil.Eins, Variante.Basis));
}

function gebeAnyEinkommenAn(
  callback: ReturnType<typeof usePlanerService>["gebeEinkommenAn"],
) {
  act(() => callback(1, Elternteil.Eins, 300));
}

function monat(
  gewaehlteOption: Auswahloption,
  elterngeldbezug?: Elterngeldbezug,
) {
  return {
    gewaehlteOption,
    elterngeldbezug,
    imMutterschutz: false as const,
  };
}

const ANY_AUSGANGSLAGE = {
  anzahlElternteile: 1 as const,
  geburtsdatumDesKindes: new Date(),
};

const ANY_PLAN = {
  ausgangslage: ANY_AUSGANGSLAGE,
  lebensmonate: {},
};

const ANY_LEBENSMONAT = {
  [Elternteil.Eins]: { imMutterschutz: false as const },
  [Elternteil.Zwei]: { imMutterschutz: false as const },
};

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [Variante.Plus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [Variante.Bonus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
};
