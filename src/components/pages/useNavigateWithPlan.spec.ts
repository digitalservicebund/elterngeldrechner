import { renderHook } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { useNavigateWithPlan } from "./useNavigateWithPlan";

vi.mock("react-router-dom");

describe("use navigate with Plan", () => {
  describe("plan state", () => {
    it("takes the plan property from the history state when defined", () => {
      vi.mocked(useLocation).mockReturnValue({
        ...ANY_LOCATION,
        state: { plan: "untyped fake plan" },
      });

      const { result } = renderHook(() => useNavigateWithPlan());

      expect(result.current.plan).toEqual("untyped fake plan");
    });

    it("returns and undefined Plan if the history state is null", () => {
      vi.mocked(useLocation).mockReturnValue({
        ...ANY_LOCATION,
        state: null,
      });

      const { result } = renderHook(() => useNavigateWithPlan());

      expect(result.current.plan).toBeUndefined();
    });
  });

  describe("navigate with plan state", () => {
    it("sets the given plan as history state", () => {
      const navigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(navigate);

      const { result } = renderHook(() => useNavigateWithPlan());
      result.current.navigateWithPlanState("anywhere", ANY_PLAN);

      expect(navigate).toHaveBeenCalledOnce();
      expect(navigate).toHaveBeenLastCalledWith(expect.anything(), {
        state: { plan: ANY_PLAN },
      });
    });

    it("navigates to the given location", () => {
      const navigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(navigate);

      const { result } = renderHook(() => useNavigateWithPlan());
      result.current.navigateWithPlanState("/cool-page", undefined);

      expect(navigate).toHaveBeenCalledOnce();
      expect(navigate).toHaveBeenLastCalledWith(
        "/cool-page",
        expect.anything(),
      );
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
