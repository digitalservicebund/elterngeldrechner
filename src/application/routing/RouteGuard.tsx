import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StepRoute } from "./formSteps";
import { useNavigateWithPlan } from "@/application/hooks/useNavigateWithPlan";
import { RootState } from "@/application/redux";
import { useAppStore } from "@/application/redux/hooks";
import { PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type Props = {
  readonly fallback: StepRoute;
  readonly children: ReactNode;

  readonly precondition: (
    state: RootState,
    plan?: PlanMitBeliebigenElternteilen,
  ) => boolean;
};

function RouteGuard({ precondition, fallback, children }: Props) {
  const store = useAppStore();
  const navigation = useNavigateWithPlan();

  if (precondition(store.getState(), navigation.plan)) {
    return <>{children}</>;
  } else {
    return <Navigate to={fallback} replace />;
  }
}

export default RouteGuard;
