import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routeDefinition from "@/routing/RouteDefinition";

export default function Router() {
  const router = createBrowserRouter(routeDefinition);

  return <RouterProvider router={router} />;
}
