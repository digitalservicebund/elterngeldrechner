import { useCallback } from "react";
import { type To, useLocation, useNavigate } from "react-router-dom";
import type { PlanMitBeliebigenElternteilen } from "@/monatsplaner";

export function useNavigateWithPlan() {
  const location = useLocation();
  const state = location?.state as StateWithOptionalPlan;
  const plan = state ? state.plan : undefined;

  const navigate = useNavigate();
  const navigateWithPlanState = useCallback(
    (to: To, plan: PlanMitBeliebigenElternteilen | undefined) =>
      navigate(to, { state: { plan } }),
    [navigate],
  );

  return { plan, navigateWithPlanState };
}

type StateWithOptionalPlan = null | {
  plan?: PlanMitBeliebigenElternteilen;
};
