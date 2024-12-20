import { MouseEvent, ReactNode } from "react";
import classNames from "classnames";
import { FieldValues, Path } from "react-hook-form";

interface Props<TFieldValues extends FieldValues> {
  readonly id?: string;
  readonly className?: string;
  readonly buttonStyle?: "primary" | "secondary" | "link";
  readonly label: string | ReactNode;
  readonly iconBefore?: ReactNode;
  readonly iconAfter?: ReactNode;
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  readonly disabled?: boolean;
  readonly ariaLabel?: string;
  readonly ariaControls?: Path<TFieldValues>;
  readonly isSubmitButton?: boolean;
}

export function Button<TFieldValues extends FieldValues>({
  id,
  className,
  buttonStyle = "primary",
  label,
  iconBefore,
  iconAfter,
  onClick,
  disabled = false,
  ariaLabel,
  ariaControls,
  isSubmitButton = false,
}: Props<TFieldValues>) {
  return (
    <button
      id={id}
      className={classNames(
        "egr-button",
        buttonStyle === "primary" && "egr-button--primary",
        buttonStyle === "secondary" && "egr-button--secondary",
        buttonStyle === "link" && "egr-button--link",
        disabled && "egr-button--disabled",
        className,
      )}
      type={isSubmitButton ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
    >
      {!!iconBefore && iconBefore}
      {!!iconBefore && <>&nbsp;</>}

      <span>{label}</span>

      {!!iconAfter && <>&nbsp;</>}
      {!!iconAfter && iconAfter}
    </button>
  );
}
