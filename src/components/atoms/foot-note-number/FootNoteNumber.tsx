import classNames from "classnames";
import nsp from "@/globals/js/namespace";

type FootNoteType = "anchor" | "note";

interface Props {
  type: FootNoteType;
  number: number;
  prefix?: string;
  className?: string;
}

export function FootNoteNumber({ type, number, prefix, className }: Props) {
  const formatted_prefix = prefix ? `${prefix}-` : "";
  const id = `footnote_${formatted_prefix}${number}_${Date.now()}`;
  const allClassNames = classNames(nsp("foot-note-number"), className);

  switch (type) {
    case "note":
      return (
        <span id={id} className={allClassNames}>
          {number}
        </span>
      );
    case "anchor":
      return (
        <a href={`#${id}`} className={allClassNames}>
          {number}
        </a>
      );
    default:
      throw new Error("Unknown FootNoteType: " + type);
  }
}
