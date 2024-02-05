import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  get,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import nsp from "../../../globals/js/namespace";
import { Description } from "../../atoms";
import classNames from "classnames";
import { MouseEvent } from "react";
import { InfoDialog, Info } from "../info-dialog";

interface Props<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues> | boolean;
  onChange?: (newValue: boolean) => void;
  info?: Info;
}

export const CustomCheckbox = <TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  onChange,
  info,
}: Props<TFieldValues>) => {
  let hasError = false;
  let errorMessage = "";
  if (typeof errors === "boolean") {
    hasError = errors;
  } else {
    const error: FieldError | undefined = get(errors, name);
    if (error) {
      hasError = !!error;
      errorMessage = error.message || "";
    }
  }

  const onClick = (event: MouseEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.currentTarget.checked);
    }
  };

  return (
    <div className={nsp("custom-checkbox")}>
      <input
        {...register(name, registerOptions)}
        type="checkbox"
        className={classNames(
          nsp("custom-checkbox__input"),
          hasError && nsp("custom-checkbox__input--error"),
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
          nsp("custom-checkbox__label"),
          hasError && nsp("custom-checkbox__label--error"),
        )}
        htmlFor={name}
      >
        {label}
      </label>
      {errorMessage && (
        <Description id={`${name}-error`} error={true}>
          {errorMessage}
        </Description>
      )}

      {info && <InfoDialog info={info} />}
    </div>
  );
};
