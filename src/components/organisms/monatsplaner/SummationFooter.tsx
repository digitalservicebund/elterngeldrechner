import { ReactNode } from "react";
import { ParentSummation } from "./ParentSummation";
import classNames from "classnames";
import { SummationDataForParent } from "./types";
import { formatAsCurrency } from "../../../utils/locale-formatting";

type Props = {
  className?: string;
  data: SummationDataForParent[];
};

export function SummationFooter({ data, className }: Props): ReactNode {
  const isSingleParent = data.length === 1;
  const formattedSumOfAllAmounts = formatAsCurrency(sumUpAllAmounts(data));

  return (
    <footer
      aria-label="Gesamtsumme"
      className={classNames(
        className,
        "flex flex-wrap justify-evenly gap-24 text-center",
      )}
    >
      {data.map((entry) => (
        <div key={entry.name} className="flex basis-320 flex-col items-center">
          <ParentSummation
            {...entry}
            name={isSingleParent ? undefined : entry.name}
            hideSum={isSingleParent}
          />
        </div>
      ))}

      <strong className="basis-full">
        Gesamtsumme der Planung: {formattedSumOfAllAmounts}
      </strong>

      <span className="basis-full text-14">
        Hinweis: Mutterschutz wird nicht in der Summe berücksichtigt
      </span>
    </footer>
  );
}

function sumUpAllAmounts(data: SummationDataForParent[]): number {
  return data.reduce(
    (sum, { totalPayoutAmount, totalIncomeAmount }) =>
      sum + totalPayoutAmount + totalIncomeAmount,
    0,
  );
}
