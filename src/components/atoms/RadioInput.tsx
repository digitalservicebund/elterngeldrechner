import classNames from "classnames";
import {
  type AriaAttributes,
  type ChangeEventHandler,
  type ReactNode,
  useCallback,
} from "react";

type Props = {
  readonly name?: string;
  readonly value?: string | number;
  readonly isChecked?: boolean;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly ariaDescribedBy?: AriaAttributes["aria-describedby"];
  readonly dataTestId?: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function RadioInput({
  name,
  value,
  isChecked = false,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  ariaDescribedBy,
  dataTestId,
  onChange,
}: Props): ReactNode {
  const inputClassName = getInputClassName(isDisabled, isInvalid);

  const emitChangeEventWhenNotDisabled = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => !isDisabled && onChange(event), [isDisabled, onChange]);

  return (
    <input
      className={inputClassName}
      type="radio"
      name={name}
      value={value}
      checked={isChecked}
      required={isRequired}
      aria-disabled={isDisabled}
      aria-describedby={ariaDescribedBy}
      onChange={emitChangeEventWhenNotDisabled}
      data-testid={dataTestId}
    />
  );
}

function getInputClassName(isDisabled: boolean, isInvalid: boolean): string {
  return classNames(
    "relative size-32 rounded-full border border-solid border-primary bg-white",
    "before:size-16 before:rounded-full before:content-['']",
    "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
    "checked:before:bg-primary",
    { "hover:border-2 hover:border-primary": !isDisabled },
    { "focus:border-2 focus:border-primary": !isDisabled },
    { "!border-danger !checked:before:bg-danger": isInvalid },
    { "cursor-default": isDisabled },
  );
}
