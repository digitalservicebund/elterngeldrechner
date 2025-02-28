import classNames from "classnames";
import { ReactNode, useId } from "react";
import {
  type FieldPath,
  FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";
import { Description, RadioInput } from "@/components/atoms";
import { type Info, InfoDialog } from "@/components/molecules";

type RadioGroupValue = string | number;

export interface CustomRadioGroupOption<
  Value extends RadioGroupValue = RadioGroupValue,
> {
  value: Value;
  label: string;
  description?: (id: string) => ReactNode;
}

export interface CustomRadioGroupProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  readonly legend: string | ReactNode;
  readonly info?: Info;
  readonly options: CustomRadioGroupOption[];
  readonly horizontal?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomRadioGroup<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  legend,
  info,
  options,
  horizontal = false,
  disabled = false,
  className,
}: CustomRadioGroupProps<TFieldValues, TName>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name, rules });

  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const baseId = useId();
  const isRequired = !!rules?.required;

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

        {options.map((option, index) => {
          const isChecked = option.value === value;
          const hasDescription = !!option.description;
          const descriptionIdentifier = `${baseId}-${option.label}`;

          return (
            <label
              key={option.label}
              className={getLabelClassName(hasError, horizontal, disabled)}
            >
              <RadioInput
                value={option.value}
                isChecked={isChecked}
                isRequired={isRequired}
                isDisabled={disabled}
                isInvalid={hasError}
                ariaDescribedBy={
                  hasDescription ? descriptionIdentifier : undefined
                }
                dataTestId={`${name}_option_${index}`}
                onChange={onChange}
                /* data-testid */
              />
              {option.label}

              {!!option.description &&
                option.description(descriptionIdentifier)}
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
