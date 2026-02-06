import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { findLastEvent as findLastInEventStream } from "./projections/findLastEvent";
import type {
  FormEvent,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing/routing";

type EventContextType = {
  readonly eventStream: FormEvent[];
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
  const [eventStream, dispatchAction] = useReducer(abfrageteilReducer, []);

  const dispatch = useCallback((event: FormEvent) => {
    dispatchAction(event);
  }, []);

  const findLastEvent = useCallback(
    <R extends FormEvent["route"]>(route: R) => {
      return findLastInEventStream(eventStream, route);
    },
    [eventStream],
  );

  const value = useMemo(() => {
    return {
      eventStream,
      dispatch,
      findLastEvent,
    };
  }, [eventStream, dispatch, findLastEvent]);

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
