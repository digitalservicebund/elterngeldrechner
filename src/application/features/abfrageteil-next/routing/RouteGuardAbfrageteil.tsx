import { Navigate, Outlet, useLocation } from "react-router";
import { Route } from "./Route";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import { generateAbfrageteilPath } from "./generatePath";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";

export function RouteGuardAbfrageteil() {
  const { filtereValideEventHistorie } = useEventContext();
  const { pathname } = useLocation();

  const startseitePfad = generateAbfrageteilPath(Route.Startseite);
  const allgemeineAngabenPfad = generateAbfrageteilPath(
    Route.AllgemeineAngaben,
  );

  if (pathname === startseitePfad || pathname === allgemeineAngabenPfad) {
    return <Outlet />;
  }

  const valideEventHistorie = filtereValideEventHistorie();

  if (valideEventHistorie[0]?.route === undefined) {
    return <Navigate to={allgemeineAngabenPfad} replace />;
  }

  const letztesValidesEvent =
    valideEventHistorie[valideEventHistorie.length - 1];

  const maximalErlaubterPfad = letztesValidesEvent
    ? findeNaechstenPfad(letztesValidesEvent)
    : allgemeineAngabenPfad;

  const istAufAbgeschlossenerSeite = valideEventHistorie.some(
    (event) => generateAbfrageteilPath(event.route) === pathname,
  );
  const istAufNaechsterErlaubterSeite = pathname === maximalErlaubterPfad;
  const pfadIstNochNichtErlaubt =
    !istAufAbgeschlossenerSeite && !istAufNaechsterErlaubterSeite;

  if (pfadIstNochNichtErlaubt) {
    return <Navigate to={maximalErlaubterPfad} replace />;
  }

  return <Outlet />;
}
