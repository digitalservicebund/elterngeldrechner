import { usePlanerService } from "./usePlanerService";
import {
  aktualisiereErrechneteElterngelbezuege,
  berrechneGesamtsumme,
  bestimmeVerfuegbaresKontingent,
  Elternteil,
  erstelleInitialenPlan,
  KeinElterngeld,
  Result,
  setzePlanZurueck,
  Variante,
  waehleOption,
  zaehleVerplantesKontingent,
} from ".";
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
vi.mock("@/features/planer/domain/plan/operation/berrechneGesamtsumme");
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
    vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
    vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
  });

  it("initially creates a plan", () => {
    vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);

    const { result } = renderPlanerServiceHook();

    expect(result.current.lebensmonate).toStrictEqual(ANY_PLAN.lebensmonate);
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
      expect(console.error).toHaveBeenCalledOnce();
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
      vi.mocked(berrechneGesamtsumme).mockReturnValue(ANY_GESAMTSUMME);

      const { result } = renderPlanerServiceHook();

      expect(result.current.gesamtsumme).toStrictEqual(ANY_GESAMTSUMME);
    });

    it("updates the Gesamtsumme when chosing an Option", () => {
      vi.mocked(berrechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 1,
      });
      vi.mocked(berrechneGesamtsumme).mockReturnValueOnce({
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
      vi.mocked(berrechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        summe: 1,
      });
      vi.mocked(berrechneGesamtsumme).mockReturnValueOnce({
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
});

function renderPlanerServiceHook() {
  return renderHook(() => usePlanerService(), {
    preloadedState: INITIAL_STATE,
  });
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
