import { Navigate, Outlet } from "react-router";
import { Route } from "./Route";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import { generateAbfrageteilPath } from "./generatePath";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useNavigateStateful } from "@/application/features/planungsteil/planer/hooks/useNavigateStateful";

export function RouteGuardDatenuebernahme() {
  const { filtereValideEventHistorie } = useEventContext();
  const { navigationState } = useNavigateStateful();

  const startseitePfad = generateAbfrageteilPath(Route.Startseite);

  const valideEventHistorie = filtereValideEventHistorie();
  const letztesValidesEvent = valideEventHistorie.at(-1);

  if (!letztesValidesEvent) {
    return <Navigate to={startseitePfad} replace />;
  }

  const maximalErlaubterPfad = findeNaechstenPfad(letztesValidesEvent);

  if (maximalErlaubterPfad !== "/beispiele") {
    return <Navigate to={maximalErlaubterPfad} replace />;
  }

  const { plan } = navigationState;

  if (plan === undefined) {
    return <Navigate to="/rechner-planer" replace />;
  }

  return <Outlet />;
}
