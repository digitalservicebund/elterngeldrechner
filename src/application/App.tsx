import "@/application/styles/index.css";
import { isAbfrageteilNextEnabled } from "./feature-flags";
import { EventProvider } from "./routing-next/EventContext";
import Router from "@/application/routing/Router";
import RouterNext from "@/application/routing-next/Router";

export function App() {
  if (isAbfrageteilNextEnabled()) {
    return (
      <EventProvider>
        <RouterNext />
      </EventProvider>
    );
  } else {
    return <Router />;
  }
}
