import { act, renderHook } from "@testing-library/react";
import {
  ElterngeldRow,
  calculateElterngeld,
} from "../../../redux/stepRechnerSlice";
import { usePayoutAmounts } from "./usePayoutAmounts";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { reducers } from "../../../redux";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../../redux/stepRechnerSlice", () => ({
  ...jest.requireActual("../../../redux/stepRechnerSlice.ts"),
  calculateElterngeld: jest.fn(),
}));

describe("usePayoutAmounts", () => {
  it("triggers the calculation for both parents without any income", async () => {
    jest.mocked(calculateElterngeld).mockReturnValue(ANY_CALCULATION_PROMISE);

    renderHook(() => usePayoutAmounts(), { wrapper: WrapperWithStore });
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
  });

  it("takes the amounts of the first row for both parents", async () => {
    const calculationPromise = Promise.resolve([
      elterngeldRow({ basisElternGeld: 1, elternGeldPlus: 2 }),
      elterngeldRow({ basisElternGeld: 3, elternGeldPlus: 4 }),
    ]);
    jest.mocked(calculateElterngeld).mockReturnValue(calculationPromise);

    const { result } = renderHook(() => usePayoutAmounts(), {
      wrapper: WrapperWithStore,
    });
    await act(() => calculationPromise);

    expect(result.current).toBeDefined();
    expect(result.current?.basiselterngeld).toStrictEqual({ ET1: 1, ET2: 1 });
    expect(result.current?.elterngeldplus).toStrictEqual({ ET1: 2, ET2: 2 });
    expect(result.current?.partnerschaftsbonus).toStrictEqual({
      ET1: 2,
      ET2: 2,
    });
  });

  it("is initially undefined", async () => {
    let resolveCalculation: (value: ElterngeldRow[]) => void = jest.fn();
    const calculationPromise = new Promise<ElterngeldRow[]>((resolve) => {
      resolveCalculation = resolve;
    });
    jest.mocked(calculateElterngeld).mockReturnValue(calculationPromise);

    const { result } = renderHook(() => usePayoutAmounts(), {
      wrapper: WrapperWithStore,
    });

    expect(result.current).toBeUndefined();

    // Clean up floating promise.
    resolveCalculation([ANY_ELTERNGELD_ROW]);
    await act(() => calculationPromise);
  });
});

function WrapperWithStore(props: { children?: ReactNode }) {
  const store = configureStore({ reducer: reducers });
  return <Provider store={store}>{props.children}</Provider>;
}

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
