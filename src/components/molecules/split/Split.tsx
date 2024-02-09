import nsp from "../../../globals/js/namespace";
import { FC } from "react";

export const Split: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={nsp("split")}>{children}</div>;
};
