import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import type { FormEvent, PayloadMap } from "./routing";

type EventContextType = {
  readonly eventLog: FormEvent[];
  readonly dispatch: (event: FormEvent) => void;
  readonly findLastEvent: <R extends FormEvent["route"]>(
    route: R,
  ) => PayloadMap[R] | undefined;
};

const abfrageteilReducer = (
  state: FormEvent[],
  action: FormEvent,
): FormEvent[] => {
  return [...state, action];
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [eventLog, dispatchAction] = useReducer(abfrageteilReducer, []);

  const dispatch = useCallback((event: FormEvent) => {
    dispatchAction(event);
  }, []);

  const findLastEvent = useCallback(
    <R extends FormEvent["route"]>(route: R) => {
      return findLastInEventLog(eventLog, route);
    },
    [eventLog],
  );

  const value = useMemo(() => {
    return {
      eventLog,
      dispatch,
      findLastEvent,
    };
  }, [eventLog, dispatch, findLastEvent]);

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

function findLastInEventLog<R extends FormEvent["route"]>(
  eventLog: FormEvent[],
  route: R,
): PayloadMap[R] | undefined {
  return eventLog.findLast((event) => event.route === route)?.payload as
    | PayloadMap[R]
    | undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findLastInEventLog", async () => {
    const { Route } = await import("./routing");

    it("it returns the last object matching the route", () => {
      const result = findLastInEventLog(
        [
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: true,
            },
          },
        ],
        Route.AllgemeineAngaben,
      );

      expect(result).toEqual({
        bundesland: "Berlin",
        gesamteinkommenGrenzeUeberschritten: true,
      });
    });

    it("it returns undefined if no object matches the route", () => {
      const result = findLastInEventLog([], Route.AllgemeineAngaben);

      expect(result).toBeUndefined();
    });
  });
}
