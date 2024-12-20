import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  get,
  UseFormRegister,
} from "react-hook-form";
import { Description } from "@/components/atoms";
import { InfoDialog } from "@/components/molecules/info-dialog/InfoDialog";
import { Info } from "@/components/molecules/info-dialog/infoTexts";

interface CustomInputProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly placeholder?: string;
  readonly info?: Info;
}

export function CustomInput<TFieldValues extends FieldValues>({
  register,
  name,
  label,
  errors,
  placeholder,
  info,
}: CustomInputProps<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  return (
    <div
      className={classNames(
        "egr-custom-input",
        error && "egr-custom-input--error",
      )}
    >
      <div className="egr-custom-input-question">
        <label className="egr-custom-input-question__label" htmlFor={name}>
          {label}
        </label>
        <input
          className="egr-custom-input-question__input"
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
