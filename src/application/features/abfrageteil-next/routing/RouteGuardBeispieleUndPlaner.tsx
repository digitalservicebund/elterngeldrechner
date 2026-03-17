import { Navigate, Outlet } from "react-router";
import { Route } from "./Route";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import { generateAbfrageteilPath } from "./generatePath";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";

export function RouteGuardBeispieleUndPlaner() {
  const { filtereValideEventHistorie } = useEventContext();

  const allgemeineAngabenPfad = generateAbfrageteilPath(
    Route.AllgemeineAngaben,
  );

  const valideEventHistorie = filtereValideEventHistorie();

  if (valideEventHistorie.length === 0) {
    return <Navigate to={allgemeineAngabenPfad} replace />;
  }

  const letztesValidesEvent = valideEventHistorie.at(-1);

  if (letztesValidesEvent === undefined) {
    return <Navigate to={allgemeineAngabenPfad} replace />;
  }

  const maximalErlaubterPfad = findeNaechstenPfad(letztesValidesEvent);

  if (maximalErlaubterPfad === "/beispiele") {
    return <Outlet />;
  }

  return <Navigate to={maximalErlaubterPfad} replace />;
}
