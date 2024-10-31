import Icon from "@digitalservicebund/icons/NotificationsNone";
import classNames from "classnames";
import nsp from "@/globals/js/namespace";

interface AlertProps {
  readonly headline: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function Alert({ headline, children, className }: AlertProps) {
  return (
    <div className={classNames(nsp("alert"), className)}>
      <strong className={`${nsp("alert")}__title`}>
        <Icon className={`${nsp("alert")}__icon`} />
        {headline}
      </strong>
      {children}
    </div>
  );
}
