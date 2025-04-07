import type { CSSProperties, ReactNode } from "react";

type Props = {
  readonly hasMultipleElternteile?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export function HinweisZumBonus({
  hasMultipleElternteile,
  className,
  style,
}: Props): ReactNode {
  return (
    <p className={className} style={style}>
      {!!hasMultipleElternteile && (
        <>
          Wenn Sie den Partnerschaftsbonus auswählen, wird er auch automatisch
          für den anderen Elternteil ausgewählt. Der Partnerschaftsbonus kann
          immer nur parallel genommen werden.
          <br />
        </>
      )}
      Sie erhalten den Partnerschaftsbonus, wenn sie mindestens 24 und höchstens
      32 Stunden pro Woche arbeiten.
      <br />
      Sie müssen den Partnerschaftbonus für mindestens 2 Lebensmonate beantragen
      – deshalb wurde automatisch auch der folgende Monat ausgewählt. Sie können
      bis zu vier Lebensmonate Partnerschaftsbonus bekommen.
    </p>
  );
}
