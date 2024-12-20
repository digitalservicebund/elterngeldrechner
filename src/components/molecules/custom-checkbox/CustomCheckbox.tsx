import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  get,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import classNames from "classnames";
import { MouseEvent } from "react";
import { Description } from "@/components/atoms";
import { InfoDialog, Info } from "@/components/molecules/info-dialog";

interface Props<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues> | boolean;
  readonly onChange?: (newValue: boolean) => void;
  readonly info?: Info;
}

export function CustomCheckbox<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  onChange,
  info,
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

  return (
    <div className="egr-custom-checkbox">
      <div>
        <input
          {...register(name, registerOptions)}
          type="checkbox"
          className={classNames(
            "egr-custom-checkbox__input",
            hasError && "egr-custom-checkbox__input--error",
          )}
          id={name}
          onClick={onClick}
          aria-invalid={hasError}
          aria-describedby={
            errorMessage && `${name}-error`
              ? errorMessage && `${name}-error`
              : undefined
          }
        />
        <label
          className={classNames(
            "egr-custom-checkbox__label",
            hasError && "egr-custom-checkbox__label--error",
          )}
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
