import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { persistEventstream, restoreEventstream } from "./persistence";
import {
  filtereValideEventHistorie as filtereValideEventHistorieInEventStream,
  findeAlleGueltigenEvents as findeAlleGueltigenEventsInEventStream,
  findeLetztesEvent as findeLetztesEventInEventStream,
  findeLetztesGueltigesEvent as findeLetztesGueltigesEventInEventStream,
  findeVorherigenPfad as findeVorherigenPfadInEventStream,
} from "./projections";
import {
  type FormEvent,
  type ParamsMap,
  type PayloadMap,
  Route,
  generateAbfrageteilPath,
} from "@/application/features/abfrageteil-next/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;

  readonly filtereValideEventHistorie: () => FormEvent[];

  readonly findeLetztesEvent: () => FormEvent | undefined;

  readonly findeAlleGueltigenEvents: <R extends FormEvent["route"]>(
    route: R,
  ) => PayloadMap[R][];

  readonly findeLetztesGueltigesEvent: <R extends FormEvent["route"]>(
    route: R,
    ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
  ) => PayloadMap[R] | undefined;

  readonly findeVorherigenPfad: <R extends FormEvent["route"]>(
    route: R,
    ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
  ) => string;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const isDevelopmentEnviornment = import.meta.env.DEV;

export function EventProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [eventStream, dispatchAction] = useReducer(
    (state: FormEvent[], action: FormEvent) => [...state, action],
    undefined,
    () => (isDevelopmentEnviornment ? restoreEventstream() : []),
  );

  useEffect(() => {
    if (isDevelopmentEnviornment) persistEventstream(eventStream);
  }, [eventStream]);

  const dispatch = useCallback((event: FormEvent) => {
    dispatchAction(event);
  }, []);

  const filtereValideEventHistorie = useCallback(() => {
    return filtereValideEventHistorieInEventStream(eventStream);
  }, [eventStream]);

  const findeAlleGueltigenEvents = useCallback(
    <R extends FormEvent["route"]>(route: R) => {
      return findeAlleGueltigenEventsInEventStream(eventStream, route);
    },
    [eventStream],
  ) as EventContextType["findeAlleGueltigenEvents"];

  const findeLetztesGueltigesEvent = useCallback(
    <R extends FormEvent["route"]>(
      route: R,
      ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
    ) => {
      return findeLetztesGueltigesEventInEventStream(
        eventStream,
        route,
        ...args,
      );
    },
    [eventStream],
  );

  const findeLetztesEvent = useCallback(() => {
    return findeLetztesEventInEventStream(eventStream);
  }, [eventStream]);

  const findeVorherigenPfad = useCallback(
    <R extends FormEvent["route"]>(
      route: R,
      ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
    ) => {
      const isStreamWithElements = (
        formEvents: FormEvent[],
      ): formEvents is [FormEvent, ...FormEvent[]] => {
        return formEvents.length > 0;
      };

      if (isStreamWithElements(eventStream)) {
        return findeVorherigenPfadInEventStream(eventStream, route, ...args);
      } else {
        return generateAbfrageteilPath(Route.Startseite);
      }
    },
    [eventStream],
  );

  const value = useMemo(() => {
    return {
      dispatch,
      filtereValideEventHistorie,
      findeAlleGueltigenEvents,
      findeLetztesEvent,
      findeLetztesGueltigesEvent,
      findeVorherigenPfad,
    };
  }, [
    dispatch,
    filtereValideEventHistorie,
    findeAlleGueltigenEvents,
    findeLetztesEvent,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
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
