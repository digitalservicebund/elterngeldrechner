import { usePlanerService, type InitialInformation } from "./usePlanerService";
import type { GebeEinkommenAn, WaehleOption } from "./callbackTypes";
import {
  aktualisiereErrechneteElterngelbezuege,
  berechneGesamtsumme,
  bestimmeVerfuegbaresKontingent,
  Elternteil,
  erstelleInitialenPlan,
  gebeEinkommenAn,
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

vi.mock(
  import("@/features/planer/domain/plan/operation/erstelleInitialenPlan"),
);
vi.mock(import("@/features/planer/domain/plan/operation/waehleOption"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/aktualisiereElterngeldbezuege"
  ),
);
vi.mock(import("@/features/planer/domain/plan/operation/setzePlanZurueck"));
vi.mock(import("@/features/planer/domain/plan/operation/berechneGesamtsumme"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe"
  ),
);
vi.mock(import("@/features/planer/domain/plan/operation/gebeEinkommenAn"));
vi.mock(
  import(
    "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent"
  ),
);
vi.mock(import("@/user-tracking/partnerschaftlichkeit"));

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
    vi.mocked(gebeEinkommenAn).mockImplementation((plan) => plan);
    vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
  });

  describe("initialization", () => {
    it("creates a new plan with given Ausgangslage if no old plan is given", () => {
      vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: { [Elternteil.Eins]: "" },
        geburtsdatumDesKindes: new Date(),
      };

      const { result } = renderPlanerServiceHook({
        initialInformation: { ausgangslage, plan: undefined },
      });

      expect(erstelleInitialenPlan).toHaveBeenCalledOnce();
      expect(erstelleInitialenPlan).toHaveBeenLastCalledWith(
        ausgangslage,
        expect.anything(),
      );
      expect(result.current.pseudonymeDerElternteile).toStrictEqual(
        ANY_PLAN.ausgangslage.pseudonymeDerElternteile,
      );
      expect(result.current.geburtsdatumDesKindes).toStrictEqual(
        ANY_PLAN.ausgangslage.geburtsdatumDesKindes,
      );
      expect(result.current.lebensmonate).toStrictEqual(ANY_PLAN.lebensmonate);
    });

    it("uses the given old Plan instead to create a new one", () => {
      const plan = ANY_PLAN;

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan, ausgangslage: undefined },
      });

      expect(erstelleInitialenPlan).not.toHaveBeenCalled();
      expect(result.current.pseudonymeDerElternteile).toStrictEqual(
        plan.ausgangslage.pseudonymeDerElternteile,
      );
      expect(result.current.geburtsdatumDesKindes).toStrictEqual(
        plan.ausgangslage.geburtsdatumDesKindes,
      );
      expect(result.current.lebensmonate).toStrictEqual(plan.lebensmonate);
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

  describe("Gesamtsumme", () => {
    it("initially determines the Gesamtsumme", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValue(ANY_GESAMTSUMME);

      const { result } = renderPlanerServiceHook();

      expect(berechneGesamtsumme).toHaveBeenCalledOnce();
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
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(berechneGesamtsumme).toHaveBeenCalledOnce();
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

  describe("wähle Option", () => {
    it("updates the Lebensmonate when chosing an Option", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };
      const updatedPlan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
      vi.mocked(waehleOption).mockReturnValue(Result.ok(updatedPlan));

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(waehleOption).toHaveBeenCalledOnce();
      expect(waehleOption).toHaveBeenCalledWith(
        initialPlan,
        1,
        Elternteil.Eins,
        Variante.Basis,
      );
      expect(result.current.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
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
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      waehleAnyOption(result.current.waehleOption);

      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledOnce();
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith([{ message: "invalid plan" }]);
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
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => result.current.gebeEinkommenAn(1, Elternteil.Eins, 300));

      expect(gebeEinkommenAn).toHaveBeenCalledOnce();
      expect(gebeEinkommenAn).toHaveBeenCalledWith(
        initialPlan,
        1,
        Elternteil.Eins,
        300,
      );
      expect(result.current.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
      );
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

      waehleAnyOption(result.current.waehleOption);

      expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledOnce();
      expect(trackPartnerschaftlicheVerteilung).toHaveBeenLastCalledWith(
        ANY_PLAN,
      );
    });

    it("does not trigger tracking when specifying a Bruttoeinkommen", () => {
      const { result } = renderPlanerServiceHook();

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(trackPartnerschaftlicheVerteilung).not.toHaveBeenCalledOnce();
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
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });

    it("triggers the callback with an undefined Plan when the chosen Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(undefined);
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
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });

    it("triggers the given callback when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      act(() => result.current.setzePlanZurueck());

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });
  });
});

function renderPlanerServiceHook(options?: {
  initialInformation?: InitialInformation;
  onPlanChanged?: (plan: PlanMitBeliebigenElternteilen | undefined) => void;
}) {
  const initialInformation = options?.initialInformation ?? {
    ausgangslage: ANY_AUSGANGSLAGE,
  };
  const onPlanChanged = options?.onPlanChanged ?? (() => {});

  return renderHook(() => usePlanerService(initialInformation, onPlanChanged), {
    preloadedState: INITIAL_STATE,
  });
}

function waehleAnyOption(callback: WaehleOption<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, Variante.Basis));
}

function gebeAnyEinkommenAn(callback: GebeEinkommenAn<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, 300));
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

const ANY_AUSGANGSLAGE = {
  anzahlElternteile: 1 as const,
  pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
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
