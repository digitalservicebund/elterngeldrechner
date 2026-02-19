import { Navigate, Outlet, useLocation } from "react-router";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { AllgemeineAngabenPage } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngabenPage";
import { ElternteilAllgemeineAngabenPage } from "@/application/features/abfrageteil-next/elternteil/ElternteilAllgemeineAngabenPage";
import { ElternteilAusklammerungGruendePage } from "@/application/features/abfrageteil-next/elternteil/ElternteilAusklammerungGruendePage";
import { ElternteilAusklammerungZeitenPage } from "@/application/features/abfrageteil-next/elternteil/ElternteilAusklammerungZeitenPage";
import { ElternteilTaetigkeitenAbfragePage } from "@/application/features/abfrageteil-next/elternteil/ElternteilTaetigkeitenAbfragePage";
import { EventProvider } from "@/application/features/abfrageteil-next/events/EventContext";
import { GeschwisterkindAbfragePage } from "@/application/features/abfrageteil-next/geschwister/GeschwisterkindAbfragePage";
import { GeschwisterkindAngabenPage } from "@/application/features/abfrageteil-next/geschwister/GeschwisterkindAngabenPage";
import { GeborenesKindPage } from "@/application/features/abfrageteil-next/kind/GeborenesKindPage";
import { KindPage } from "@/application/features/abfrageteil-next/kind/KindPage";
import { UngeborenesKindPage } from "@/application/features/abfrageteil-next/kind/UngeborenesKindPage";
import { WahrscheinlichGeborenesKindPage } from "@/application/features/abfrageteil-next/kind/WahrscheinlichGeborenesKindPage";
import { Startseite } from "@/application/features/abfrageteil-next/startseite/StartseitePage";

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
        element: (
          <Navigate to={generateAbfrageteilPath(Route.Startseite)} replace />
        ),
        path: "*",
      },
    ],
  },
];

export default RouteDefinition;
