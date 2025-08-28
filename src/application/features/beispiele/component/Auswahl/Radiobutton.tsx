import classNames from "classnames";
import { ReactNode, useId } from "react";

type Props = {
  readonly titel: string;
  readonly beschreibung: string;
  readonly inputName: string;
  readonly checked: boolean;
  readonly onChange: () => void;
  readonly className?: string;
  readonly children?: ReactNode;
};

export function Radiobutton({
  titel,
  beschreibung,
  inputName,
  checked,
  onChange,
  className,
  children,
}: Props): ReactNode {
  const radioId = useId();

  return (
    <label
      htmlFor={radioId}
      className={classNames(
        "grid cursor-pointer grid-cols-[auto_1fr] gap-x-10 rounded bg-off-white p-24",
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
          "peer relative size-32 min-w-32 rounded-full border-2 border-solid border-black bg-white",
          "before:size-16 before:rounded-full before:content-['']",
          "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
          "checked:before:bg-black self-center",
        )}
        aria-labelledby={`${radioId}-titel ${radioId}-beschreibung`}
      />

      <h4 id={`${radioId}-titel`} className="self-center break-words">
        {titel}
      </h4>

      <p id={`${radioId}-beschreibung`} className="col-span-2 break-words">
        {beschreibung}
      </p>

      {!!children && (
        <div className="col-span-2 mt-16 h-[1px] w-full bg-grey" />
      )}

      <div className="col-span-2 flex flex-col gap-4 peer-checked:[&_span]:bg-grey-light">
        {children}
      </div>
    </label>
  );
}
