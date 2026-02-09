import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { isEventStream } from "./EventStream";
import {
  findeLetztesGueltigesEvent as findeLetztesGueltigesEventInEventStream,
  findeVorherigeRoute as findeVorherigeRouteInEventStream,
} from "./projections";
import {
  FormEvent,
  FormRoutes,
  PayloadMap,
  Route,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;

  readonly findeLetztesGueltigesEvent: <R extends FormEvent["route"]>(
    route: R,
  ) => PayloadMap[R] | undefined;

  readonly findeVorherigeRoute: (
    route: Exclude<Route, Route.Startseite>,
  ) => Route;
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

  const findeLetztesGueltigesEvent = useCallback(
    <R extends FormEvent["route"]>(route: R) => {
      if (isEventStream(eventStream)) {
        return findeLetztesGueltigesEventInEventStream(eventStream, route);
      } else {
        return undefined;
      }
    },
    [eventStream],
  );

  const findeVorherigeRoute = useCallback(
    (route: FormRoutes) => {
      if (isEventStream(eventStream)) {
        return findeVorherigeRouteInEventStream(eventStream, route);
      } else {
        return Route.Startseite;
      }
    },
    [eventStream],
  );

  const value = useMemo(() => {
    return {
      dispatch,
      findeVorherigeRoute,
      findeLetztesGueltigesEvent,
    };
  }, [dispatch, findeVorherigeRoute, findeLetztesGueltigesEvent]);

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
