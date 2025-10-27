import classNames from "classnames";
import { ReactNode, useId } from "react";

type Props = {
  readonly titel: string;
  readonly beschreibung: string;
  readonly inputName: string;
  readonly checked: boolean;
  readonly body?: ReactNode;
  readonly footer?: ReactNode;
  readonly onChange: () => void;
  readonly className?: string;
};

export function Radiobutton({
  titel,
  beschreibung,
  inputName,
  checked,
  body,
  footer,
  onChange,
  className,
}: Props): ReactNode {
  const radioId = useId();

  return (
    <label
      htmlFor={radioId}
      className={classNames(
        "grid h-full cursor-pointer grid-cols-[auto_1fr] grid-rows-[4rem_auto_1fr] gap-x-10 rounded bg-off-white p-20 pt-10",
        "has-[:focus]:ring-2 has-[:focus]:ring-primary",
        "has-[:checked]:bg-primary-light",
        className,
      )}
    >
      <input
        id={radioId}
        type="radio"
        name={inputName}
        checked={checked}
        onChange={onChange}
        className={classNames(
          "relative size-32 min-w-32 self-center rounded-full border-2 border-solid border-black bg-off-white",
          "before:size-16 before:rounded-full before:content-['']",
          "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
          "checked:before:bg-black checked:bg-primary-light",
        )}
        aria-labelledby={`${radioId}-titel ${radioId}-beschreibung`}
      />

      <p
        id={`${radioId}-titel`}
        className="min-w-0 self-center break-words text-[19px] font-bold leading-[1.4]"
      >
        {titel}
      </p>

      <p id={`${radioId}-beschreibung`} className="col-span-2 break-words">
        {beschreibung}
      </p>

      <div></div>

      {!!body && (
        <div className="col-span-2 flex flex-col justify-center gap-4 py-10">
          {body}
        </div>
      )}

      {!!footer && (
        <div className="col-span-2 flex flex-col justify-center gap-4">
          {footer}
        </div>
      )}
    </label>
  );
}
