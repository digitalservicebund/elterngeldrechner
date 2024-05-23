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
import nsp from "@/globals/js/namespace";
import { Description } from "@/components/atoms";
import { Info, InfoDialog } from "@/components/molecules/info-dialog";

type RadioValue = string | number;

export interface RadioOption<TValue extends RadioValue = RadioValue> {
  value: TValue;
  label: string;
}

export interface CustomRadioProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  options: RadioOption[];
  errors?: FieldErrors<TFieldValues>;
  required?: boolean;
  info?: Info;
}

export function CustomRadio<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  options,
  errors,
  required,
  info,
}: CustomRadioProps<TFieldValues>) {
  const error: FieldError | undefined = get(errors, name);

  return (
    <div className={nsp("custom-radio")}>
      <div role="radiogroup" className={nsp("custom-radio__options")}>
        {options.map((option, i) => {
          return (
            <div
              className={nsp("custom-radio__option")}
              key={name + "_option_" + i}
            >
              <input
                {...register(name, registerOptions)}
                className={classNames(
                  nsp("custom-radio__input"),
                  error && nsp("custom-radio__input--error"),
                )}
                type="radio"
                id={name + "_option_" + i}
                data-testid={name + "_option_" + i}
                value={option.value}
                key={name + "_option_" + i}
                aria-describedby={error ? `${name}-error` : undefined}
                required={required}
              />
              <label
                className={classNames(
                  nsp("custom-radio__label"),
                  error && nsp("custom-radio__label--error"),
                )}
                htmlFor={name + "_option_" + i}
                key={name + "_label_" + i}
              >
                {option.label}
              </label>
              {options.length - 1 === i && !!error && (
                <Description id={`${name}-error`} error>
                  {error.message}
                </Description>
              )}
            </div>
          );
        })}
      </div>

      {!!info && <InfoDialog info={info} />}
    </div>
  );
}
