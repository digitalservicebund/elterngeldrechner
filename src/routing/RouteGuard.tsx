import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StepRoute } from "@/components/pages/formSteps";
import { useNavigateWithPlan } from "@/components/pages/useNavigateWithPlan";
import { PlanMitBeliebigenElternteilen } from "@/features/planer/domain";
import { RootState } from "@/redux";
import { useAppStore } from "@/redux/hooks";

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
