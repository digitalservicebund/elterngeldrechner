import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormRegister,
  get,
} from "react-hook-form";
import { type Info, InfoDialog } from "@/application/components";
import { Description } from "@/application/features/abfrageteil/components/common";

type Props<TFieldValues extends FieldValues> = {
  readonly register: UseFormRegister<TFieldValues>;
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly info?: Info;
};

export function CustomInput<TFieldValues extends FieldValues>({
  register,
  name,
  label,
  errors,
  info,
}: Props<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  return (
    <div className={classNames("flex flex-col", error && "border-danger")}>
      <div className="flex flex-col">
        <label htmlFor={name}>{label}</label>
        <input
          className="mt-8 max-w-[14.25rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary"
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
