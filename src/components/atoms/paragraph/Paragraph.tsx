import classNames from "classnames";
import { FC, ReactNode } from "react";
import nsp from "@/globals/js/namespace";

interface Props {
  size?: "normal" | "large";
  bold?: boolean;
  className?: string;
  children: ReactNode;
}

export const P: FC<Props> = ({
  size = "normal",
  bold,
  className,
  children,
}) => {
  return (
    <p
      className={classNames(
        nsp("paragraph"),
        size === "large" && nsp("paragraph--large"),
        bold && nsp("paragraph--bold"),
        className,
      )}
    >
      {children}
    </p>
  );
};
