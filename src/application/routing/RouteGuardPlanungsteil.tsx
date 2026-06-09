import { Navigate, Outlet } from "react-router";
import { Route } from "./Route";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import { generateAbfrageteilPath } from "./generatePath";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";

export function RouteGuardPlanungsteil() {
  const { filtereValideEventHistorie } = useEventContext();

  const startseitePfad = generateAbfrageteilPath(Route.Startseite);

  const valideEventHistorie = filtereValideEventHistorie();
  const letztesValidesEvent = valideEventHistorie.at(-1);

  if (!letztesValidesEvent) {
    return <Navigate to={startseitePfad} replace />;
  }

  const maximalErlaubterPfad = findeNaechstenPfad(letztesValidesEvent);

  if (maximalErlaubterPfad === "/beispiele") {
    return <Outlet />;
  }

  return <Navigate to={maximalErlaubterPfad} replace />;
}
