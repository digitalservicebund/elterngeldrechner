// import classNames from "classnames";
import { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";

type Props = {
  readonly title: string;
  readonly months: string[];
};

export function Example({ title, months }: Props): ReactNode {
  return (
    <div className="bg-success text-white">
      #TODO PLATZHALTER
      <PersonIcon />
      {title}
      {JSON.stringify(months)}
    </div>
  );
}
