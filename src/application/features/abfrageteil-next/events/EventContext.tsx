import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { isEventStream } from "./EventStream";
import {
  filtereValideEventHistorie as filtereValideEventHistorieInEventStream,
  findeLetztesGueltigesEvent as findeLetztesGueltigesEventInEventStream,
  findeVorherigenPfad as findeVorherigenPfadInEventStream,
} from "./projections";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  ParamsMap,
  PayloadMap,
  generateAbfrageteilPath,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly dispatch: (event: FormEvent) => void;

  readonly filtereValideEventHistorie: () => FormEvent[];

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

  const filtereValideEventHistorie = useCallback(() => {
    if (isEventStream(eventStream)) {
      return filtereValideEventHistorieInEventStream(eventStream);
    } else {
      return [];
    }
  }, [eventStream]);

  const findeLetztesGueltigesEvent = useCallback(
    <R extends FormEvent["route"]>(
      route: R,
      ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
    ) => {
      if (isEventStream(eventStream)) {
        return findeLetztesGueltigesEventInEventStream(
          eventStream,
          route,
          ...args,
        );
      } else {
        return undefined;
      }
    },
    [eventStream],
  );

  const findeVorherigenPfad = useCallback(
    <R extends FormEvent["route"]>(
      route: R,
      ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
    ) => {
      if (isEventStream(eventStream)) {
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
      findeVorherigenPfad,
      findeLetztesGueltigesEvent,
    };
  }, [
    dispatch,
    filtereValideEventHistorie,
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
