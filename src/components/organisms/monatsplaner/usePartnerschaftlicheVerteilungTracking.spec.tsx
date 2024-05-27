import { usePartnerschaftlicheVerteilungTracking } from "./usePartnerschaftlicheVerteilungTracking";
import { calculatePartnerschaftlichkeiteVerteilung } from "@/monatsplaner/elternteile/partnerschaftlichkeit";
import { RootState } from "@/redux";
import {
  initialMonatsplanerState,
  monatsplanerActions,
} from "@/redux/monatsplanerSlice";
import { act, renderHook } from "@/test-utils/test-utils";
import { setTrackingVariable } from "@/user-tracking";

jest.mock("@/monatsplaner/elternteile/partnerschaftlichkeit");
jest.mock("@/user-tracking/data-layer");

describe("usePartnerschaftlichskeitFaktorTracking", () => {
  beforeEach(() => {
    jest.mocked(calculatePartnerschaftlichkeiteVerteilung).mockReturnValue(0);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should trigger the calculation with the lastest data", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: { months: [{ ...ANY_MONTH, type: "BEG" }] },
          ET2: { months: [{ ...ANY_MONTH, type: "EG+" }] },
        },
      },
    };

    renderHook(() => usePartnerschaftlicheVerteilungTracking(), {
      preloadedState,
    });

    expect(calculatePartnerschaftlichkeiteVerteilung).toHaveBeenCalledTimes(1);
    expect(calculatePartnerschaftlichkeiteVerteilung).toHaveBeenCalledWith(
      ["BEG"],
      ["EG+"],
    );
  });

  it("should set the tracking variable", () => {
    jest.mocked(calculatePartnerschaftlichkeiteVerteilung).mockReturnValue(0.5);

    renderHook(() => usePartnerschaftlicheVerteilungTracking());

    expect(setTrackingVariable).toHaveBeenCalledTimes(1);
    expect(setTrackingVariable).toHaveBeenCalledWith(
      "partnerschaftlicheverteilung",
      0.5,
    );
  });

  it("should re-calculate the and set the variable when data changes", () => {
    const preloadedState: Partial<RootState> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: { months: [{ ...ANY_MONTH, type: "BEG" }] },
          ET2: { months: [{ ...ANY_MONTH, type: "EG+" }] },
        },
      },
    };
    jest
      .mocked(calculatePartnerschaftlichkeiteVerteilung)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(1);

    const { store } = renderHook(
      () => usePartnerschaftlicheVerteilungTracking(),
      {
        preloadedState,
      },
    );

    act(() => {
      store.dispatch(
        monatsplanerActions.changeMonth({
          elternteil: "ET2",
          targetType: "BEG",
          monthIndex: 0,
          partnerMonate: false,
        }),
      );
    });

    expect(calculatePartnerschaftlichkeiteVerteilung).toHaveBeenCalledTimes(2);
    expect(calculatePartnerschaftlichkeiteVerteilung).toHaveBeenLastCalledWith(
      ["BEG"],
      ["BEG"],
    );

    expect(setTrackingVariable).toHaveBeenCalledTimes(2);
    expect(setTrackingVariable).toHaveBeenLastCalledWith(
      "partnerschaftlicheverteilung",
      1,
    );
  });
});

const ANY_MONTH = {
  isMutterschutzMonth: false,
  type: "None",
};
