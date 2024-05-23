import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  get,
  UseFormRegister,
} from "react-hook-form";
import nsp from "@/globals/js/namespace";
import { Description } from "@/components/atoms";
import { InfoDialog } from "@/components/molecules/info-dialog/InfoDialog";
import { Info } from "@/components/molecules/info-dialog/infoTexts";

interface CustomInputProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues>;
  placeholder?: string;
  info?: Info;
}

export function CustomInput<TFieldValues extends FieldValues>({
  register,
  name,
  label,
  errors,
  placeholder,
  info,
}: CustomInputProps<TFieldValues>) {
  const error: FieldError | undefined = get(errors, name);

  return (
    <div
      className={classNames(
        nsp("custom-input"),
        error && nsp("custom-input--error"),
      )}
    >
      <div className={nsp("custom-input-question")}>
        <label className={nsp("custom-input-question__label")} htmlFor={name}>
          {label}
        </label>
        <input
          className={nsp("custom-input-question__input")}
          {...register(name)}
          type="text"
          id={name}
          placeholder={placeholder}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
        />
        {!!error && (
          <Description id={`${name}-error`} error>
            {error.message}
          </Description>
        )}
      </div>

      {!!info && <InfoDialog info={info} />}
    </div>
  );
}
