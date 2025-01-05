import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly id?: string;
  readonly error?: boolean;
  readonly children: ReactNode;
}

export function Description({ id, error = false, children }: Props) {
  return (
    <div
      className={classNames("egr-info-text", error && "egr-info-text--error")}
      id={id}
    >
      {children}
    </div>
  );
}
