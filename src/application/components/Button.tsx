import classNames from "classnames";
import { type ForwardedRef, MouseEvent, ReactNode, forwardRef } from "react";
import { FieldValues, Path } from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
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
  readonly form?: string;
};

export const Button = forwardRef(function Button<
  TFieldValues extends FieldValues,
>(
  {
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
    form,
  }: Props<TFieldValues>,
  ref?: ForwardedRef<HTMLButtonElement>,
) {
  // The [@media(hover:hover)]:hover is used to ensure that the hover style is only applied
  // on devices that support hover, preventing it from being applied on touch devices after
  // clicking the button.

  const twClasses = {
    base: "border border-solid border-primary text-20 transition-all duration-300",
    primary:
      "bg-primary text-white px-24 py-16 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-primary active:focus:bg-white active:focus:text-primary",
    secondary:
      "bg-transparent text-primary px-24 py-16 [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white active:focus:bg-primary active:focus:text-white",
    link: "bg-transparent text-primary p-0 border-none [@media(hover:hover)]:hover:bg-transparent active:focus:outline-none",
    disabled: "pointer-events-none opacity-50",
  };

  const appliedClasses = classNames(
    twClasses.base,
    className,
    buttonStyle === "primary" && twClasses.primary,
    buttonStyle === "secondary" && twClasses.secondary,
    buttonStyle === "link" && twClasses.link,
    disabled && twClasses.disabled,
  );

  return (
    <button
      id={id}
      ref={ref}
      className={appliedClasses}
      type={isSubmitButton ? "submit" : "button"}
      form={form}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
    >
      {!!iconBefore && iconBefore}
      {!!iconBefore && <>&nbsp;</>}

      <span className={classNames(buttonStyle === "link" ? "underline" : null)}>
        {label}
      </span>

      {!!iconAfter && <>&nbsp;</>}
      {!!iconAfter && iconAfter}
    </button>
  );
});
