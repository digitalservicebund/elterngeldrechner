import { MouseEvent, ReactNode } from "react";
import classNames from "classnames";
import { FieldValues, Path } from "react-hook-form";
import nsp from "@/globals/js/namespace";

interface Props<TFieldValues extends FieldValues> {
  className?: string;
  buttonStyle?: "primary" | "secondary" | "link";
  label: string | ReactNode;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaControls?: Path<TFieldValues>;
  ariaHidden?: boolean;
  isSubmitButton?: boolean;
}

export function Button<TFieldValues extends FieldValues>({
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
