import { usePlanningContingentMonths } from "./usePlanningContingentMonths";
import { RootState } from "@/redux";
import { initialMonatsplanerState } from "@/redux/monatsplanerSlice";
import { renderHook } from "@/test-utils/test-utils";

describe("usePlanningContingentMonths", () => {
  it("provides the available months based on the store data", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          remainingMonths: {
            basiselterngeld: 1,
            elterngeldplus: 2,
            partnerschaftsbonus: 3,
          },
        },
      },
    };
    const { result } = renderHook(() => usePlanningContingentMonths(), {
      preloadedState,
    });

    expect(result.current.basis.available).toEqual(1);
    expect(result.current.plus.available).toEqual(2);
    expect(result.current.bonus.available).toEqual(3);
  });

  it("correctly calculates the taken basis months taking into account the taken plus months", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: {
            months: [
              { ...ANY_MONTH, type: "BEG" },
              { ...ANY_MONTH, type: "EG+" },
              { ...ANY_MONTH, type: "PSB" },
              { ...ANY_MONTH, type: "None" },
            ],
          },
          ET2: {
            months: [
              { ...ANY_MONTH, type: "BEG" },
              { ...ANY_MONTH, type: "BEG" },
            ],
          },
        },
      },
    };
    const { result } = renderHook(() => usePlanningContingentMonths(), {
      preloadedState,
    });

    expect(result.current.basis.taken).toEqual(4);
  });

  it("correctly calculates the taken plus months taking into account the taken basis months", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: {
            months: [
              { ...ANY_MONTH, type: "BEG" },
              { ...ANY_MONTH, type: "EG+" },
              { ...ANY_MONTH, type: "PSB" },
              { ...ANY_MONTH, type: "None" },
            ],
          },
          ET2: {
            months: [
              { ...ANY_MONTH, type: "EG+" },
              { ...ANY_MONTH, type: "EG+" },
            ],
          },
        },
      },
    };
    const { result } = renderHook(() => usePlanningContingentMonths(), {
      preloadedState,
    });

    expect(result.current.plus.taken).toEqual(5);
  });

  it("correctly calculates the taken bonus months taking into account parallelism", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: {
            months: [
              { ...ANY_MONTH, type: "PSB" },
              { ...ANY_MONTH, type: "PSB" },
              { ...ANY_MONTH, type: "EG+" },
              { ...ANY_MONTH, type: "None" },
            ],
          },
          ET2: {
            months: [
              { ...ANY_MONTH, type: "PSB" },
              { ...ANY_MONTH, type: "PSB" },
            ],
          },
        },
      },
    };
    const { result } = renderHook(() => usePlanningContingentMonths(), {
      preloadedState,
    });

    expect(result.current.bonus.taken).toEqual(2);
  });
});

const ANY_MONTH = {
  isMutterschutzMonth: false,
  type: "None",
};
