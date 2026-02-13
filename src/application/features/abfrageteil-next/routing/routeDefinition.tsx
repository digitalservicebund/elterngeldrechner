import { Navigate, Outlet } from "react-router";
import { Route } from "./routing";
import { AllgemeineAngabenPage } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngabenPage";
import { EventProvider } from "@/application/features/abfrageteil-next/events/EventContext";
import { GeborenesKindPage } from "@/application/features/abfrageteil-next/kind/GeborenesKindPage";
import { KindPage } from "@/application/features/abfrageteil-next/kind/KindPage";
import { Startseite } from "@/application/features/abfrageteil-next/startseite/StartseitePage";

function EventProviderLayout() {
  return (
    <EventProvider>
      <Outlet />
    </EventProvider>
  );
}

export const routeDefinition = [
  {
    element: <EventProviderLayout />,
    children: [
      {
        element: <Startseite />,
        path: `/abfrageteil${Route.Startseite}`,
      },
      {
        element: <AllgemeineAngabenPage />,
        path: `/abfrageteil${Route.AllgemeineAngaben}`,
      },
      { element: <KindPage />, path: `/abfrageteil${Route.KindAbfrage}` },
      {
        element: <GeborenesKindPage />,
        path: `/abfrageteil${Route.GeborenesKindAngaben}`,
      },
      {
        element: <Navigate to="/abfrageteil/startseite" replace />,
        path: "*",
      },
    ],
  },
];
