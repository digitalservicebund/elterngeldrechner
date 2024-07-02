import { MouseEvent, ReactNode } from "react";
import classNames from "classnames";
import { FieldValues, Path } from "react-hook-form";
import nsp from "@/globals/js/namespace";

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
  readonly ariaHidden?: boolean;
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
        nsp("button"),
        buttonStyle === "primary" && nsp("button--primary"),
        buttonStyle === "secondary" && nsp("button--secondary"),
        buttonStyle === "link" && nsp("button--link"),
        disabled && nsp("button--disabled"),
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
