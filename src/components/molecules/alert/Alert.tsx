import { FC } from "react";
import nsp from "../../../globals/js/namespace";
import { Icon } from "../../atoms";

interface Props {
  headline: string;
  children: React.ReactNode;
}

export const Alert: FC<Props> = (props) => {
  return (
    <div className={nsp("alert")}>
      <h3 className={`${nsp("alert")}__headline`}>
        <Icon name="bell" className={`${nsp("alert")}__icon`} />
        {props.headline}
      </h3>
      {props.children}
    </div>
  );
};
