import classNames from "classnames";
import {
  UseFormRegister,
  RegisterOptions,
  FieldErrors,
  FieldValues,
  FieldError,
  Path,
  get,
} from "react-hook-form";
import nsp from "../../../globals/js/namespace";
import { Description } from "../../atoms";
import { InfoDialog, Info } from "../info-dialog";

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  hidden?: boolean;
}

export const cloneOptionsList = (options: SelectOption[]) =>
  options.map((o) => {
    return { label: o.label, value: o.value, hidden: o.hidden };
  });

interface CustomSelectProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues>;
  options: SelectOption[];
  autoWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  info?: Info;
}

export const CustomSelect = <TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  options,
  autoWidth,
  required,
  disabled,
  info,
  ...aria
}: CustomSelectProps<TFieldValues>) => {
  const error: FieldError | undefined = get(errors, name);

  return (
    <div
      className={classNames(
        nsp("custom-select"),
        autoWidth && nsp("custom-select--auto-width"),
      )}
    >
      <div className={nsp("custom-select-question")}>
        <label className={nsp("custom-select-question__label")} htmlFor={name}>
          {label}
        </label>

        <div className={nsp("custom-select-question__control")}>
          <select
            {...register(name, registerOptions)}
            className={classNames(
              nsp("custom-select-question__input"),
              error && nsp("custom-select-question__input--error"),
            )}
            id={name}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error && `${name}-error`}
            required={required}
            {...aria}
          >
            <option
              className={nsp("custom-select-question__option")}
              value=""
              disabled={required}
              hidden={required}
            >
              Bitte wählen
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                className={nsp("custom-select-question__option")}
                value={option.value}
                hidden={option.hidden}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
