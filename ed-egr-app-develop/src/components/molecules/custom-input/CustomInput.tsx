import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  get,
  UseFormRegister,
} from "react-hook-form";
import nsp from "../../../globals/js/namespace";
import { Description } from "../../atoms";
import { InfoDialog } from "../info-dialog/InfoDialog";
import { Info } from "../info-dialog/infoTexts";

interface CustomInputProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues>;
  placeholder?: string;
  info?: Info;
}

export const CustomInput = <TFieldValues extends FieldValues>({
  register,
  name,
  label,
  errors,
  placeholder,
  info,
}: CustomInputProps<TFieldValues>) => {
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
          aria-describedby={error && `${name}-error`}
          aria-invalid={!!error}
        />
        {error && (
          <Description id={`${name}-error`} error={true}>
            {error.message}
          </Description>
        )}
      </div>

      {info && <InfoDialog info={info} />}
    </div>
  );
};
