import classNames from "classnames";
import { ReactNode } from "react";
import nsp from "@/globals/js/namespace";

interface Props {
  readonly size?: "normal" | "large";
  readonly bold?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
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
