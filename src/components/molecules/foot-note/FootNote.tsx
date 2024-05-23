import { ReactNode } from "react";
import nsp from "@/globals/js/namespace";
import { FootNoteNumber } from "@/components/atoms";

interface Props {
  id?: string;
  number?: number;
  prefix?: string;
  children?: ReactNode;
}

export function FootNote({ id, number, prefix, children }: Props) {
  return (
    <div id={id} className={nsp("foot-note")}>
      {!!number && (
        <FootNoteNumber
          type="note"
          number={number}
          prefix={prefix}
          className={nsp("foot-note__number")}
        />
      )}
      <div className={nsp("foot-note__note")}>{children}</div>
    </div>
  );
}
