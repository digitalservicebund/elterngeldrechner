import { RouterProvider, createHashRouter } from "react-router-dom";
import routeDefinition from "@/routing/RouteDefinition";

export default function Router() {
  const router = createHashRouter(routeDefinition);

  return <RouterProvider router={router} />;
}
