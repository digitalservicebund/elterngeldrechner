import classNames from "classnames";
import { ReactNode, useId } from "react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  get,
} from "react-hook-form";

type RadioGroupValue = string | number;

export interface CustomRadioGroupOption<
  V extends RadioGroupValue = RadioGroupValue,
> {
  value: V;
  label: string;
  description?: (id: string) => ReactNode;
}

type Props<TFieldValues extends FieldValues> = {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly legend: string | ReactNode;
  readonly slotBetweenLegendAndOptions?: ReactNode;
  readonly options: CustomRadioGroupOption[];
  readonly errors?: FieldErrors<TFieldValues>;
  readonly required?: boolean;
  readonly horizontal?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
};

export function CustomRadioGroup<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  legend,
  slotBetweenLegendAndOptions,
  options,
  errors,
  required,
  horizontal = false,
  disabled = false,
  className,
}: Props<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const baseId = useId();

  const vertical = !horizontal;

  return (
    <div className="relative">
      <fieldset
        role="radiogroup"
        className={classNames(
          "flex gap-16",
          {
            "flex-col": vertical,
            "justify-around": horizontal,
          },
          className,
        )}
        aria-describedby={hasError ? errorIdentifier : undefined}
      >
        <legend className={slotBetweenLegendAndOptions ? "" : "mb-8"}>
          {legend}
        </legend>

        {!!slotBetweenLegendAndOptions && (
          <div className="mb-8">{slotBetweenLegendAndOptions}</div>
        )}

        {options.map((option, i) => {
          const descriptionId = `${baseId}-${option.label}`;

          return (
            <label
              key={option.label}
              className={getLabelClassName(hasError, horizontal, disabled)}
            >
              <input
                {...register(name, registerOptions)}
                aria-describedby={descriptionId}
                className={getInputClassName(hasError, disabled)}
                type="radio"
                data-testid={name + "_option_" + i}
                value={option.value}
                required={required}
                disabled={disabled}
              />
              {option.label}

              {!!option.description && option.description(descriptionId)}
            </label>
          );
        })}

        {!!hasError && (
          <span id={errorIdentifier} className="mt-8 text-14 text-danger">
            {error.message}
          </span>
        )}
      </fieldset>
    </div>
  );
}

function getInputClassName(hasError: boolean, disabled: boolean): string {
  return classNames(
    "relative size-32 min-w-32 rounded-full border border-solid border-primary bg-white",
    "before:size-16 before:rounded-full before:content-['']",
    "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
    "checked:before:bg-primary",
    { "hover:border-2 hover:border-primary": !disabled },
    { "focus:border-2 focus:border-primary": !disabled },
    { "!border-danger !checked:before:bg-danger": hasError },
    { "cursor-default": disabled },
  );
}

function getLabelClassName(
  hasError: boolean,
  horizontal: boolean,
  disabled: boolean,
) {
  return classNames("flex content-center gap-16", {
    "text-danger": hasError,
    "items-center": horizontal,
    "flex-col": horizontal,
    "cursor-default": disabled,
  });
}
