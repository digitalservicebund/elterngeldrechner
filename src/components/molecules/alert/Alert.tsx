import Icon from "@digitalservicebund/icons/NotificationsNone";
import classNames from "classnames";

interface AlertProps {
  readonly headline: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function Alert({ headline, children, className }: AlertProps) {
  return (
    <div className={classNames("egr-alert", className)}>
      <strong className="egr-alert__title">
        <Icon className="egr-alert__icon" />
        {headline}
      </strong>
      {children}
    </div>
  );
}
