import { ReactNode } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  id?: string;
  error?: boolean;
  children: ReactNode;
}

export function Description({ id, error = false, children }: Props) {
  return (
    <div
      className={classNames(nsp("info-text"), error && nsp("info-text--error"))}
      id={id}
    >
      {children}
    </div>
  );
}
