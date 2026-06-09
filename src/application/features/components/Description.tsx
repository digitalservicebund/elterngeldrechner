import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  readonly id?: string;
  readonly error?: boolean;
  readonly children: ReactNode;
};

export function Description({ id, error = false, children }: Props) {
  return (
    <div className={classNames("mt-8 text-14", error && "text-danger")} id={id}>
      {children}
    </div>
  );
}
