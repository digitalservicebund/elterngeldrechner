import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
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
import { Description } from "@/application/features/abfrageteil/components/common";

type Props<TFieldValues extends FieldValues> = {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
  readonly required: boolean;
};

export function Counter<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  onIncrease,
  onDecrease,
  required,
}: Props<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  return (
    <div className={classNames("egr-counter", error && "egr-counter--error")}>
      <label
        className={classNames(error ? "text-danger" : null)}
        htmlFor={name}
      >
        {label}
      </label>
      <div className="mt-16 flex flex-row items-center gap-16">
        <button
          className="size-32 rounded-full border-none bg-primary-light p-0 text-primary"
          type="button"
          onClick={onDecrease}
          data-testid="verringern"
          tabIndex={-1}
          aria-hidden
        >
          <RemoveIcon />
        </button>
        <input
          {...register(name, registerOptions)}
          className={classNames(
            "no-spinner box-content w-[1ch] border border-solid border-grey-dark px-16 py-8 focus:outline focus:outline-2 focus:!outline-primary",
            error ? "border-danger" : null,
          )}
          type="number"
          id={name}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          required={required}
        />
        <button
          className="size-32 rounded-full border-none bg-primary-light p-0 text-primary"
          type="button"
          onClick={onIncrease}
          data-testid="erhöhen"
          tabIndex={-1}
          aria-hidden
        >
          <AddIcon />
        </button>
      </div>
      {!!error && (
        <Description id={`${name}-error`} error>
          {error.message}
        </Description>
      )}
    </div>
  );
}
