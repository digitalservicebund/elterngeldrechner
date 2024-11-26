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
import { useId } from "react";
import { Description } from "@/components/atoms";

type RadioValue = string | number;

export interface CustomRadioOption<TValue extends RadioValue = RadioValue> {
  value: TValue;
  label: string;
}

export interface CustomRadioProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly options: CustomRadioOption[];
  readonly errors?: FieldErrors<TFieldValues>;
  readonly required?: boolean;
}

export function CustomRadio<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  options,
  errors,
  required,
}: CustomRadioProps<TFieldValues>) {
  const error: FieldError | undefined = get(errors, name);

  const descriptionId = useId();

  return (
    <div role="radiogroup" className="flex flex-col gap-10">
      {options.map((option, i) => (
        <label
          key={option.label}
          className={classNames("flex content-center gap-8", {
            "text-danger": error,
          })}
        >
          <input
            {...register(name, registerOptions)}
            className={getInputClassName(!!error)}
            type="radio"
            data-testid={name + "_option_" + i}
            value={option.value}
            aria-describedby={error ? descriptionId : undefined}
            required={required}
          />
          {option.label}
        </label>
      ))}

      {!!error && (
        <Description id={descriptionId} error>
          {error.message}
        </Description>
      )}
    </div>
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
