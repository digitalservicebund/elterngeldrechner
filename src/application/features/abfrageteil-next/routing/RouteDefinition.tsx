import { Navigate, Outlet, useLocation } from "react-router";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { EventProvider } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  AllgemeineAngabenPage,
  ElternteilAllgemeineAngabenPage,
  ElternteilAusklammerungGruendePage,
  ElternteilAusklammerungZeitenPage,
  ElternteilTaetigkeitenAbfragePage,
  GeborenesKindPage,
  GeschwisterkindAbfragePage,
  GeschwisterkindAngabenPage,
  KindPage,
  Startseite,
  UngeborenesKindPage,
  WahrscheinlichGeborenesKindPage,
} from "@/application/features/abfrageteil-next/pages";
import { ElternteilZweitePersonAngabenPage } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilZweitePersonAngabenPage";
import { ElternteilTaetigkeitAngabenEinkommenDetailsPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenDetailsPage";
import { ElternteilTaetigkeitAngabenEinkommenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenEinkommenPage";
import { ElternteilTaetigkeitAngabenMinijobPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenMinijobPage";
import { ElternteilTaetigkeitAngabenMischeinkunftPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenMischeinkunftPage";
import { ElternteilTaetigkeitAngabenNichtSelbststaendigPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenNichtSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSelbststaendigPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenSelbststaendigPage";
import { ElternteilTaetigkeitAngabenSozialversicherungenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenSozialversicherungenPage";
import { ElternteilWeitereTaetigkeitAbfragePage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilWeitereTaetigkeitAbfragePage";
import { ElternteilWeitereTaetigkeitAngabenPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilWeitereTaetigkeitAngabenPage";
import { BeispielePage } from "@/application/pages";

function EventProviderLayout() {
  const location = useLocation();

  return (
    <EventProvider>
      <Outlet key={location.pathname} />
    </EventProvider>
  );
}

const RouteDefinition = [
  {
    element: <EventProviderLayout />,
    children: [
      {
        element: <Startseite />,
        path: generateAbfrageteilPath(Route.Startseite),
      },
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
        path: generateAbfrageteilPath(Route.WahrscheinlichGeborenesKindAbfrage),
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
        element: <ElternteilAllgemeineAngabenPage />,
        path: generateAbfrageteilPath(Route.ElternteilAllgemeineAngaben),
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
        element: <ElternteilTaetigkeitAngabenMischeinkunftPage />,
        path: generateAbfrageteilPath(
          Route.ElternteilTaetigkeitAngabenMischeinkunft,
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
        path: generateAbfrageteilPath(Route.ElternteilTaetigkeitAngabenMinijob),
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
        path: generateAbfrageteilPath(Route.ElternteilWeitereTaetigkeitAbfrage),
      },
      {
        element: <ElternteilWeitereTaetigkeitAngabenPage />,
        path: generateAbfrageteilPath(Route.ElternteilWeitereTaetigkeitAngaben),
      },
      {
        element: <ElternteilZweitePersonAngabenPage />,
        path: generateAbfrageteilPath(Route.ElternteilZweitePersonAngaben),
      },
      {
        element: <BeispielePage />,
        path: "/beispiele",
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
