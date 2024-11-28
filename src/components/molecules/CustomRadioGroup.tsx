import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
  FieldErrors,
  get,
  FieldError,
} from "react-hook-form";
import classNames from "classnames";
import { ReactNode, useId } from "react";
import { Description } from "@/components/atoms";

type RadioGroupValue = string | number;

export interface CustomRadioGroupOption<
  V extends RadioGroupValue = RadioGroupValue,
> {
  value: V;
  label: string;
  description?: ReactNode;
}

export interface CustomRadioGroupProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly options: CustomRadioGroupOption[];
  readonly errors?: FieldErrors<TFieldValues>;
  readonly required?: boolean;
  readonly horizontal?: boolean;
}

export function CustomRadioGroup<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  options,
  errors,
  required,
  horizontal = false,
}: CustomRadioGroupProps<TFieldValues>) {
  const error: FieldError | undefined = get(errors, name);
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const vertical = !horizontal;

  return (
    <fieldset
      role="radiogroup"
      className={classNames("flex gap-10", {
        "flex-col": vertical,
        "justify-around": horizontal,
      })}
      aria-describedby={hasError ? errorIdentifier : undefined}
    >
      {options.map((option, i) => (
        <label
          key={option.label}
          className={classNames("flex content-center gap-16", {
            "text-danger": hasError,
            "items-center": horizontal,
            "flex-col": horizontal,
          })}
        >
          <input
            {...register(name, registerOptions)}
            className={getInputClassName(hasError)}
            type="radio"
            data-testid={name + "_option_" + i}
            value={option.value}
            required={required}
          />
          {option.label}

          {option.description ? option.description : null}
        </label>
      ))}

      {!!hasError && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </fieldset>
  );
}

function getInputClassName(hasError: boolean): string {
  return classNames(
    "relative size-32 rounded-full border border-solid border-primary bg-white",
    "before:size-16 before:rounded-full before:content-['']",
    "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
    "checked:before:bg-primary",
    "hover:border-2 hover:border-primary",
    "focus:border-2 focus:border-primary",
    { "!border-danger !checked:before:bg-danger": hasError },
  );
}
