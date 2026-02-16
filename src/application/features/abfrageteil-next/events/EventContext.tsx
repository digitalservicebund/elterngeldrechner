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
  findeVorherigenPfad as findeVorherigenPfadInEventStream,
} from "./projections";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  FormRoutes,
  PayloadMap,
  generateAbfrageteilPath,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;

  readonly filtereValidenEventPfad: () => FormEvent[];

  readonly findeLetztesGueltigesEvent: <R extends FormEvent["route"]>(
    route: R,
  ) => PayloadMap[R] | undefined;

  readonly findeVorherigenPfad: (
    route: Exclude<Route, Route.Startseite>,
  ) => string;
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

  const findeVorherigenPfad = useCallback(
    (route: FormRoutes) => {
      if (isEventStream(eventStream)) {
        return findeVorherigenPfadInEventStream(eventStream, route);
      } else {
        return generateAbfrageteilPath(Route.Startseite);
      }
    },
    [eventStream],
  );

  const value = useMemo(() => {
    return {
      dispatch,
      filtereValidenEventPfad,
      findeVorherigenPfad,
      findeLetztesGueltigesEvent,
    };
  }, [
    dispatch,
    filtereValidenEventPfad,
    findeVorherigenPfad,
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
