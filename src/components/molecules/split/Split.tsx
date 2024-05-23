import { ReactNode } from "react";
import nsp from "@/globals/js/namespace";

type Props = {
  children?: ReactNode;
};

export function Split({ children }: Props) {
  return <div className={nsp("split")}>{children}</div>;
}
