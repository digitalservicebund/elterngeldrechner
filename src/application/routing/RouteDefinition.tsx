import { Navigate, Outlet, useLocation } from "react-router";
import { Route } from "./Route";
import { RouteGuardAbfrageteil } from "./RouteGuardAbfrageteil";
import { RouteGuardDatenuebernahme } from "./RouteGuardDatenuebernahme";
import { RouteGuardPlanungsteil } from "./RouteGuardPlanungsteil";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { EventProvider } from "@/application/features/abfrageteil/events/EventContext";
import { UserFeedbackProvider } from "@/application/features/planungsteil/planer/component/user-feedback";
import {
  AllgemeineAngabenPage,
  ElternteilAusklammerungElternzeitAbfragePage,
  ElternteilAusklammerungElternzeitZeitenPage,
  ElternteilAusklammerungErkrankungAbfragePage,
  ElternteilAusklammerungErkrankungZeitenPage,
  ElternteilAusklammerungMutterschutzAbfragePage,
  ElternteilAusklammerungMutterschutzZeitenPage,
  ElternteilBMZUebersichtPage,
  ElternteilEinsAllgemeineAngabenPage,
  ElternteilGemeinsamePlanungAbfragePage,
  ElternteilTaetigkeitenAbfragePage,
  GeborenesKindPage,
  GeschwisterbonusUebersichtPage,
  GeschwisterkindAbfragePage,
  GeschwisterkindAngabenPage,
  GeschwisterkindAnzahlAbfragePage,
  KindPage,
  Startseite,
  UngeborenesKindPage,
  WahrscheinlichGeborenesKindPage,
} from "@/application/features/abfrageteil/pages";
import { ElternteilZweiAllgemeineAngabenPage } from "@/application/features/abfrageteil/pages/elternteil/ElternteilZweiAllgemeineAngabenPage";
import { ElternteilTaetigkeitAngabenEinkommenDetailsPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenDetailsPage";
import { ElternteilTaetigkeitAngabenEinkommenPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenPage";
import { ElternteilTaetigkeitAngabenMinijobPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenMinijobPage";
import { ElternteilTaetigkeitAngabenNichtSelbststaendigPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenNichtSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSelbststaendigPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSozialversicherungenPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilTaetigkeitAngabenSozialversicherungenPage";
import { ElternteilWeitereTaetigkeitAbfragePage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilWeitereTaetigkeitAbfragePage";
import { ElternteilWeitereTaetigkeitAngabenPage } from "@/application/features/abfrageteil/pages/taetigkeit/ElternteilWeitereTaetigkeitAngabenPage";
import { ErrorBoundary } from "@/application/routing/ErrorBoundary";
import { BeispielePage } from "@/application/features/planungsteil/beispiele/BeispielePage";
import { DatenuebernahmeAntragPage } from "@/application/features/datenuebernahme/DatenuebernahmeAntragPage";
import { PlanerPage } from "@/application/features/planungsteil/planer/PlanerPage";
import { useEffect, useRef } from "react";
import { useNavigationType } from "react-router";
import { posthog } from "@/application/user-tracking/posthog";
import { isNewIncomeFlowEnabled } from "../feature-flags";
import { ElternteilTaetigkeitenAbfragePage as ElternteilTaetigkeitenAbfragePageNew } from "@/application/features/abfrageteil/pages/elternteil/ElternteilTaetigkeitenAbfragePageNew";

function EventProviderLayout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    posthog.capture("$pageview");
    if (navigationType === "POP") {
      posthog.capture("browser_zurueck_button_geklickt", {
        route: prevPathname.current.replace("/abfrageteil", ""),
      });
    }
    prevPathname.current = location.pathname;
  }, [location.pathname, navigationType]);

  return (
    <UserFeedbackProvider>
      <EventProvider>
        <Outlet key={location.pathname} />
      </EventProvider>
    </UserFeedbackProvider>
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
            element: <GeschwisterkindAnzahlAbfragePage />,
            path: generateAbfrageteilPath(Route.GeschwisterkindAnzahlAbfrage),
          },
          {
            element: <GeschwisterbonusUebersichtPage />,
            path: generateAbfrageteilPath(Route.GeschwisterbonusUebersicht),
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
            element: <ElternteilGemeinsamePlanungAbfragePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilGemeinsamePlanungAbfrage,
            ),
          },
          {
            element: <ElternteilAusklammerungErkrankungAbfragePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungErkrankungAbfrage,
            ),
          },
          {
            element: <ElternteilAusklammerungErkrankungZeitenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungErkrankungZeitenAngaben,
            ),
          },
          {
            element: <ElternteilAusklammerungElternzeitAbfragePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungElternzeitAbfrage,
            ),
          },
          {
            element: <ElternteilAusklammerungElternzeitZeitenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungElternzeitZeitenAngaben,
            ),
          },
          {
            element: <ElternteilAusklammerungMutterschutzAbfragePage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungMutterschutzAbfrage,
            ),
          },
          {
            element: <ElternteilAusklammerungMutterschutzZeitenPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilAusklammerungMutterschutzZeitenAngaben,
            ),
          },
          {
            element: isNewIncomeFlowEnabled() ? (
              <ElternteilTaetigkeitenAbfragePageNew />
            ) : (
              <ElternteilTaetigkeitenAbfragePage />
            ),
            path: generateAbfrageteilPath(Route.ElternteilTaetigkeitenAbfrage),
          },
          {
            element: <ElternteilBMZUebersichtPage />,
            path: generateAbfrageteilPath(
              Route.ElternteilTaetigkeitenBMZUebersicht,
            ),
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
