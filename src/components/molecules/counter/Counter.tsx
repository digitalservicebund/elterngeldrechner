import nsp from "@/globals/js/namespace";
import {
  FieldError,
  FieldValues,
  UseFormRegister,
  RegisterOptions,
  Path,
  get,
  FieldErrors,
} from "react-hook-form";

import { Description } from "@/components/atoms";
import classNames from "classnames";
import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";

interface Props<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  errors?: FieldErrors<TFieldValues>;
  onDecrease: () => void;
  onIncrease: () => void;
  required: boolean;
}

export const Counter = <TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  onIncrease,
  onDecrease,
  required,
}: Props<TFieldValues>) => {
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
          aria-describedby={error && `${name}-error`}
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
      {error && (
        <Description id={`${name}-error`} error={true}>
          {error.message}
        </Description>
      )}
    </div>
  );
};
