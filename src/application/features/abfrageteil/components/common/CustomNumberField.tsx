import classNames from "classnames";
import { type ReactNode, useId, useMemo } from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Description } from "@/application/features/abfrageteil/components/common";

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & {
  readonly label: string;
  readonly slotBetweenLabelAndOptions?: ReactNode;
  readonly slotBeforeLabel?: ReactNode;
  readonly allowedDecimalPlaces?: 1 | 2;
  readonly suffix?: string;
  readonly min?: number;
  readonly max?: number;
  readonly className?: string;
  readonly placeholder?: string;
  readonly stretch?: boolean;
  readonly required?: boolean;
  readonly ariaDescribedByIfNoError?: string;
  readonly onChange?: (value: number | null) => void;
};

export function CustomNumberField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  onChange: externalOnChange,
  slotBetweenLabelAndOptions,
  slotBeforeLabel,
  allowedDecimalPlaces = 2,
  min = 0,
  max = 99999,
  suffix,
  className,
  placeholder,
  required,
  ariaDescribedByIfNoError,
}: Props<TFieldValues, TName> & {
  readonly onChange?: (value: number | null) => void;
}) {
  const registerOptions = useMemo(() => {
    const options: RegisterOptions<TFieldValues, TName> = {};

    if (required) {
      options.required = "Dieses Feld ist erforderlich";
    }

    return options;
  }, [required]);

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name, rules: registerOptions });

  const mask = suffix ? `num ${suffix}` : "num";

  const errorIdentifier = useId();
  const hasError = error !== undefined;
  const descriptionIdentifier = hasError
    ? errorIdentifier
    : ariaDescribedByIfNoError;

  return (
    <div
      className={classNames(
        "flex flex-col",
        error && "border-danger",
        className,
      )}
    >
      {!!slotBeforeLabel && <div className="mb-16">{slotBeforeLabel}</div>}

      <label
        className={slotBetweenLabelAndOptions ? "text-16" : "mb-4 text-16"}
        htmlFor={name}
      >
        {label}
      </label>

      {!!slotBetweenLabelAndOptions && (
        <div className="mb-16">{slotBetweenLabelAndOptions}</div>
      )}

      <IMaskInput
        className="max-w-xs border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary"
        inputRef={ref}
        mask={mask}
        unmask
        blocks={{
          num: {
            mask: Number,
            max,
            min,
            thousandsSeparator: ".",
            scale: allowedDecimalPlaces,
          },
        }}
        lazy={false}
        autofix
        value={value === null ? "" : String(value)}
        onAccept={(value: string) => {
          const parsed = value ? +value : null;
          onChange(parsed);
          externalOnChange?.(parsed);
          // if (!value) {
          //   onChange(null);
          // } else {
          //   onChange(+value);
          // }
        }}
        onBlur={onBlur}
        type="text"
        inputMode="numeric"
        name={name}
        id={name}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={descriptionIdentifier}
        required={required}
      />

      {!!error && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </div>
  );
}
