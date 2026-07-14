import { type ReactNode, useCallback } from "react";
import { type To, useLocation, useNavigate } from "react-router";
import type { Beispiel } from "@/application/features/planungsteil/beispiele";
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
  const { describe, it, expect } = import.meta.vitest;

  describe("use stateful navigation", async () => {
    const { act, renderHook } = await import("@testing-library/react");
    const { createElement } = await import("react");
    const { MemoryRouter } = await import("react-router");

    function memoryRouterWithHistoryState(state: unknown) {
      return ({ children }: { readonly children: ReactNode }) => {
        const historyState = { initialEntries: [{ pathname: "/", state }] };

        return createElement(MemoryRouter, historyState, children);
      };
    }

    describe("plan state", () => {
      it("takes the plan property from the history state when defined", () => {
        const { result } = renderHook(() => useNavigateStateful(), {
          wrapper: memoryRouterWithHistoryState({ plan: "untyped fake plan" }),
        });

        expect(result.current.navigationState.plan).toEqual(
          "untyped fake plan",
        );
      });

      it("returns and undefined Plan if the history state is null", () => {
        const { result } = renderHook(() => useNavigateStateful(), {
          wrapper: memoryRouterWithHistoryState(null),
        });

        expect(result.current.navigationState.plan).toBeUndefined();
      });
    });

    describe("navigate with plan state", () => {
      it("sets the given plan as history state", async () => {
        const { result } = renderHook(
          () => ({
            stateful: useNavigateStateful(),
            location: useLocation(),
          }),
          { wrapper: memoryRouterWithHistoryState(null) },
        );

        await act(() =>
          result.current.stateful.navigateStateful("/anywhere", {
            plan: ANY_PLAN,
          }),
        );

        expect(result.current.location.pathname).toEqual("/anywhere");
        expect(result.current.location.state).toEqual({ plan: ANY_PLAN });
      });
    });

    describe("beispiel state", () => {
      it("takes the beispiel property from the history state when defined", () => {
        const { result } = renderHook(() => useNavigateStateful(), {
          wrapper: memoryRouterWithHistoryState({
            beispiel: "untyped fake beispiel",
          }),
        });

        expect(result.current.navigationState.beispiel).toEqual(
          "untyped fake beispiel",
        );
      });

      it("returns and undefined Plan if the history state is null", () => {
        const { result } = renderHook(() => useNavigateStateful(), {
          wrapper: memoryRouterWithHistoryState(null),
        });

        expect(result.current.navigationState.plan).toBeUndefined();
      });
    });
  });

  const ANY_PLAN = {
    ausgangslage: {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate: {},
  };
}
