import type { CSSProperties, ReactNode } from "react";

type Props = {
  readonly style?: CSSProperties;
};

export function HinweisZuWochenstunden({ style }: Props): ReactNode {
  return (
    <p style={style}>
      *Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche arbeiten
    </p>
  );
}
