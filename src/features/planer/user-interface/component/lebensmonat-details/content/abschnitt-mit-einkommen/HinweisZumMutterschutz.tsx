import type { CSSProperties, ReactNode } from "react";

type Props = {
  readonly style?: CSSProperties;
};

export function HinweisZumMutterschutz({ style }: Props): ReactNode {
  return (
    <p className="text-balance" style={style}>
      Nach der Geburt haben Mütter in der Regel Anspruch auf acht Wochen
      Mutterschutz. Während dieser Zeit dürfen sie nicht arbeiten. Sie können in
      dieser Zeit kein Einkommen angeben.
    </p>
  );
}
