import classNames from "classnames";
import type { ReactNode } from "react";

type Props = {
  readonly hasMultipleElternteile?: boolean;
  readonly className?: string;
};

export function HinweisZumBonus({
  hasMultipleElternteile,
  className,
}: Props): ReactNode {
  return (
    <p className={classNames("bg-white p-8 text-justify", className)}>
      {!!hasMultipleElternteile && (
        <>
          Wenn Sie den Partnerschaftsbonus auswählen, wird er auch automatisch
          für das andere Elternteil ausgewählt. Partnerschaftsbonus kann immer
          nur parallel genommen werden.
          <br />
        </>
      )}
      Sie müssen mindestens 2 Partnerschaftsbonus-Monate beantragen – deshalb
      wurde automatisch auch der folgende Monat ausgewählt.
    </p>
  );
}
