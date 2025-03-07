import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StepRoute } from "./formSteps";
import { useNavigateWithPlan } from "./pages/useNavigateWithPlan";
import { RootState } from "@/application/redux";
import { useAppStore } from "@/application/redux/hooks";
import { PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type RouteGuardProps = {
  readonly fallback: StepRoute;
  readonly children: ReactNode;

  readonly precondition: (
    state: RootState,
    plan?: PlanMitBeliebigenElternteilen,
  ) => boolean;
};

function RouteGuard({ precondition, fallback, children }: RouteGuardProps) {
  const store = useAppStore();
  const navigation = useNavigateWithPlan();

  if (precondition(store.getState(), navigation.plan)) {
    return <>{children}</>;
  } else {
    return <Navigate to={fallback} replace />;
  }
}

export default RouteGuard;
