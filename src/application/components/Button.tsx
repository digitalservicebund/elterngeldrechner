import classNames from "classnames";
import {
  ButtonHTMLAttributes,
  type ForwardedRef,
  PropsWithChildren,
  forwardRef,
} from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly buttonStyle?: ButtonStyle;
  readonly type: HTMLButtonElement["type"]; // Enforce accessibility rules.
};

export const Button = forwardRef(function Button(
  {
    buttonStyle = "primary",
    className,
    children,
    ...forwardAttributes
  }: PropsWithChildren<Props>,
  ref?: ForwardedRef<HTMLButtonElement>,
) {
  return (
    // eslint-disable-next-line react/button-has-type -- This is guaranteed by the properties
    <button
      ref={ref}
      className={classNames(
        "border border-solid border-primary text-20 transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
        CLASS_NAMES_PER_BUTTON_STYLE[buttonStyle],
        className,
      )}
      {...forwardAttributes}
    >
      {children}
    </button>
  );
});

type ButtonStyle = "primary" | "secondary" | "link";

const CLASS_NAMES_PER_BUTTON_STYLE: Record<ButtonStyle, string> = {
  // The [@media(hover:hover)]:hover is used to ensure that the hover style is only applied
  // on devices that support hover, preventing it from being applied on touch devices after
  // clicking the button.
  primary:
    "bg-primary text-white px-24 py-16 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-primary active:focus:bg-white active:focus:text-primary",
  secondary:
    "bg-transparent text-primary px-24 py-16 [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-white active:focus:bg-primary active:focus:text-white",
  link: "bg-transparent text-primary p-0 border-none [@media(hover:hover)]:hover:bg-transparent active:focus:outline-none underline",
};
