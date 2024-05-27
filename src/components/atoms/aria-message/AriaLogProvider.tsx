import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import nsp from "@/globals/js/namespace";
import { P } from "@/components/atoms/paragraph";

type RemoveMessageFn = () => void;

interface IAriaLogContext {
  addMessage: (message: string) => RemoveMessageFn;
}

const AriaLogContext = createContext<IAriaLogContext | undefined>(undefined);

type Props = {
  readonly children?: ReactNode;
};

/**
 * Provides access to the ARIA-logs. By adding a message to the log the message can be read by a screen reader.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role
 */
export function AriaLogProvider({ children }: Props) {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback((message: string) => {
    setMessages((existing) => [message, ...existing]);

    return () =>
      setMessages((existing) =>
        existing.filter((otherMessage) => otherMessage !== message),
      );
  }, []);

  const context = useMemo(() => ({ addMessage }), [addMessage]);

  return (
    <AriaLogContext.Provider value={context}>
      <div role="log" className={nsp("aria-log")}>
        {messages.map((message) => (
          <P key={message}>{message}</P>
        ))}
      </div>

      {children}
    </AriaLogContext.Provider>
  );
}

export const useAriaLog = () => {
  const context = useContext(AriaLogContext);

  if (!context) {
    throw new Error("Missing context for 'useAriaLog' hook.");
  }

  return context;
};
