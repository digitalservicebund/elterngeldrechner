import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  readonly name: string;
  readonly monthsAvailable: number;
  readonly monthsTaken: number;
  readonly className?: string;
};

export function VariantLabel({
  name,
  monthsAvailable,
  monthsTaken,
  className,
}: Props): ReactNode {
  const monthsTotal = monthsAvailable + monthsTaken;
  const label = `${monthsAvailable} von ${monthsTotal} ${name} Monaten noch verfügbar`;

  return (
    <div aria-label={label} className={classNames("rounded p-8", className)}>
      <span className="font-bold">{name}</span> {monthsAvailable}/{monthsTotal}{" "}
      Monate
    </div>
  );
}
