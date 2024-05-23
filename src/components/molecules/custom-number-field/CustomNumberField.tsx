import classNames from "classnames";
import { useMemo } from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { IMaskInput } from "react-imask";
import nsp from "@/globals/js/namespace";
import { Description } from "@/components/atoms";
import { InfoDialog, Info } from "@/components/molecules/info-dialog";

interface CustomNumberFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  allowedDecimalPlaces?: 1 | 2;
  suffix?: string;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
  stretch?: boolean;
  required?: boolean;
  ariaDescribedByIfNoError?: string;
  info?: Info;
}

export function CustomNumberField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  allowedDecimalPlaces = 2,
  min = 0,
  max = 99999,
  suffix,
  className,
  placeholder,
  stretch = false,
  required,
  ariaDescribedByIfNoError,
  info,
}: CustomNumberFieldProps<TFieldValues, TName>) {
  const registerOptions: RegisterOptions = useMemo(() => {
    return {
      required: "Dieses Feld ist erforderlich",
    };
  }, []);

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name, rules: registerOptions });

  const mask = suffix ? `num ${suffix}` : "num";

  return (
    <div
      className={classNames(
        nsp("custom-input"),
        !stretch && nsp("custom-input--small"),
        error && nsp("custom-input--error"),
        className,
      )}
    >
      <div className={nsp("custom-input-question")}>
        <label className={nsp("custom-input-question__label")} htmlFor={name}>
          {label}
        </label>

        <IMaskInput
          className={nsp("custom-input-question__input")}
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
          onAccept={(value) => {
            if (!value) {
              onChange(null);
            } else {
              onChange(+(value as string));
            }
          }}
          onBlur={onBlur}
          type="text"
          inputMode="numeric"
          name={name}
          id={name}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${name}-error`
              : ariaDescribedByIfNoError
                ? ariaDescribedByIfNoError
                : undefined
          }
          required={required}
        />
        {!!error && (
          <Description id={`${name}-error`} error>
            {error.message}
          </Description>
        )}
      </div>

      {!!info && <InfoDialog info={info} />}
    </div>
  );
}
