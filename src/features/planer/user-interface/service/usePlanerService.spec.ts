import { usePlanerService } from "./usePlanerService";
import {
  aktualisiereErrechneteElterngelbezuege,
  berechneGesamtsumme,
  bestimmeVerfuegbaresKontingent,
  Elternteil,
  erstelleInitialenPlan,
  KeinElterngeld,
  Result,
  setzePlanZurueck,
  Variante,
  waehleOption,
  zaehleVerplantesKontingent,
  type PlanMitBeliebigenElternteilen,
} from ".";
import { validierePlanFuerFinaleAbgabe } from "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe";
import { act, INITIAL_STATE, renderHook } from "@/test-utils/test-utils";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";
import type { AppStore } from "@/redux";
import { trackPartnerschaftlicheVerteilung } from "@/user-tracking";

vi.mock("@/features/planer/domain/plan/operation/erstelleInitialenPlan");
vi.mock("@/features/planer/domain/plan/operation/waehleOption");
vi.mock(
  "@/features/planer/domain/plan/operation/aktualisiereElterngeldbezuege",
);
vi.mock("@/features/planer/domain/plan/operation/setzePlanZurueck");
vi.mock("@/features/planer/domain/plan/operation/berechneGesamtsumme");
vi.mock(
  "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe",
);
vi.mock(
  "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent",
);
vi.mock(
  "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent",
);
vi.mock("@/user-tracking/partnerschaftlichkeit");

