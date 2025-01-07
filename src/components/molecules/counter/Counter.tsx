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

interface Props<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
  readonly required: boolean;
}

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
      <label className="egr-counter__label" htmlFor={name}>
        {label}
      </label>
      <div className="egr-counter__controls">
        <button
          className="egr-counter__button"
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
          className="egr-counter__input"
          type="number"
          id={name}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          required={required}
        />
        <button
          className="egr-counter__button"
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
        <p className="mt-8 text-14 text-danger" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
}
