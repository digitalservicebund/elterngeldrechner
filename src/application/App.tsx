import "@/application/styles/index.css";

import { isAbfrageteilNextEnabled } from "./feature-flags";

import Router from "@/application/routing/Router";
import RouterNext from "@/application/routing-next/Router";

export function App() {
  if (isAbfrageteilNextEnabled()) {
    return <RouterNext />;
  } else {
    return <Router />;
  }
}
