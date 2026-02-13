import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { isEventStream } from "./EventStream";
import {
  filtereValidenEventPfad as filtereValidenEventPfadInEventStream,
  findeLetztesGueltigesEvent as findeLetztesGueltigesEventInEventStream,
  findeVorherigeRoute as findeVorherigeRouteInEventStream,
} from "./projections";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  FormRoutes,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;

  readonly filtereValidenEventPfad: () => FormEvent[];

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

  const filtereValidenEventPfad = useCallback(() => {
    if (isEventStream(eventStream)) {
      return filtereValidenEventPfadInEventStream(eventStream);
    } else {
      return [];
    }
  }, [eventStream]);

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
      filtereValidenEventPfad,
      findeVorherigeRoute,
      findeLetztesGueltigesEvent,
    };
  }, [
    dispatch,
    filtereValidenEventPfad,
    findeVorherigeRoute,
    findeLetztesGueltigesEvent,
  ]);

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
