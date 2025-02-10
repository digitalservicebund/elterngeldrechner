import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormRegister,
  get,
} from "react-hook-form";
import { Description } from "@/components/atoms";
import { InfoDialog } from "@/components/molecules/info-dialog/InfoDialog";
import { Info } from "@/components/molecules/info-dialog/infoTexts";

interface CustomInputProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly info?: Info;
}

export function CustomInput<TFieldValues extends FieldValues>({
  register,
  name,
  label,
  errors,
  info,
}: CustomInputProps<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  return (
    <div className={classNames("flex flex-col", error && "border-danger")}>
      <div className="flex flex-col">
        <label className="egr-custom-input-question__label" htmlFor={name}>
          {label}
        </label>
        <input
          className="mt-16 max-w-[14.25rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary"
          {...register(name)}
          type="text"
          id={name}
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
