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
import { Description } from "@/application/components/atoms";
import {
  Info,
  InfoDialog,
} from "@/application/components/molecules/info-dialog";

type RadioGroupValue = string | number;

export interface CustomRadioGroupOption<
  V extends RadioGroupValue = RadioGroupValue,
> {
  value: V;
  label: string;
  description?: (id: string) => ReactNode;
}

export interface CustomRadioGroupProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly legend: string | ReactNode;
  readonly info?: Info;
  readonly slotBetweenLegendAndOptions?: ReactNode;
  readonly options: CustomRadioGroupOption[];
  readonly errors?: FieldErrors<TFieldValues>;
  readonly required?: boolean;
  readonly horizontal?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomRadioGroup<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  legend,
  info,
  slotBetweenLegendAndOptions,
  options,
  errors,
  required,
  horizontal = false,
  disabled = false,
  className,
}: CustomRadioGroupProps<TFieldValues>) {
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
        <legend className="mb-16 w-full py-4 pr-40">{legend}</legend>
        {!!info && (
          <div className="absolute right-0 top-4">
            <InfoDialog info={info} />
          </div>
        )}

        {slotBetweenLegendAndOptions ? (
          <div className="mb-16">{slotBetweenLegendAndOptions}</div>
        ) : null}

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
          <Description id={errorIdentifier} error>
            {error.message}
          </Description>
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
