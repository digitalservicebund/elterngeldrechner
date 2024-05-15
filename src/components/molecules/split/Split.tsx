import { FC } from "react";
import nsp from "@/globals/js/namespace";

export const Split: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={nsp("split")}>{children}</div>;
};
