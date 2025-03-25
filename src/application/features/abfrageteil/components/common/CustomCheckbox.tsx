import classNames from "classnames";
import { MouseEvent } from "react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  get,
} from "react-hook-form";
import { Description } from "./Description";
import { type Info, InfoDialog } from "@/application/components";

interface Props<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues> | boolean;
  readonly onChange?: (newValue: boolean) => void;
  readonly info?: Info;
  readonly className?: string;
}

export function CustomCheckbox<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  onChange,
  info,
  className,
}: Props<TFieldValues>) {
  let hasError = false;
  let errorMessage = "";
  if (typeof errors === "boolean") {
    hasError = errors;
  } else {
    const error = get(errors, name) as FieldError | undefined;
    if (error) {
      hasError = true;
      errorMessage = error.message || "";
    }
  }

  const onClick = (event: MouseEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.currentTarget.checked);
    }
  };

  const checkboxClasses = {
    defaultBorderState:
      "before:absolute before:left-0 before:top-0 before:size-32 before:border before:border-solid before:border-primary before:bg-white before:content-['']",
    defaultMarkerState:
      "after:absolute after:left-8 after:top-8 after:size-16 after:content-['']",

    focusBorderState:
      "peer-focus:before:outline peer-focus:before:outline-2 peer-focus:before:outline-primary",

    activeMarkerState: "peer-checked:after:bg-primary",
    activeBorderState: "peer-checked:before:border-primary",

    errorClasses: hasError
      ? "before:border-danger peer-checked:after:bg-danger text-danger"
      : null,
  };

  const allCheckboxClasses = Object.values(checkboxClasses).join(" ");

  return (
    <div className={classNames(className, "flex justify-between p-8 pl-0")}>
      <div>
        <input
          {...register(name, registerOptions)}
          type="checkbox"
          className={classNames(
            "peer absolute opacity-0",
            hasError && "border-danger",
          )}
          id={name}
          onClick={onClick}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
        />
        <label
          className={classNames("relative pl-40", allCheckboxClasses)}
          htmlFor={name}
        >
          {label}
        </label>
        {!!errorMessage && (
          <Description id={`${name}-error`} error>
            {errorMessage}
          </Description>
        )}
      </div>

      {!!info && <InfoDialog info={info} />}
    </div>
  );
}
