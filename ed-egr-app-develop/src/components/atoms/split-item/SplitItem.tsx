import nsp from "../../../globals/js/namespace";
import { FC } from "react";
import classNames from "classnames";

interface Props {
  hasDivider?: boolean;
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
