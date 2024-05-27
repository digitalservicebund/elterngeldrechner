import classNames from "classnames";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { IMask, IMaskInput } from "react-imask";
import nsp from "@/globals/js/namespace";
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

  return (
    <div className={nsp("custom-date")}>
      <div className={nsp("custom-date__label")}>
        <label htmlFor={name}>{label}</label>
        {!!info && <InfoDialog info={info} />}
      </div>
      <div
        className={classNames(
          nsp("custom-date__field"),
          error && nsp("custom-date__field--error"),
        )}
      >
        <span className={nsp("custom-date__placeholder")} aria-hidden>
          TT.MM.JJJJ
        </span>
        <IMaskInput
          className={nsp("custom-date__input")}
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
          onAccept={(value) => onChange(value as string)}
          onBlur={onBlur}
          placeholder="__.__.___"
          aria-placeholder="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          required={required}
        />
      </div>
      {!!error && (
        <Description id={`${name}-error`} error>
          {error.message}
        </Description>
      )}
    </div>
  );
}
