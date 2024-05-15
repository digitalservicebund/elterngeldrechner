import { FC } from "react";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface Props {
  id?: string;
  error?: boolean;
  children: React.ReactNode;
}

export const Description: FC<Props> = ({ id, error = false, children }) => {
  return (
    <div
      className={classNames(nsp("info-text"), error && nsp("info-text--error"))}
      id={id}
    >
      {children}
    </div>
  );
};
