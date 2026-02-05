import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { FormEvent } from "./Router";

type EventContextType = {
  readonly eventLog: FormEvent[];
  readonly dispatch: (event: FormEvent) => void;
};

const abfrageteilReducer = (
  state: FormEvent[],
  action: { type: "DISPATCH_EVENT"; event: FormEvent },
): FormEvent[] => {
  switch (action.type) {
    case "DISPATCH_EVENT":
      return [...state, action.event];
    default:
      return state;
  }
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [eventLog, dispatchAction] = useReducer(abfrageteilReducer, []);

  const dispatch = useCallback((event: FormEvent) => {
    dispatchAction({ type: "DISPATCH_EVENT", event });
  }, []);

  const value = useMemo(
    () => ({
      eventLog,
      dispatch,
    }),
    [eventLog, dispatch],
  );

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
