import Icon from "@digitalservicebund/icons/EmojiObjectsOutlined";
import classNames from "classnames";

type Props = {
  readonly headline: string;
  readonly children: React.ReactNode;
  readonly className?: string;
};

export function Alert({ headline, children, className }: Props) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-4 rounded bg-primary-light pl-16 pr-32 py-24",
        className,
      )}
    >
      <strong className="line-height-1.5">
        <Icon className="mr-4 mt-4 shrink-0" />
        {headline}
      </strong>
      <div className="pl-[28px]">{children}</div>
    </div>
  );
}
