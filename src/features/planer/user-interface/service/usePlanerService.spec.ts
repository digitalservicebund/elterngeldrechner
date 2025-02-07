import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  GebeEinkommenAn,
  PlanChangedCallback,
  WaehleOption,
} from "./callbackTypes";
import { type InitialInformation, usePlanerService } from "./usePlanerService";
import {
  type BerechneElterngeldbezuegeCallback,
  Elternteil,
  KeinElterngeld,
  Result,
  Variante,
  bestimmeAuswahlmoeglichkeiten,
  bestimmeVerfuegbaresKontingent,
  erstelleInitialeLebensmonate,
  erstelleVorschlaegeFuerAngabeDesEinkommens,
  gebeEinkommenAn,
  setzePlanZurueck,
  validierePlanFuerFinaleAbgabe,
  waehleOption,
  zaehleVerplantesKontingent,
} from "@/features/planer/domain";
import { INITIAL_STATE, act, renderHook } from "@/test-utils/test-utils";

vi.mock(import("@/features/planer/domain/plan/operation/waehleOption"));
vi.mock(import("@/features/planer/domain/plan/operation/setzePlanZurueck"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe"
  ),
);
vi.mock(import("@/features/planer/domain/plan/operation/gebeEinkommenAn"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/bestimmeAuswahlmoeglichkeiten"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/erstelleInitialeLebensmonate"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/erstelleVorschlaegeFuerAngabeDesEinkommens"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent"
  ),
);

describe("use Planer service", () => {
  beforeEach(() => {
    vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});
    vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
      Result.ok(undefined),
    );
    vi.mocked(waehleOption).mockImplementation((_, plan) => Result.ok(plan));
    vi.mocked(gebeEinkommenAn).mockImplementation((_, plan) => plan);
    vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
    vi.mocked(bestimmeAuswahlmoeglichkeiten).mockReturnValue(
      ANY_AUSWAHLMOEGLICHKEITEN,
    );
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

  describe("verfügbares Kontingent", () => {
    it("initially determines the verfügbares Kontingent", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        ANY_VERFUEGBARES_KONTINGENT,
      );

      const { result } = renderPlanerServiceHook();

      expect(bestimmeVerfuegbaresKontingent).toHaveBeenCalledOnce();
      expect(result.current.verfuegbaresKontingent).toStrictEqual(
        ANY_VERFUEGBARES_KONTINGENT,
      );
    });
  });

  describe("verplantes Kontingent", () => {
    it("initially determines the verplantes Kontingent", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        ANY_VERPLANTES_KONTINGENT,
      );

      const { result } = renderPlanerServiceHook();

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent).toStrictEqual(
        ANY_VERPLANTES_KONTINGENT,
      );
    });

    it("updates the verplantes Kontingent when chosing an Option", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 2,
      });
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 1,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(2);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(1);
    });

    it("does not update the verplantes Kontingent when specifying some Bruttoeinkommen", () => {
      const { result } = renderPlanerServiceHook();
      vi.clearAllMocks();

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(zaehleVerplantesKontingent).not.toHaveBeenCalledOnce();
    });

    it("updates the verplantes Kontingent when resetting the Plan", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 1,
      });
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 0,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(1);
      vi.clearAllMocks();

      act(() => result.current.setzePlanZurueck());

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(0);
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

  describe("on Plan changed", () => {
    it("triggers the given callback when chosing an Option", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });

    it("triggers the callback with an undefined Plan when the chosen Plan is invalid", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );

      const onPlanChanged = vi.fn();

      const { result } = renderPlanerServiceHook({ onPlanChanged });
      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN, false);
    });

    it("does not trigger callback if the initial Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      renderPlanerServiceHook({ onPlanChanged });

      expect(onPlanChanged).not.toHaveBeenCalled();
    });

    it("triggers the given callback when specifying an Einkommen", () => {
      vi.mocked(gebeEinkommenAn).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });

    it("triggers the given callback when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      act(() => result.current.setzePlanZurueck());

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN, true);
    });
  });
});

function renderPlanerServiceHook(options?: {
  initialInformation?: InitialInformation;
  onPlanChanged?: PlanChangedCallback;
  berechneElterngeldbezuege?: BerechneElterngeldbezuegeCallback;
}) {
  const initialInformation = options?.initialInformation ?? {
    ausgangslage: ANY_AUSGANGSLAGE,
  };
  const onPlanChanged = options?.onPlanChanged ?? (() => {});
  const berechneElterngeldbezuege =
    options?.berechneElterngeldbezuege ?? (() => ({}));

  return renderHook(
    () =>
      usePlanerService(
        initialInformation,
        berechneElterngeldbezuege,
        onPlanChanged,
      ),
    {
      preloadedState: INITIAL_STATE,
    },
  );
}

function waehleAnyOption(callback: WaehleOption<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, Variante.Basis));
}

function gebeAnyEinkommenAn(callback: GebeEinkommenAn<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, 300));
}

const ANY_AUSGANGSLAGE = {
  anzahlElternteile: 1 as const,
  geburtsdatumDesKindes: new Date(),
};

const ANY_PLAN = {
  ausgangslage: ANY_AUSGANGSLAGE,
  errechneteElterngeldbezuege: {} as never,
  lebensmonate: {},
};

const ANY_VERFUEGBARES_KONTINGENT = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
};

const ANY_VERPLANTES_KONTINGENT = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
  [KeinElterngeld]: 0,
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
