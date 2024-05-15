import { FC, ReactNode } from "react";
import nsp from "@/globals/js/namespace";

export const Split: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={nsp("split")}>{children}</div>;
};
