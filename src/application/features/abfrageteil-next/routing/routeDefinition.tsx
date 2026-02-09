import { Navigate, Outlet } from "react-router";
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
        path: "/startseite",
      },
      {
        element: <AllgemeineAngabenPage />,
        path: "/allgemeine-angaben",
      },
      { element: <KindPage />, path: "/kind" },
      {
        element: <GeborenesKindPage />,
        path: "/kind/geboren",
      },
      {
        element: <Navigate to="/startseite" replace />,
        path: "*",
      },
    ],
  },
];
