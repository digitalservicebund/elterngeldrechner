import { render, renderHook } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import routeDefinition from "@/application/routing/RouteDefinition";
import * as planerhooks from "@/application/features/planungsteil/planer/hooks";
import {
  EventProvider,
  useEventContext,
} from "@/application/features/abfrageteil/events/EventContext";
import { erstelleAusgangslage } from "@/application/features/abfrageteil/domain/erstelleAusgangslage";

function useRender() {
  const router = createMemoryRouter(routeDefinition, {
    initialEntries: ["/abfrageteil/startseite"],
  });

  return render.bind(null, <RouterProvider router={router} />);
}

function useBerechneElterngeldbezuege() {
  const { result } = renderHook(planerhooks.useBerechneElterngeldbezuege, {
    wrapper: EventProvider,
  });

  return result.current;
}

function useEventHistorie() {
  const { result } = renderHook(useEventContext, {
    wrapper: EventProvider,
  });

  return result.current.filtereValideEventHistorie();
}

function useErstelleAusgangslage() {
  const { result } = renderHook(useEventContext, {
    wrapper: EventProvider,
  });

  const { filtereValideEventHistorie } = result.current;

  return () => erstelleAusgangslage(filtereValideEventHistorie());
}

export {
  useRender,
  useBerechneElterngeldbezuege,
  useErstelleAusgangslage,
  useEventHistorie,
};
