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
    <p className={className}>
      {!!hasMultipleElternteile && (
        <>
          Wenn Sie den Partnerschaftsbonus auswählen, wird er auch automatisch
          für den anderen Elternteil ausgewählt. Partnerschaftsbonus kann immer
          nur parallel genommen werden.
          <br />
        </>
      )}
      Sie müssen Partnerschaftbonus für mindestens 2 Lebensmonate beantragen –
      deshalb wurde automatisch auch der folgende Monat ausgewählt. Sie können
      bis zu vier Lebensmonate Partnerschaftsbonus bekommen.
    </p>
  );
}
