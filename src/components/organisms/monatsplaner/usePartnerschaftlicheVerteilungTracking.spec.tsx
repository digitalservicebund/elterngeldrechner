import { usePartnerschaftlicheVerteilungTracking } from "./usePartnerschaftlicheVerteilungTracking";
import { RootState as initialStepAllgemeineAngaben } from "@/redux";
import {
  initialMonatsplanerState,
  monatsplanerActions,
} from "@/redux/monatsplanerSlice";
import { act, renderHook } from "@/test-utils/test-utils";
import { trackPartnerschaftlicheVerteilung } from "@/user-tracking";

vi.mock("@/user-tracking/partnerschaftlichkeit");

describe("usePartnerschaftlichskeitFaktorTracking", () => {
  it("should trigger the tracking of 'partnerschaftliche Verteilung'", () => {
    const preloadedState: Partial<initialStepAllgemeineAngaben> = {
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

    expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledTimes(1);
    expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledWith(
      ["BEG"],
      ["EG+"],
      false,
    );
  });

  it("should re-calculate the and set the variable when data changes", () => {
    const preloadedState: Partial<initialStepAllgemeineAngaben> = {
      monatsplaner: {
        ...initialMonatsplanerState,
        elternteile: {
          ...initialMonatsplanerState.elternteile,
          ET1: { months: [{ ...ANY_MONTH, type: "BEG" }] },
          ET2: { months: [{ ...ANY_MONTH, type: "EG+" }] },
        },
      },
    };

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

    expect(trackPartnerschaftlicheVerteilung).toHaveBeenCalledTimes(2);
    expect(trackPartnerschaftlicheVerteilung).toHaveBeenLastCalledWith(
      ["BEG"],
      ["BEG"],
      false,
    );
  });
});

const ANY_MONTH = {
  isMutterschutzMonth: false,
  type: "None",
};
