import { ReactNode } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  hasDivider?: boolean;
  children: ReactNode;
}

export function SplitItem({ hasDivider, children }: Props) {
  return (
    <div
      className={classNames(
        nsp("split-item"),
        hasDivider && nsp("split-item--has-divider"),
      )}
    >
      {children}
    </div>
  );
}
