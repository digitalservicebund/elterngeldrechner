import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { StepRoute } from "./formSteps";
import { RootState } from "@/application/redux";
import { useAppStore } from "@/application/redux/hooks";
import { PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type Props = {
  readonly fallback: StepRoute;
  readonly children: ReactNode;

  readonly precondition: (
    state: RootState,
    store: ReturnType<typeof useAppStore>,
    plan?: PlanMitBeliebigenElternteilen,
  ) => boolean;
};

function RouteGuard({ precondition, fallback, children }: Props) {
  const store = useAppStore();
  const location = useLocation();

  const state = location?.state as StateWithOptionalPlan;
  const plan = state ? state.plan : undefined;

  if (precondition(store.getState(), store, plan)) {
    return <>{children}</>;
  } else {
    return <Navigate to={fallback} replace />;
  }
}

type StateWithOptionalPlan = null | {
  plan?: PlanMitBeliebigenElternteilen;
};

export default RouteGuard;
