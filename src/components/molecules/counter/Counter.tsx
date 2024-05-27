import {
  FieldError,
  FieldValues,
  UseFormRegister,
  RegisterOptions,
  Path,
  get,
  FieldErrors,
} from "react-hook-form";

import classNames from "classnames";
import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import { Description } from "@/components/atoms";
import nsp from "@/globals/js/namespace";

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
  const error: FieldError | undefined = get(errors, name);

  return (
    <div className={classNames(nsp("counter"), error && nsp("counter--error"))}>
      <label className={nsp("counter__label")} htmlFor={name}>
        {label}
      </label>
      <div className={nsp("counter__controls")}>
        <button
          className={nsp("counter__button")}
          type="button"
          onClick={onDecrease}
          aria-label="verringern"
          aria-controls={name}
        >
          <RemoveIcon />
        </button>
        <input
          {...register(name, registerOptions)}
          className={nsp("counter__input")}
          type="number"
          id={name}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          required={required}
        />
        <button
          className={nsp("counter__button")}
          type="button"
          onClick={onIncrease}
          aria-label="erhöhen"
          aria-controls={name}
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
