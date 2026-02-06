import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { isEventStream } from "./EventStream";
import { filtereValidenEventPfad } from "./projections/filtereValidenEventPfad";
import { findLastEvent as findLastInEventStream } from "./projections/findLastEvent";

import {
  FormEvent,
  PayloadMap,
  Route,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;
  readonly findLastEvent: <R extends FormEvent["route"]>(
    route: R,
  ) => PayloadMap[R] | undefined;
  readonly findLastRoute: (route: Exclude<Route, Route.Startseite>) => Route;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [eventStream, dispatchAction] = useReducer(
    (state: FormEvent[], action: FormEvent) => [...state, action],
    [],
  );

  const dispatch = useCallback((event: FormEvent) => {
    dispatchAction(event);
  }, []);

  const findLastEvent = useCallback(
    <R extends FormEvent["route"]>(route: R) => {
      return findLastInEventStream(eventStream, route);
    },
    [eventStream],
  );

  const findLastRoute = useCallback(
    (route: Exclude<Route, Route.Startseite>) => {
      const validerEventPfad = isEventStream(eventStream)
        ? filtereValidenEventPfad(eventStream)
        : [];

      const formRoutes = validerEventPfad.map((event) => event.route);

      const index = formRoutes.findIndex(
        (currentRoute) => currentRoute === route,
      );

      return index === -1 ? formRoutes.at(-1)! : formRoutes[index - 1]!;
    },
    [eventStream],
  );

  const value = useMemo(() => {
    return {
      dispatch,
      findLastEvent,
      findLastRoute,
    };
  }, [dispatch, findLastEvent, findLastRoute]);

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context)
    throw new Error("useEventContext must be used within EventProvider");
  return context;
};
