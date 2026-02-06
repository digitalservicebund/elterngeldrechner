import { Outlet } from "react-router";
import { isAbfrageteilNextEnabled } from "@/application/feature-flags";
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

const routes = [
  {
    element: <EventProviderLayout />,
    children: [
      {
        element: <Startseite />,
        path: "/abfrageteil-next/startseite",
      },
      {
        element: <AllgemeineAngabenPage />,
        path: "/abfrageteil-next/allgemeine-angaben",
      },
      { element: <KindPage />, path: "/abfrageteil-next/kind" },
      {
        element: <GeborenesKindPage />,
        path: "/abfrageteil-next/kind/geboren",
      },
    ],
  },
];

export const routeDefinition = isAbfrageteilNextEnabled() ? routes : [];
