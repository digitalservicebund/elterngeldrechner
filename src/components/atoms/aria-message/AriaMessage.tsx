import { useEffect } from "react";
import { useAriaLog } from "./AriaLogProvider";

interface AriaMessageProps {
  readonly children: string;
}

export function AriaMessage({ children: message }: AriaMessageProps) {
  const { addMessage, removeMessage } = useAriaLog();

  useEffect(() => {
    addMessage(message);
    return () => removeMessage(message);
  }, [message, addMessage, removeMessage]);

  return null;
}
