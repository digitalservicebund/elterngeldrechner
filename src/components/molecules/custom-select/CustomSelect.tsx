import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  get,
} from "react-hook-form";
import { Description } from "@/components/atoms";
import { Info, InfoDialog } from "@/components/molecules/info-dialog";

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
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly options: SelectOption[];
  readonly autoWidth?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly info?: Info;
}

export function CustomSelect<TFieldValues extends FieldValues>({
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
}: CustomSelectProps<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  return (
    <div
      className={classNames(
        "egr-custom-select",
        autoWidth && "egr-custom-select--auto-width",
      )}
    >
      <div className="egr-custom-select-question">
        <label className="egr-custom-select-question__label" htmlFor={name}>
          {label}
        </label>

        <div className="egr-custom-select-question__control">
          <select
            {...register(name, registerOptions)}
            className={classNames(
              "egr-custom-select-question__input",
              error && "egr-custom-select-question__input--error",
            )}
            id={name}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            required={required}
            {...aria}
          >
            <option
              className="egr-custom-select-question__option"
              value=""
              disabled={required}
              hidden={required}
            >
              Bitte wählen
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                className="egr-custom-select-question__option"
                value={option.value}
                hidden={option.hidden}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
