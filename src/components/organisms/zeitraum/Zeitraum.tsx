import {
  AriaAttributes,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  get,
  Path,
  PathValue,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import classNames from "classnames";
import { CustomSelect, SelectOption } from "@/components/molecules";
import { Description } from "@/components/atoms";
import nsp from "@/globals/js/namespace";
import { cloneOptionsList } from "@/components/molecules/custom-select/CustomSelect";
import { zeitraumValueOf, ZeitraumValueType } from "@/globals/js/ZeitraumValue";

interface Props<TFieldValues extends FieldValues> extends AriaAttributes {
  readonly register: UseFormRegister<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly getValues: UseFormGetValues<TFieldValues>;
  readonly setValue: UseFormSetValue<TFieldValues>;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly options: SelectOption[];
  readonly optionsTo?: SelectOption[];
  readonly className?: string;
  readonly suffix?: string;
  readonly type?: ZeitraumValueType;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly onChange?: (v: { from: string; to: string }) => void | undefined;
}

export function Zeitraum<TFieldValues extends FieldValues>({
  register,
  name,
  getValues,
  setValue,
  errors,
  options,
  optionsTo,
  className,
  suffix,
  type = "Date",
  disabled,
  onChange,
  required,
  ...aria
}: Props<TFieldValues>) {
  const fromName = `${name}.from` as Path<TFieldValues>;
  const toName = `${name}.to` as Path<TFieldValues>;
  suffix = suffix ? ` ${suffix}` : "";
  const fromLabel = `von${suffix}`;
  const toLabel = `bis${suffix}`;

  const valueOf = useCallback(
    (value: string) => zeitraumValueOf(value, type),
    [type],
  );

  const allToOptions: SelectOption[] = useMemo(() => {
    return [
      // lists must be cloned to prevent side effects
      ...(optionsTo ? cloneOptionsList(optionsTo) : cloneOptionsList(options)),
    ];
  }, [options, optionsTo]);

  const [toOptions, setToOptions] = useState<SelectOption[]>(() =>
    cloneOptionsList(allToOptions),
  );

  // "from" select box has been changed
  const onChangeFrom = useCallback(
    (fromValue: string) => {
      // recalculates hidden options for "to" field
      setToOptions((toOptions) => {
        // If original "to" options (allToOptions) are hidden, then they are dates from other rows.
        // These must always remain hidden.
        // Shown "to" options must before next hidden original "to" option (from allToOptions).
        const nextHiddenToValue = allToOptions
          // check only hidden options
          .filter((allToOption) => allToOption.hidden)
          // must greater than selected "from" option
          .filter(
            (allToOption) => valueOf(allToOption.value) > valueOf(fromValue),
          )
          // find the minimum
          .reduce(
            (prev: SelectOption, curr: SelectOption) =>
              valueOf(prev.value) < valueOf(curr.value) ? prev : curr,
            // start value is a maximum date
            { label: "", value: "9999-12-31" },
          );

        // recalculate hidden "to" options
        toOptions.forEach((toOption, index) => {
          const toOptionCanBeShown = !allToOptions[index].hidden;
          const toOptionIsRealValue = toOption.value !== "";
          if (toOptionCanBeShown && toOptionIsRealValue) {
            const beforeNextHiddenToValue =
              valueOf(toOption.value) < valueOf(nextHiddenToValue.value);
            if (beforeNextHiddenToValue) {
              const fromOptionIsRealValue = fromValue !== "";
              toOption.hidden =
                fromOptionIsRealValue &&
                valueOf(toOption.value) < valueOf(fromValue);
            } else {
              toOption.hidden = true;
            }
          }
        });

        // check and set current selected "to" value
        const to = getValues(toName) as string;
        const currentToIsInList =
          toOptions.find(
            (anvalibleOption) =>
              !anvalibleOption.hidden && anvalibleOption.value === to,
          ) !== undefined;
        if (!currentToIsInList) {
          // set selected "to" option to "Bitte wählen"
          setValue(toName, "" as PathValue<TFieldValues, Path<TFieldValues>>);
        }

        // returns new "to" options
        return [...toOptions];
      });

      // calls the outside "onChange" function
      const to = getValues(toName) as string;
      if (onChange) {
        if (valueOf(to) < valueOf(fromValue) || fromValue === "") {
          onChange({ from: fromValue, to: "" });
        } else {
          onChange({ from: fromValue, to: to });
        }
      }

      setFromValue(fromValue);
    },
    [allToOptions, getValues, onChange, setValue, toName, valueOf],
  );

  // "to" select box has been changed
  const onChangeTo = useCallback(
    (toValue: string) => {
      // calls the outside "onChange" function
      if (onChange) {
        onChange({ from: getValues(fromName), to: toValue });
      }
      setToValue(toValue);
    },
    [fromName, getValues, onChange],
  );

  const zeitraumToRegisterOptions: RegisterOptions<TFieldValues> = useMemo(
    () => ({
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        onChangeTo(event.target.value),
      validate: {
        requireFromAndTo: (toValue) => {
          const hasToValue = toValue !== "";
          const hasFromValue = getValues(fromName) !== "";

          if (hasToValue && hasFromValue) {
            return true;
          }
          if (!hasFromValue && !hasToValue) {
            return "Feld 'von' und 'bis' sind erforderlich";
          }
          if (!hasFromValue) {
            return "Feld 'von' ist erforderlich";
          }
          if (!hasToValue) {
            return "Feld 'bis' ist erforderlich";
          }
        },
        fromIsBeforeTo: (toValue) => {
          const fromValue = getValues(fromName);

          if (toValue === "" || fromValue === "") {
            return true;
          }

          const fromTime = valueOf(fromValue);
          const toTime = valueOf(toValue as string);

          return fromTime <= toTime || "Zeitraum 'bis' muss nach 'von' liegen";
        },
      },
    }),
    [onChangeTo, getValues, fromName, valueOf],
  );

  const zeitraumFromRegisterOptions: RegisterOptions<TFieldValues> = useMemo(
    () => ({
      deps: [toName],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        onChangeFrom(event.target.value),
    }),
    [onChangeFrom, toName],
  );

  const error = get(errors, toName) as FieldError | undefined;

  const [toValue, setToValue] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("");

  return (
    <section className={classNames(nsp("zeitraum"), className)}>
      <div className={nsp("zeitraum__controls")}>
        <CustomSelect
          register={register}
          registerOptions={zeitraumFromRegisterOptions}
          name={fromName}
          label={fromLabel}
          options={options}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          required={required}
          {...aria}
        />
        <CustomSelect
          register={register}
          registerOptions={zeitraumToRegisterOptions}
          name={toName}
          label={toLabel}
          options={toOptions}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          required={required}
          {...aria}
        />
        <p id={name} className="sr-only">
          {fromValue && toValue
            ? `im Zeitraum ${fromLabel} ${fromValue} ${toLabel} ${toValue} :`
            : ""}
        </p>
      </div>
      {!!error && (
        <Description id={`${toName}-error`} error>
          {error.message}
        </Description>
      )}
    </section>
  );
}
