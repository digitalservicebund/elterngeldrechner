import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { findLastEvent as findLastInEventLog } from "./projections/findLastEvent";
import type {
  FormEvent,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing";

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
