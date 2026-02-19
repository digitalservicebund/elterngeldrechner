import "@/application/styles/index.css";
import { RouterProvider, createHashRouter } from "react-router";
import { isAbfrageteilNextEnabled } from "./feature-flags";
import routeDefinition from "@/application/features/abfrageteil-next/routing/RouteDefinition";
import legacyRouteDefinition from "@/application/routing/RouteDefinition";

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

const router = createHashRouter(
  isAbfrageteilNextEnabled() ? routeDefinition : legacyRouteDefinition,
);

export function App() {
  return <RouterProvider router={router} />;
}
