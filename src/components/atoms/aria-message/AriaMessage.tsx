import { useEffect } from "react";
import { useAriaLog } from "./AriaLogProvider";

interface AriaMessageProps {
  children: string;
}

export function AriaMessage({ children: message }: AriaMessageProps) {
  const { addMessage } = useAriaLog();

  useEffect(() => addMessage(message), [addMessage, message]);

  return null;
}
