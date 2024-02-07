import { useEffect, VFC } from "react";
import { useAriaLog } from "./AriaLogProvider";

interface AriaMessageProps {
  children: string;
}

export const AriaMessage: VFC<AriaMessageProps> = ({ children: message }) => {
  const { addMessage } = useAriaLog();

  useEffect(() => addMessage(message), [addMessage, message]);

  return null;
};
