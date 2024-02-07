import { VFC } from "react";
import { RemainingMonthByType } from "../../../monatsplaner";
import nsp from "../../../globals/js/namespace";
import classNames from "classnames";
import { LabelCounter, VisualCounter } from "../../atoms";

interface Props {
  remainingMonthByType: RemainingMonthByType;
  className?: string;
  partnerMonate?: boolean;
}

export const RemainingMonths: VFC<Props> = ({
  remainingMonthByType,
  className,
  partnerMonate = true,
}) => {
  const maxCountBasis = partnerMonate ? 14 : 12;
  const maxCountPlus = partnerMonate ? 28 : 24;
  const maxCountBonus = 4;

  const countBasis = Math.max(0, remainingMonthByType.basiselterngeld);
  const countPlus = Math.max(0, remainingMonthByType.elterngeldplus);
  const countBonus = Math.max(0, remainingMonthByType.partnerschaftsbonus);

  return (
    <section className={classNames(nsp("remaining-months"), className)}>
      <div className={nsp("remaining-months__label")}>
        <div className={nsp("remaining-months__basiselterngeld")}>
          <LabelCounter
            label="Basis"
            count={countBasis}
            maxCount={maxCountBasis}
          ></LabelCounter>
        </div>
        <div className={nsp("remaining-months__elterngeldplus")}>
          <LabelCounter
            label="Plus"
            count={countPlus}
            maxCount={maxCountPlus}
          ></LabelCounter>
        </div>
        <div className={nsp("remaining-months__partnerschaftsbonus")}>
          <LabelCounter
            label="Bonus"
            count={countBonus}
            maxCount={maxCountBonus}
          ></LabelCounter>
        </div>
      </div>
      <div className={nsp("remaining-months__visual")}>
        <VisualCounter
          countBasis={countBasis}
          maxCountBasis={maxCountBasis}
          countPlus={countPlus}
          maxCountPlus={maxCountPlus}
          countBonus={countBonus}
          maxCountBonus={maxCountBonus}
        ></VisualCounter>
      </div>
    </section>
  );
};
