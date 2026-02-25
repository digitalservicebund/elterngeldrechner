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
import { ElternteilTaetigkeitAngabenSelbststaendigPage } from "@/application/features/abfrageteil-next/pages/taetigkeit/ElternteilTaetigkeitAngabenSelbststaendigPage";

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
        element: (
          <Navigate to={generateAbfrageteilPath(Route.Startseite)} replace />
        ),
        path: "*",
      },
    ],
  },
];

export default RouteDefinition;