describe("use Planer service", () => {
  beforeEach(() => {
    vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);
    vi.mocked(aktualisiereErrechneteElterngelbezuege).mockImplementation(
      (plan) => plan,
    );
    vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
      Result.ok(undefined),
    );
    vi.mocked(waehleOption).mockImplementation((plan) => Result.ok(plan));
    vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
  });

  it("initially creates a plan", () => {
    vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);

    const { result } = renderPlanerServiceHook();

    expect(result.current.lebensmonate).toStrictEqual(ANY_PLAN.lebensmonate);
  });

  it("uses the given initial Plan if available", () => {
    const plan = ANY_PLAN;

    const { result } = renderPlanerServiceHook(plan);

    expect(vi.mocked(erstelleInitialenPlan)).not.toHaveBeenCalled();
    expect(vi.mocked(bestimmeVerfuegbaresKontingent)).toHaveBeenLastCalledWith(
      plan.ausgangslage,
    );
    expect(result.current.lebensmonate).toStrictEqual(plan.lebensmonate);
    expect(result.current.pseudonymeDerElternteile).toStrictEqual(
      plan.ausgangslage.pseudonymeDerElternteile,
    );
  });

  it("initially determines the verfügbares Kontingent", () => {
    vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
      ANY_VERFUEGBARES_KONTINGENT,
    );

    const { result } = renderPlanerServiceHook();

    expect(result.current.verfuegbaresKontingent).toStrictEqual(
      ANY_VERFUEGBARES_KONTINGENT,
    );
  });

  describe("wähle Option", () => {
    it("updates the Lebensmonate when chosing an Option", () => {
      vi.mocked(erstelleInitialenPlan).mockReturnValue({
        ...ANY_PLAN,
        lebensmonate: {},
      });
      vi.mocked(waehleOption).mockReturnValue(
        Result.ok({
          ...ANY_PLAN,
          lebensmonate: { 1: ANY_LEBENSMONAT },
        }),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.lebensmonate[1]).toBeUndefined();

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(result.current.lebensmonate[1]).toStrictEqual(ANY_LEBENSMONAT);
    });

    it("keeps the last Plan and logs the error if choosing an Option fails", () => {
      vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);
      vi.mocked(waehleOption).mockReturnValue(
        Result.error([{ message: "invalid plan" }]),
      );
      vi.spyOn(global.console, "error").mockImplementation(() => {});

      const { result } = renderPlanerServiceHook();
      expect(result.current.lebensmonate).toStrictEqual(ANY_PLAN.lebensmonate);

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(result.current.lebensmonate).toStrictEqual(ANY_PLAN.lebensmonate);

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledOnce();

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith([{ message: "invalid plan" }]);
    });
  });

  describe("verplantes Kontingent", () => {
    it("initially determines the verplantes Kontingent", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        ANY_VERPLANTES_KONTINGENT,
      );

      const { result } = renderPlanerServiceHook();

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

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(1);
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

      act(() => result.current.setzePlanZurueck());

      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(0);
    });
  });

  describe("Gesamtsumme", () => {
    it("initially determines the Gesamtsumme", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValue(ANY_GESAMTSUMME);

      const { result } = renderPlanerServiceHook();

      expect(result.current.gesamtsumme).toStrictEqual(ANY_GESAMTSUMME);
    });

    it("updates the Gesamtsumme when chosing an Option", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 1,
      });
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 2,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.gesamtsumme.summe).toBe(1);

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(result.current.gesamtsumme.summe).toBe(2);
    });

    it("updates the Gesamtsumme when resetting the Plan", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 1,
      });
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 0,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.gesamtsumme.summe).toBe(1);

      act(() => result.current.setzePlanZurueck());

      expect(result.current.gesamtsumme.summe).toBe(0);
    });
  });

  it("updates the errechnete Elterngeldbezuege if their data changes", async () => {
    vi.mocked(erstelleInitialenPlan).mockReturnValue({
      ...ANY_PLAN,
      lebensmonate: {
        1: {
          [Elternteil.Eins]: {
            elterngeldbezug: 1,
            imMutterschutz: false as const,
          },
          [Elternteil.Zwei]: {
            elterngeldbezug: 2,
            imMutterschutz: false as const,
          },
        },
      },
    });

    const updatedLebensmonate = {
      1: {
        [Elternteil.Eins]: {
          elterngeldbezug: 2,
          imMutterschutz: false as const,
        },
        [Elternteil.Zwei]: {
          elterngeldbezug: 3,
          imMutterschutz: false as const,
        },
      },
    };

    vi.mocked(aktualisiereErrechneteElterngelbezuege).mockReturnValue({
      ...ANY_PLAN,
      lebensmonate: updatedLebensmonate,
    });

    const { result, store } = renderPlanerServiceHook();
    await triggerElterngeldCalculation(store);

    expect(result.current.lebensmonate).toStrictEqual(updatedLebensmonate);
  });

  describe("tracking partnerschaftliche Verteilung", () => {
    it("triggers tracking when chosing an Option", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      const { result } = renderPlanerServiceHook();

      act(() =>
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis),
      );

      expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledOnce();
      expect(trackPartnerschaftlicheVerteilung).toHaveBeenLastCalledWith(
        ANY_PLAN,
      );
    });

    it("triggers tracking when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const { result } = renderPlanerServiceHook();

      act(() => result.current.setzePlanZurueck());

      expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledOnce();
      expect(trackPartnerschaftlicheVerteilung).toHaveBeenLastCalledWith(
        ANY_PLAN,
      );
    });
  });

  describe("on Plan changed", () => {
    it("triggers the given callback when chosing an Option", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook(undefined, onPlanChanged);

      act(() =>
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis),
      );

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });

    it("triggers the callback with an undefined Plan when the chosen Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook(undefined, onPlanChanged);

      act(() =>
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis),
      );

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(undefined);
    });

    it("does not trigger callback if the initial Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      renderPlanerServiceHook(undefined, onPlanChanged);

      expect(onPlanChanged).not.toHaveBeenCalled();
    });

    it("triggers the given callback when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook(undefined, onPlanChanged);

      act(() => result.current.setzePlanZurueck());

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });
  });

  describe("validierungsfehler", () => {
    it("has no Fehler when validation for a gültigen Plan is satisifed", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.ok(undefined),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalled();
      expect(result.current.validierungsfehler.length).toBe(0);
    });

    it("provides no Fehler when validation for a gültigen Plan is unsatisfied", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "falsch" }, { message: "ungültig" }]),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalled();
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

      expect(result.current.validierungsfehler.length).toBe(0);

      act(() =>
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis),
      );

      expect(result.current.validierungsfehler.length).toBe(1);
    });

    it("clears the Fehler when choosing an Option and the resulting Plan valid again", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      const { result } = renderPlanerServiceHook();

      expect(result.current.validierungsfehler.length).toBe(1);

      act(() =>
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis),
      );

      expect(result.current.validierungsfehler.length).toBe(0);
    });

    it("updates the Fehler when resetting the Plan and the empty Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );
      const { result } = renderPlanerServiceHook();

      expect(result.current.validierungsfehler.length).toBe(0);

      act(() => result.current.setzePlanZurueck());

      expect(result.current.validierungsfehler.length).toBe(1);
    });
  });
});

function renderPlanerServiceHook(
  initialPlan: PlanMitBeliebigenElternteilen | undefined = undefined,
  onPlanChanged?: (plan: PlanMitBeliebigenElternteilen | undefined) => void,
) {
  return renderHook(
    () => usePlanerService(initialPlan, onPlanChanged ?? vi.fn()),
    {
      preloadedState: INITIAL_STATE,
    },
  );
}

async function triggerElterngeldCalculation(store: AppStore) {
  await act(() =>
    store.dispatch(
      stepRechnerActions.recalculateBEG({
        elternteil: "ET1",
        bruttoEinkommenZeitraum: [],
        previousBEGAmount: false,
      }),
    ),
  );
}

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
    geburtsdatumDesKindes: new Date(),
  },
  errechneteElterngeldbezuege: {} as any,
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

const ANY_GESAMTSUMME = {
  summe: 0,
  summeProElternteil: {
    [Elternteil.Eins]: {
      anzahlMonateMitBezug: 0,
      totalerElterngeldbezug: 0,
    },
    [Elternteil.Zwei]: {
      anzahlMonateMitBezug: 0,
      totalerElterngeldbezug: 0,
    },
  },
};
