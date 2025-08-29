import { useCallback } from "react";
import { type To, useLocation, useNavigate } from "react-router-dom";
import type { Beispiel } from "@/application/features/beispiele";
import type {
  Ausgangslage,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";

export function useNavigateStateful() {
  const location = useLocation();
  const navigationState = (location?.state as NavigationState) || {};

  const navigate = useNavigate();

  const navigateStateful = useCallback(
    (to: To, state: NavigationState) => navigate(to, { state }),
    [navigate],
  );

  return { navigationState, navigateStateful };
}

type NavigationState = {
  plan?: PlanMitBeliebigenElternteilen;
  beispiel?: Beispiel<Ausgangslage>;
};

if (import.meta.vitest) {
  const { vi, describe, it, expect } = import.meta.vitest;

  vi.mock("react-router-dom");

  describe("use stateful navigation", async () => {
    const { renderHook } = await import("@testing-library/react");

    describe("plan state", () => {
      it("takes the plan property from the history state when defined", () => {
        vi.mocked(useLocation).mockReturnValue({
          ...ANY_LOCATION,
          state: { plan: "untyped fake plan" },
        });

        const { result } = renderHook(() => useNavigateStateful());

        expect(result.current.navigationState.plan).toEqual(
          "untyped fake plan",
        );
      });

      it("returns and undefined Plan if the history state is null", () => {
        vi.mocked(useLocation).mockReturnValue({
          ...ANY_LOCATION,
          state: null,
        });

        const { result } = renderHook(() => useNavigateStateful());

        expect(result.current.navigationState.plan).toBeUndefined();
      });
    });

    describe("navigate with plan state", () => {
      it("sets the given plan as history state", () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(navigate);

        const { result } = renderHook(() => useNavigateStateful());
        void result.current.navigateStateful("anywhere", {
          plan: ANY_PLAN,
        });

        expect(navigate).toHaveBeenCalledOnce();
        expect(navigate).toHaveBeenLastCalledWith(expect.anything(), {
          state: { plan: ANY_PLAN },
        });
      });
    });

    describe("beispiel state", () => {
      it("takes the beispiel property from the history state when defined", () => {
        vi.mocked(useLocation).mockReturnValue({
          ...ANY_LOCATION,
          state: { beispiel: "untyped fake beispiel" },
        });

        const { result } = renderHook(() => useNavigateStateful());

        expect(result.current.navigationState.beispiel).toEqual(
          "untyped fake beispiel",
        );
      });

      it("returns and undefined Plan if the history state is null", () => {
        vi.mocked(useLocation).mockReturnValue({
          ...ANY_LOCATION,
          state: null,
        });

        const { result } = renderHook(() => useNavigateStateful());

        expect(result.current.navigationState.plan).toBeUndefined();
      });
    });
  });

  const ANY_LOCATION = {
    pathname: "pathname",
    state: null,
    key: "",
    search: "",
    hash: "",
  };

  const ANY_PLAN = {
    ausgangslage: {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate: {},
  };
}
