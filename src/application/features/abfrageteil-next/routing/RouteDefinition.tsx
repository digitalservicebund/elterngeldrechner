import { Navigate, Outlet, useLocation } from "react-router";
import { Route } from "./Route";
import { RouteGuardAbfrageteil } from "./RouteGuardAbfrageteil";
import { RouteGuardDatenuebernahme } from "./RouteGuardDatenuebernahme";
import { RouteGuardPlanungsteil } from "./RouteGuardPlanungsteil";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { EventProvider } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  AllgemeineAngabenPage,
  ElternteilAusklammerungGruendePage,
  ElternteilAusklammerungZeitenPage,
  ElternteilEinsAllgemeineAngabenPage,
  ElternteilTaetigkeitenAbfragePage,
  GeborenesKindPage,
  GeschwisterkindAbfragePage,
  GeschwisterkindAngabenPage,
  KindPage,
  Startseite,
  UngeborenesKindPage,
  WahrscheinlichGeborenesKindPage,
} from "@/application/features/abfrageteil-next/pages";
import { ElternteilZweiAllgemeineAngabenPage } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilZweiAllgemeineAngabenPage";
import { ElternteilTaetigkeitAngabenEinkommenDetailsPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenDetailsPage";
import { ElternteilTaetigkeitAngabenEinkommenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenPage";
import { ElternteilTaetigkeitAngabenMinijobPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenMinijobPage";
import { ElternteilTaetigkeitAngabenNichtSelbststaendigPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenNichtSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSelbststaendigPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSozialversicherungenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenSozialversicherungenPage";
import { ElternteilWeitereTaetigkeitAbfragePage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilWeitereTaetigkeitAbfragePage";
import { ElternteilWeitereTaetigkeitAngabenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilWeitereTaetigkeitAngabenPage";
import { ErrorBoundary } from "@/application/features/abfrageteil-next/routing/ErrorBoundary";
import {
  BeispielePage,
  DebugFehlerPage,
  DatenuebernahmeAntragPage,
  PlanerPage,
} from "@/application/pages";
import { isPosthogEnabled } from "@/application/feature-flags";
import { useEffect } from "react";
import posthog from "posthog-js";

function EventProviderLayout() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview");
  }, [location.pathname]);

  return (
    <EventProvider>
      <Outlet key={location.pathname} />
    </EventProvider>
  );
}

const RouteDefinition = [
  {
    element: (
      <ErrorBoundary>
        <EventProviderLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        element: <Startseite />,
        path: generateAbfrageteilPath(Route.Startseite),
      },
      {
        element: <RouteGuardAbfrageteil />,
        children: [
          {
            element: <AllgemeineAngabenPage />,
            path: generateAbfrageteilPath(Route.AllgemeineAngaben),
          },
          {
            element: <KindPage />,
            path: generateAbfrageteilPath(Route.KindAbfrage),
          },
          {
            element: <GeborenesKindPage />,
            path: generateAbfrageteilPath(Route.GeborenesKindAngaben),
          },
          {
            element: <UngeborenesKindPage />,
            path: generateAbfrageteilPath(Route.UngeborenesKindAngaben),
          },
          {
            element: <WahrscheinlichGeborenesKindPage />,
            path: generateAbfrageteilPath(
              Route.WahrscheinlichGeborenesKindAbfrage,
            ),
          },
          {
            element: <GeschwisterkindAbfragePage />,
            path: generateAbfrageteilPath(Route.GeschwisterkindAbfrage),
          },
          {
            element: <GeschwisterkindAngabenPage />,
            path: generateAbfrageteilPath(Route.GeschwisterkindAngaben),
          },
          {
            element: <ElternteilEinsAllgemeineAngabenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilEinsAllgemeineAngaben,
            ),
          },
          {
            element: <ElternteilAusklammerungGruendePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungGruendeAngaben,
            ),
          },
          {
            element: <ElternteilAusklammerungZeitenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungZeitenAngaben,
            ),
          },
          {
            element: <ElternteilTaetigkeitenAbfragePage />,
            path: generateAbfrageteilPath(Route.ElternteilTaetigkeitenAbfrage),
          },
          {
            element: <ElternteilTaetigkeitAngabenSelbststaendigPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenSelbststaendig,
            ),
          },
          {
            element: <ElternteilTaetigkeitAngabenNichtSelbststaendigPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            ),
          },
          {
            element: <ElternteilTaetigkeitAngabenMinijobPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenMinijob,
            ),
          },
          {
            element: <ElternteilTaetigkeitAngabenSozialversicherungenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenSozialversicherungen,
            ),
          },
          {
            element: <ElternteilTaetigkeitAngabenEinkommenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenEinkommen,
            ),
          },
          {
            element: <ElternteilTaetigkeitAngabenEinkommenDetailsPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitAngabenEinkommenDetails,
            ),
          },
          {
            element: <ElternteilWeitereTaetigkeitAbfragePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilWeitereTaetigkeitAbfrage,
            ),
          },
          {
            element: <ElternteilWeitereTaetigkeitAngabenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilWeitereTaetigkeitAngaben,
            ),
          },
          {
            element: <ElternteilZweiAllgemeineAngabenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilZweiAllgemeineAngaben,
            ),
          },
        ],
      },
      {
        element: <RouteGuardPlanungsteil />,
        children: [
          {
            element: <BeispielePage />,
            path: "/beispiele",
          },
          {
            element: <PlanerPage />,
            path: "/rechner-planer",
          },
        ],
      },
      {
        element: <RouteGuardDatenuebernahme />,
        children: [
          {
            element: <DatenuebernahmeAntragPage />,
            path: "/datenuebernahme-antrag",
          },
        ],
      },
      ...(isPosthogEnabled()
        ? [{ element: <DebugFehlerPage />, path: "/debug-fehler" }]
        : []),
      {
        element: (
          <Navigate to={generateAbfrageteilPath(Route.Startseite)} replace />
        ),
        path: "*",
      },
    ],
  },
];

export default RouteDefinition;
