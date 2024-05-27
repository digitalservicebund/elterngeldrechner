import { ReactNode } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  readonly id?: string;
  readonly error?: boolean;
  readonly children: ReactNode;
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
