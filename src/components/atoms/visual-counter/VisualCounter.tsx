import { VFC } from "react";
import nsp from "../../../globals/js/namespace";

interface VisualCounterProps {
  countBasis: number;
  maxCountBasis: number;
  countPlus: number;
  maxCountPlus: number;
  countBonus: number;
  maxCountBonus: number;
}

export const VisualCounter: VFC<VisualCounterProps> = ({
  countBasis,
  maxCountBasis,
  countPlus,
  maxCountPlus,
  countBonus,
  maxCountBonus,
}) => {
  const arrayOf = (maxCount: number): Array<number> => {
    const numbers = [];
    for (let i = 1; i <= maxCount; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  const classNameOf = (classNamePart: string, index: number, count: number) => {
    let className = `visual-counter__${classNamePart}block`;
    if (index > count) {
      className += "--used";
    }
    return nsp(className);
  };

  const bonusAvailable = maxCountBonus !== 0;

  return (
    <div className={nsp("visual-counter")}>
      <div className={nsp("visual-counter__basisplus")}>
        <div className={nsp("visual-counter__basis")}>
          {arrayOf(maxCountBasis).map((index) => (
            <div
              key={index}
              className={classNameOf("basis", index, countBasis)}
            ></div>
          ))}
        </div>
        <div className={nsp("visual-counter__plus")}>
          {arrayOf(maxCountPlus).map((index) => (
            <div
              key={index}
              className={classNameOf("plus", index, countPlus)}
            ></div>
          ))}
        </div>
      </div>
      {bonusAvailable && (
        <div className={nsp("visual-counter__bonus")}>
          {arrayOf(maxCountBonus).map((index) => (
            <div
              key={index}
              className={classNameOf("bonus", index, countBonus)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};
