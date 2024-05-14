import classNames from "classnames";
import { ReactNode } from "react";
import { ContingentPerVariant } from "./types";

type Props = {
  months: ContingentPerVariant;
  className?: string;
};

export function BoxGraph({ months, className }: Props): ReactNode {
  const { basis, plus, bonus } = months;

  return (
    <div aria-hidden className={classNames("grid min-h-24 gap-4", className)}>
      {repeatBox(basis.available, "col-span-2 bg-Basis", "basis-available")}
      {repeatBox(basis.taken, "col-span-2 bg-grey", "basis-taken")}

      {repeatBox(plus.available, "row-start-2 bg-Plus", "plus-available")}
      {repeatBox(plus.taken, "row-start-2 bg-grey", "plus-taken")}

      {repeatBox(
        bonus.available,
        "row-start-1 row-span-2 bg-Bonus",
        "bonus-available",
      )}
      {repeatBox(bonus.taken, "row-start-1 row-span-2 bg-grey", "bonus-taken")}
    </div>
  );
}

function repeatBox(
  times: number,
  className: string,
  testId: string,
): ReactNode[] {
  return [...Array(times)].map((_, index) => (
    <div
      key={index}
      className={classNames("rounded-2", className)}
      data-testid={testId}
    />
  ));
}
