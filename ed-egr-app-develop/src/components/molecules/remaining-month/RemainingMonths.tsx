import { VFC } from "react";
import { RemainingMonthByType } from "@egr/monatsplaner-app";
import nsp from "../../../globals/js/namespace";
import classNames from "classnames";
import { LabelCounter, VisualCounter } from "../../atoms";
import { YesNo } from "../../../globals/js/calculations/model";

interface Props {
  remainingMonthByType: RemainingMonthByType;
  className?: string;
  alleinerziehend: YesNo | null;
}

export const RemainingMonths: VFC<Props> = ({
  remainingMonthByType,
  className,
  alleinerziehend,
}) => {
  const countBasis = Math.max(0, remainingMonthByType.basiselterngeld);
  const countPlus = Math.max(0, remainingMonthByType.elterngeldplus);
  const countBonus = Math.max(0, remainingMonthByType.partnerschaftsbonus);

  const maxCountBasis = 14;
  const maxCountPlus = 28;
  const maxCountBonus = 4;

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
        {alleinerziehend !== YesNo.YES && (
          <div className={nsp("remaining-months__partnerschaftsbonus")}>
            <LabelCounter
              label="Bonus"
              count={countBonus}
              maxCount={maxCountBonus}
            ></LabelCounter>
          </div>
        )}
      </div>
      <div className={nsp("remaining-months__visual")}>
        <VisualCounter
          countBasis={countBasis}
          maxCountBasis={maxCountBasis}
          countPlus={countPlus}
          maxCountPlus={maxCountPlus}
          countBonus={countBonus}
          maxCountBonus={maxCountBonus}
          alleinerziehend={alleinerziehend}
        ></VisualCounter>
      </div>
    </section>
  );
};
