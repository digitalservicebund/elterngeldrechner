import { Fragment, ReactNode, useEffect, VFC } from "react";
import ReactDOM from "react-dom";
import nsp from "@/globals/js/namespace";
import "./toast.scss";

interface ToastProps {
  messages: ReactNode[] | null;
  active: boolean;
  onUnMount: () => void;
  timeout: number;
}

const ToastContent: VFC<Pick<ToastProps, "messages" | "active">> = ({
  messages,
  active,
}) => {
  return (
    <div className={`${nsp("toast")} ${active ? nsp("toast--active") : ""}`}>
      {messages !== null &&
        messages.map((message, index) => (
          <Fragment key={index}>{message}</Fragment>
        ))}
    </div>
  );
};

export const Toast: VFC<ToastProps> = ({
  messages,
  active,
  onUnMount,
  timeout,
}) => {
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (messages !== null && messages.length > 0) {
      timerId = setTimeout(() => {
        onUnMount();
      }, timeout);
    }
    return () => clearTimeout(timerId);
  }, [messages, onUnMount, timeout]);

  return ReactDOM.createPortal(
    <ToastContent messages={messages} active={active} />,
    document.getElementById("egr-toast") as HTMLElement,
  );
};
