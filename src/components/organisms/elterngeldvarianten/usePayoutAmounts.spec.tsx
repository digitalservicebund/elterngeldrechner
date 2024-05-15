import { usePayoutAmounts } from "./usePayoutAmounts";
import { RootState } from "@/redux";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import { ElterngeldRow, calculateElterngeld } from "@/redux/stepRechnerSlice";
import { act, renderHook } from "@/test-utils/test-utils";

jest.mock("../../../redux/stepRechnerSlice", () => ({
  ...jest.requireActual("../../../redux/stepRechnerSlice.ts"),
  calculateElterngeld: jest.fn(),
}));

describe("usePayoutAmounts", () => {
  it("calculates the amount only for the first parent if single applicant", async () => {
    jest.mocked(calculateElterngeld).mockReturnValue(ANY_CALCULATION_PROMISE);
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "EinenElternteil",
      },
    };

    const { result } = renderHook(() => usePayoutAmounts(), { preloadedState });
    await act(() => ANY_CALCULATION_PROMISE);

    expect(calculateElterngeld).toHaveBeenCalledTimes(1);
    expect(calculateElterngeld).toHaveBeenCalledWith(
      expect.anything(),
      "ET1",
      [],
    );
    expect(result.current).toHaveLength(1);
  });

  it("calculates the amounts for both parents if no single applicat", async () => {
    jest.mocked(calculateElterngeld).mockReturnValue(ANY_CALCULATION_PROMISE);
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
      },
    };

    const { result } = renderHook(() => usePayoutAmounts(), { preloadedState });
    await act(() => ANY_CALCULATION_PROMISE);

    expect(calculateElterngeld).toHaveBeenCalledTimes(2);
    expect(calculateElterngeld).toHaveBeenCalledWith(
      expect.anything(),
      "ET1",
      [],
    );
    expect(calculateElterngeld).toHaveBeenCalledWith(
      expect.anything(),
      "ET2",
      [],
    );
    expect(result.current).toHaveLength(2);
  });

  it("provides the correct parent names", async () => {
    jest.mocked(calculateElterngeld).mockReturnValue(ANY_CALCULATION_PROMISE);
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
        pseudonym: { ET1: "Jane", ET2: "John" },
      },
    };

    const { result } = renderHook(() => usePayoutAmounts(), { preloadedState });
    await act(() => ANY_CALCULATION_PROMISE);

    expect(result.current?.[0].name).toEqual("Jane");
    expect(result.current?.[1].name).toEqual("John");
  });

  it("takes the amounts of the first relevant row", async () => {
    const calculationPromise = Promise.resolve([
      elterngeldRow({ basisElternGeld: 0, elternGeldPlus: 0 }),
      elterngeldRow({ basisElternGeld: 0, elternGeldPlus: 0 }),
      elterngeldRow({ basisElternGeld: 1, elternGeldPlus: 2 }),
    ]);
    jest.mocked(calculateElterngeld).mockReturnValue(calculationPromise);

    const { result } = renderHook(() => usePayoutAmounts());
    await act(() => calculationPromise);

    expect(result.current?.[0].basiselterngeld).toEqual(1);
    expect(result.current?.[0].elterngeldplus).toEqual(2);
    expect(result.current?.[0].partnerschaftsbonus).toEqual(2);
  });

  it("is initially undefined", async () => {
    let resolveCalculation: (value: ElterngeldRow[]) => void = jest.fn();
    const calculationPromise = new Promise<ElterngeldRow[]>((resolve) => {
      resolveCalculation = resolve;
    });
    jest.mocked(calculateElterngeld).mockReturnValue(calculationPromise);

    const { result } = renderHook(() => usePayoutAmounts());

    expect(result.current).toBeUndefined();

    // Clean up floating promise.
    resolveCalculation([ANY_ELTERNGELD_ROW]);
    await act(() => calculationPromise);
  });
});

const ANY_ELTERNGELD_ROW: ElterngeldRow = {
  basisElternGeld: 2,
  elternGeldPlus: 0,
  vonLebensMonat: 0,
  bisLebensMonat: 0,
  nettoEinkommen: 0,
};

const ANY_CALCULATION_PROMISE: Promise<ElterngeldRow[]> = Promise.resolve([
  ANY_ELTERNGELD_ROW,
]);

function elterngeldRow(partialRow: {
  basisElternGeld: number;
  elternGeldPlus: number;
}): ElterngeldRow {
  return {
    ...ANY_ELTERNGELD_ROW,
    ...partialRow,
  };
}
