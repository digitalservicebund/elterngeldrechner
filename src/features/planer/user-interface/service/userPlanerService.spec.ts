import { usePlanerService } from "./usePlanerService";
import {
  aktualisiereErrechneteElterngelbezuege,
  bestimmeVerfuegbaresKontingent,
  Elternteil,
  erstelleInitialenPlan,
  KeinElterngeld,
  Result,
  Variante,
  waehleOption,
  zaehleVerplantesKontingent,
} from ".";
import { Top } from "@/features/planer/domain/common/specification";
import { act, INITIAL_STATE, renderHook } from "@/test-utils/test-utils";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";
import type { AppStore } from "@/redux";

vi.mock("@/features/planer/domain/ausgangslage");
vi.mock("@/features/planer/domain/lebensmonate");
vi.mock("@/features/planer/domain/plan");

describe("use Planer service", () => {
  beforeEach(() => {
    vi.mocked(erstelleInitialenPlan).mockReturnValue(ANY_PLAN);
    vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
      ANY_VERFUEGBARES_KONTINGENT,
    );
    vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
      ANY_VERPLANTES_KONTINGENT,
    );
    vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
    vi.mocked(aktualisiereErrechneteElterngelbezuege).mockImplementation(
      (plan) => plan,
    );
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
  ausgangslage: { anzahlElternteile: 1 as const },
  errechneteElterngeldbezuege: {} as any,
  lebensmonate: {},
  gueltigerPlan: Top,
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
