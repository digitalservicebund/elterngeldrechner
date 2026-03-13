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
        "grid grid-cols-[auto_1fr] gap-x-12 gap-y-4 rounded bg-primary-light pl-16 pr-32 py-24",
        className,
      )}
    >
      <Icon className="mr-4 mt-2 shrink-0 text-primary" />

      <div className="flex flex-col gap-4">
        <strong className="leading-normal">{headline}</strong>
        <div className="text-sm md:text-base">{children}</div>
      </div>
    </div>
  );
}
