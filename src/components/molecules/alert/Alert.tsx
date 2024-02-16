import { FC } from "react";
import nsp from "../../../globals/js/namespace";
import { Icon } from "../../atoms";
import classNames from "classnames";

interface Props {
  headline: string;
  box?: boolean;
  children: React.ReactNode;
}

export const Alert: FC<Props> = (props) => {
  return (
    <div className={classNames(nsp("alert"), props.box && nsp("alert--box"))}>
      <h3 className={nsp("alert__headline")}>
        <Icon name="bell" className={nsp("alert__icon")} />
        {props.headline}
      </h3>
      {props.children}
    </div>
  );
};
