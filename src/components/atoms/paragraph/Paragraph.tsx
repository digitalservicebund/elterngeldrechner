import classNames from "classnames";
import { ReactNode } from "react";
import nsp from "@/globals/js/namespace";

interface Props {
  size?: "normal" | "large";
  bold?: boolean;
  className?: string;
  children: ReactNode;
}

export function P({ size = "normal", bold, className, children }: Props) {
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
}
