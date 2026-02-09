import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { isEventStream } from "./EventStream";
import {
  findLastEvent as findLastInEventStream,
  findLastRoute as findLastRouteInEventStream,
} from "./projections";
import {
  FormEvent,
  FormRoutes,
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
      if (isEventStream(eventStream)) {
        return findLastInEventStream(eventStream, route);
      } else {
        return undefined;
      }
    },
    [eventStream],
  );

  const findLastRoute = useCallback(
    (route: FormRoutes) => {
      if (isEventStream(eventStream)) {
        return findLastRouteInEventStream(eventStream, route);
      } else {
        return Route.Startseite;
      }
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
