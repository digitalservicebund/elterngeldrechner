import { RouterProvider, createHashRouter } from "react-router-dom";
import routeDefinition from "@/routing/RouteDefinition";

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

  const router = createHashRouter(routeDefinition);

  return <RouterProvider router={router} />;
}
