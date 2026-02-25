import { Temporal } from "@js-temporal/polyfill";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  filtereValideEventHistorie as filtereValideEventHistorieInEventStream,
  findeAlleGueltigenEvents as findeAlleGueltigenEventsInEventStream,
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

const isDev = import.meta.env.DEV;

export function EventProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [eventStream, dispatchAction] = useReducer(
    (state: FormEvent[], action: FormEvent) => {
      const newState = [...state, action];

      if (isDev) {
        sessionStorage.setItem("EGR_SESSION_STORAGE", JSON.stringify(newState));
      }

      return newState;
    },
    [],
    isDev ? getInitialState : () => [],
  );

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
      findeLetztesGueltigesEvent,
      findeVorherigenPfad,
    };
  }, [
    dispatch,
    filtereValideEventHistorie,
    findeAlleGueltigenEvents,
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

const getInitialState = (): FormEvent[] => {
  const saved = sessionStorage.getItem("EGR_SESSION_STORAGE");
  if (!saved) return [];

  try {
    const rawData: unknown = JSON.parse(saved, (_key, value): unknown => {
      if (typeof value === "string") {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const yearMonthRegex = /^\d{4}-\d{2}$/;

        if (dateRegex.test(value)) {
          return Temporal.PlainDate.from(value);
        }
        if (yearMonthRegex.test(value)) {
          return Temporal.PlainYearMonth.from(value);
        }
      }
      return value;
    });

    // TODO: Create FormEventSchema to validate with zod here
    // const result = z.array(FormEventSchema).safeParse(rawData);

    // if (result.success) {
    //   return result.data;
    // }

    return rawData as FormEvent[];
  } catch {
    return [];
  }
};
