import { FC } from "react";
import nsp from "../../../globals/js/namespace";
import { FootNoteNumber } from "../../atoms";

interface Props {
  id?: string;
  number?: number;
  prefix?: string;
  children?: React.ReactNode;
}

export const FootNote: FC<Props> = (props) => {
  return (
    <div id={props.id} className={nsp("foot-note")}>
      {props.number && (
        <FootNoteNumber
          type="note"
          number={props.number}
          prefix={props.prefix}
          className={nsp("foot-note__number")}
        />
      )}
      <div className={nsp("foot-note__note")}>{props.children}</div>
    </div>
  );
};
