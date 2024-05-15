import { FC, ReactNode } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  hasDivider?: boolean;
  children: ReactNode;
}

export const SplitItem: FC<Props> = ({ hasDivider, children }) => {
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
};
