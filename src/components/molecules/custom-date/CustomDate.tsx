import classNames from "classnames";
import { useId } from "react";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { IMask, IMaskInput } from "react-imask";
import { Description } from "@/components/atoms";
import { Info, InfoDialog } from "@/components/molecules/info-dialog";

interface CustomDateProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  readonly label: string;
  readonly required?: boolean;
  readonly info?: Info;
}

export function CustomDate<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  rules,
  name,
  label,
  required,
  info,
}: CustomDateProps<TFieldValues, TName>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, rules, name });

  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const dateFormatHintIdentifier = useId();

  const ariaDescribedBy = [
    dateFormatHintIdentifier,
    hasError ? errorIdentifier : undefined,
  ]
    .filter((identifier) => !!identifier)
    .join(" ");

  return (
    <div className="egr-custom-date">
      <div className="egr-custom-date__label">
        <label htmlFor={name}>{label}</label>
        {!!info && <InfoDialog info={info} />}
      </div>
      <div
        className={classNames(
          "egr-custom-date__field",
          error && "egr-custom-date__field--error",
        )}
      >
        <span
          id={dateFormatHintIdentifier}
          className="egr-custom-date__placeholder"
          aria-label="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
        >
          TT.MM.JJJJ
        </span>

        <IMaskInput
          className="egr-custom-date__input"
          name={name}
          id={name}
          inputRef={ref}
          mask={Date}
          lazy
          autofix="pad"
          value={value}
          blocks={{
            d: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1,
              to: 31,
              maxLength: 2,
            },
            m: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1,
              to: 12,
              maxLength: 2,
            },
            Y: {
              mask: IMask.MaskedRange,
              placeholderChar: "_",
              from: 1900,
              to: 2999,
              maxLength: 4,
            },
          }}
          onAccept={(value) => onChange(value)}
          onBlur={onBlur}
          placeholder="__.__.___"
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          required={required}
        />
      </div>

      {!!hasError && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </div>
  );
}
