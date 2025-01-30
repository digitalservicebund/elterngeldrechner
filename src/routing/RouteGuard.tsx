import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StepRoute } from "@/components/pages/formSteps";
import { RootState } from "@/redux";
import { useAppStore } from "@/redux/hooks";

type RouteGuardProps = {
  readonly precondition: (state: RootState) => boolean;
  readonly fallback: StepRoute;
  readonly children: ReactNode;
};

function RouteGuard({ precondition, fallback, children }: RouteGuardProps) {
  const store = useAppStore();

  if (precondition(store.getState())) {
    return <>{children}</>;
  } else {
    return <Navigate to={fallback} replace />;
  }
}

export default RouteGuard;
