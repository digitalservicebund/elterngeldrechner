import { Navigate, Outlet, generatePath, useLocation } from "react-router";
import { FormEvent } from "./FormEvent";
import { Route } from "./Route";
import { findeNaechstenPfad } from "./findeNaechstenPfad";
import {
  generateAbfrageteilPath,
  generateParametrizedPath,
} from "./generatePath";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";

export function RouteGuardAbfrageteil() {
  const { filtereValideEventHistorie, findeLetztesEvent } = useEventContext();
  const { pathname } = useLocation();

  const startseitePfad = generateAbfrageteilPath(Route.Startseite);
  const allgemeineAngabenPfad = generateAbfrageteilPath(
    Route.AllgemeineAngaben,
  );

  if (pathname === startseitePfad || pathname === allgemeineAngabenPfad) {
    return <Outlet />;
  }

  const valideEventHistorie = filtereValideEventHistorie();
  const letztesValidesEvent = findeLetztesEvent();

  if (
    valideEventHistorie[0]?.route === undefined ||
    letztesValidesEvent === undefined
  ) {
    return <Navigate to={allgemeineAngabenPfad} replace />;
  }

  const letzteErlaubteRoute = findeLetzteErlaubteRoute(
    valideEventHistorie,
    letztesValidesEvent,
    pathname,
  );

  if (letzteErlaubteRoute) {
    return <Navigate to={letzteErlaubteRoute} replace />;
  }

  return <Outlet />;
}

function findeLetzteErlaubteRoute(
  valideEventHistorie: FormEvent[],
  letztesValidesEvent: FormEvent,
  aktuelleRoute: string,
) {
  const maximalErlaubterPfad = findeNaechstenPfad(letztesValidesEvent);

  if (aktuelleRoute === maximalErlaubterPfad) {
    return undefined;
  }

  const istAufAbgeschlossenerSeite = valideEventHistorie.some(
    (event) => erstellePfadAusEvent(event) === aktuelleRoute,
  );

  return istAufAbgeschlossenerSeite ? undefined : maximalErlaubterPfad;
}

const erstellePfadAusEvent = (event: FormEvent): string => {
  if ("params" in event) {
    // @ts-expect-error: Die Korrelation zwischen route und params ist durch die FormEvent Union sichergestellt
    const path = generateParametrizedPath(event.route, event.params);
    return generateAbfrageteilPath(path);
  }
  return generateAbfrageteilPath(generatePath(event.route));
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeLetzteErlaubteRoute", () => {
    it("it returns undefined when aktuelleRoute is next possible page", () => {
      const eventStream: FormEvent[] = [
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Hanna",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
      ];
      const letztesEvent: FormEvent = {
        route: Route.ElternteilAllgemeineAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          name: "Hanna",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      };

      const result = findeLetzteErlaubteRoute(
        eventStream,
        letztesEvent,
        "/abfrageteil/elternteil/0/finanzielles/ausklammerung/gruende",
      );

      expect(result).toBeUndefined();
    });

    it("it returns undefined when aktuelleRoute is in valideEventHistorie", () => {
      const eventStream: FormEvent[] = [
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Hanna",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilAusklammerungGruendeAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeineAusklammerungsgruende: false,
            hatMutterschutzAelteresKind: true,
            hatElterngeldAelteresKind: false,
            hatSchwangerschaftsbedingteErkrankung: false,
          },
        },
      ];
      const letztesEvent: FormEvent = {
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          hatKeineAusklammerungsgruende: false,
          hatMutterschutzAelteresKind: true,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
        },
      };

      const result = findeLetzteErlaubteRoute(
        eventStream,
        letztesEvent,
        "/abfrageteil/elternteil/0",
      );

      expect(result).toBeUndefined();
    });

    it("it returns '/abfrageteil/elternteil/0/finanzielles/ausklammerung/zeiten' when aktuelleRoute is neither in valideEventHistorie nor next possible page", () => {
      const eventStream: FormEvent[] = [
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Hanna",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilAusklammerungGruendeAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeineAusklammerungsgruende: false,
            hatMutterschutzAelteresKind: true,
            hatElterngeldAelteresKind: false,
            hatSchwangerschaftsbedingteErkrankung: false,
          },
        },
      ];
      const letztesEvent: FormEvent = {
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          hatKeineAusklammerungsgruende: false,
          hatMutterschutzAelteresKind: true,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
        },
      };

      const result = findeLetzteErlaubteRoute(
        eventStream,
        letztesEvent,
        "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
      );

      expect(result).toEqual(
        "/abfrageteil/elternteil/0/finanzielles/ausklammerung/zeiten",
      );
    });
  });
}
