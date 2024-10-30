import Icon from "@digitalservicebund/icons/NotificationsNone";
import nsp from "@/globals/js/namespace";

interface AlertProps {
  readonly headline: string;
  readonly children: React.ReactNode;
}

export function Alert({ headline, children }: AlertProps) {
  return (
    <div className={nsp("alert")}>
      <strong className={`${nsp("alert")}__title`}>
        <Icon className={`${nsp("alert")}__icon`} />
        {headline}
      </strong>
      {children}
    </div>
  );
}
