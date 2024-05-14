import { useSummarizeData } from "./useSummarizeData";
import { initialStepAllgemeineAngabenState } from "../../../redux/stepAllgemeineAngabenSlice";
import { renderHook } from "../../../test-utils/test-utils";
import {
  MonatsplanerState,
  initialMonatsplanerState,
} from "../../../redux/monatsplanerSlice";
import { RootState } from "../../../redux";
import {
  StepRechnerState,
  initialStepRechnerState,
} from "../../../redux/stepRechnerSlice";

describe("useSummarizeData", () => {
  it("correctly reads the names of the parents", () => {
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        pseudonym: { ET1: "Jane", ET2: "John" },
      },
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.name).toEqual("Jane");
    expect(result.current[1]?.name).toEqual("John");
  });

  it("counts all months that have anything planned", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: {
            months: [
              {
                type: "BEG",
                isMutterschutzMonth: true,
              },
              {
                type: "None",
                isMutterschutzMonth: true,
              },
            ],
          },
          ET2: {
            months: [
              {
                type: "EG+",
                isMutterschutzMonth: false,
              },
              {
                type: "PSB",
                isMutterschutzMonth: false,
              },
            ],
          },
        },
      },
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.monthCount).toEqual(1);
    expect(result.current[1]?.monthCount).toEqual(2);
  });

  it("return a total payout amount of zero if data is not calculated yet", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: MONATSPlANER_STATE_SOME_MONTHS_PLANNED,
      stepRechner: STEP_RECHNER_STATE_NOT_CALCULATED,
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.totalPayoutAmount).toEqual(0);
    expect(result.current[1]?.totalPayoutAmount).toEqual(0);
  });

  it("correctly sums up the total payout amount based on the planned months when the data was calculated", () => {
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
            ],
          },
          ET2: {
            months: [
              { ...ANY_MONTH, type: "BEG" },
              { ...ANY_MONTH, type: "None" },
              { ...ANY_MONTH, type: "BEG" },
            ],
          },
        },
      },
      stepRechner: {
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 1,
                bisLebensMonat: 32,
                basisElternGeld: 20,
                elternGeldPlus: 10,
              },
            ],
          },
        },
        ET2: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 1,
                bisLebensMonat: 2,
                basisElternGeld: 20,
                elternGeldPlus: 10,
              },
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 3,
                bisLebensMonat: 3,
                basisElternGeld: 40,
                elternGeldPlus: 10,
              },
            ],
          },
        },
      },
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.totalPayoutAmount).toEqual(40);
    expect(result.current[1]?.totalPayoutAmount).toEqual(60);
  });

  it("return a total income amount of zero f data is not calculated yet", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: initialMonatsplanerState,
      stepRechner: STEP_RECHNER_STATE_NOT_CALCULATED,
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.totalIncomeAmount).toEqual(0);
    expect(result.current[1]?.totalIncomeAmount).toEqual(0);
  });

  it("correctly sums up the total income amount when the data was calculated", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: initialMonatsplanerState,
      stepRechner: {
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 1,
                bisLebensMonat: 1,
                nettoEinkommen: 20,
              },
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 5,
                bisLebensMonat: 7,
                nettoEinkommen: 10,
              },
            ],
          },
        },
        ET2: {
          ...initialStepRechnerState.ET2,
          elterngeldResult: {
            state: "success",
            data: [
              {
                ...ANY_ELTERNGELD_ROW,
                vonLebensMonat: 1,
                bisLebensMonat: 6,
                nettoEinkommen: 10,
              },
            ],
          },
        },
      },
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current[0]?.totalIncomeAmount).toEqual(50);
    expect(result.current[1]?.totalIncomeAmount).toEqual(60);
  });

  it("provides a single summary only if applicant is a single parent", () => {
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "EinenElternteil",
      },
    };

    const { result } = renderHook(() => useSummarizeData(), { preloadedState });

    expect(result.current).toHaveLength(1);
  });
});

const ANY_MONTH = { type: "None", isMutterschutzMonth: false };

const ANY_ELTERNGELD_ROW = {
  vonLebensMonat: 1,
  bisLebensMonat: 1,
  basisElternGeld: 0,
  elternGeldPlus: 0,
  nettoEinkommen: 0,
};

const MONATSPlANER_STATE_SOME_MONTHS_PLANNED: MonatsplanerState = {
  ...initialMonatsplanerState,
  elternteile: {
    ...initialMonatsplanerState.elternteile,
    ET1: {
      months: [{ ...ANY_MONTH, type: "BEG" }],
    },
    ET2: {
      months: [{ ...ANY_MONTH, type: "EG+" }],
    },
  },
};

const STEP_RECHNER_STATE_NOT_CALCULATED: StepRechnerState = {
  ET1: {
    ...initialStepRechnerState.ET1,
    elterngeldResult: { state: "pending" },
  },
  ET2: {
    ...initialStepRechnerState.ET2,
    elterngeldResult: { state: "pending" },
  },
};
