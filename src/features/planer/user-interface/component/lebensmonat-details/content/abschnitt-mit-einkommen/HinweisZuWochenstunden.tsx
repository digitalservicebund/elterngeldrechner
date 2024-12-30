import type { CSSProperties, ReactNode } from "react";

type Props = {
  readonly id?: string;
  readonly style?: CSSProperties;
};

export function HinweisZuWochenstunden({ id, style }: Props): ReactNode {
  return (
    <p id={id} style={style}>
      *Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche arbeiten
    </p>
  );
}
