import { VFC } from "react";
import nsp from "@/globals/js/namespace";

interface LabelCounterProps {
  label: string;
  count: number;
  maxCount: number;
}

export const LabelCounter: VFC<LabelCounterProps> = ({
  label,
  count,
  maxCount,
}) => {
  return (
    <div className={nsp("label-counter")}>
      <p className={nsp("label-counter__label")}>{label}</p>
      <p>
        {count}/{maxCount}
      </p>
    </div>
  );
};
