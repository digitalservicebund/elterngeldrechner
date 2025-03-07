import classNames from "classnames";
import { useId } from "react";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { IMask, IMaskInput } from "react-imask";
import { Description } from "@/application/components";
import { type Info, InfoDialog } from "@/application/components";

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
    <div className="flex flex-col">
      <div className="mb-16 flex w-full justify-between">
        <label htmlFor={name}>{label}</label>
        {!!info && <InfoDialog info={info} />}
      </div>
      <div
        className={classNames(
          "mb-16 flex max-w-[20rem] flex-col border border-solid border-grey-dark px-16 py-8",
          "focus-within:outline focus-within:outline-2 focus-within:outline-primary",
          error && "mb-0 border-danger",
        )}
      >
        <span
          id={dateFormatHintIdentifier}
          className="text-14 text-text-light"
          aria-label="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
        >
          TT.MM.JJJJ
        </span>

        <IMaskInput
          className="border-none focus:outline-none"
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
          onAccept={onChange}
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
