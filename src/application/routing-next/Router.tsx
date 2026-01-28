import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import { AllgemeineAngaben } from "@/application/features/abfrageteil-next/allgemein-angaben/AllgemeineAngaben.page";
import { GeborenesKind } from "@/application/features/abfrageteil-next/kind/GeborenesKind.page";
import { Kind } from "@/application/features/abfrageteil-next/kind/Kind.page";
import { Startseite } from "@/application/features/abfrageteil-next/startseite/Startseite.page";

export default function Router() {
  // The hash router does not support the `hashType` property
  // at this point in time. This means that the routes look
  // like this: http://localhost:3000/#/nachwuchs and also
  // that jQuery throws the following error on initial page
  // load. The root of this issue is that jQuery tries to
  // navigate to the hash part of the window.location but
  // fails to do so because of the leading slash.
  //
  // Source: commons-*.js
  // Error: Uncaught Error: Syntax error, unrecognized expression
  //
  // https://github.com/remix-run/react-router/pull/11310
  // https://v5.reactrouter.com/web/api/HashRouter/hashtype-string

  const router = createHashRouter([
    {
      element: <Startseite />,
      path: "/abfrageteil-v2/startseite",
    },
    {
      element: <AllgemeineAngaben />,
      path: "/abfrageteil-v2/allgemeine-angaben",
    },
    { element: <Kind />, path: "/abfrageteil-v2/kind" },
    { element: <GeborenesKind />, path: "/abfrageteil-v2/kind/geboren" },
    {
      element: <Navigate to="/abfrageteil-v2/startseite" replace />,
      path: "*",
    },
  ]);
  return <RouterProvider router={router} />;
}
