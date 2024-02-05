import nsp from "../../../globals/js/namespace";
import { FC } from "react";
import classNames from "classnames";

type FootNoteType = "anchor" | "note";

interface Props {
  type: FootNoteType;
  number: number;
  prefix?: string;
  className?: string;
}

export const FootNoteNumber: FC<Props> = (props) => {
  const prefix = props.prefix ? `${props.prefix}-` : "";
  const id = `footnote_${prefix}${props.number}_${Date.now()}`;
  const className = classNames(nsp("foot-note-number"), props.className);

  switch (props.type) {
    case "note":
      return (
        <span id={id} className={className}>
          {props.number}
        </span>
      );
    case "anchor":
      return (
        <a href={`#${id}`} className={className}>
          {props.number}
        </a>
      );
    default:
      throw new Error("Unknown FootNoteType: " + props.type);
  }
};
