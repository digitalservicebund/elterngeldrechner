import classNames from "classnames";
import {
  AriaAttributes,
  type ChangeEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { type ZeitraumValueType, zeitraumValueOf } from "./ZeitraumUtil";
import {
  CustomSelect,
  SelectOption,
  cloneOptionsList,
} from "@/components/molecules";

interface Props<TFieldValues extends FieldValues> extends AriaAttributes {
  readonly register: UseFormRegister<TFieldValues>;
  readonly listingIndex: number;
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
  listingIndex,
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
    (event: ChangeEvent<HTMLInputElement>) => {
      const fromValue = event.target.value;

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
          const toOptionCanBeShown = !(allToOptions[index]?.hidden ?? false);
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
    (event: ChangeEvent<HTMLInputElement>) => {
      const toValue = event.target.value;

      // calls the outside "onChange" function
      if (onChange) {
        onChange({ from: getValues(fromName), to: toValue });
      }
      setToValue(toValue);
    },
    [fromName, getValues, onChange],
  );

  const valuesMakeUpValidZeitraum = useCallback(() => {
    const fromValue = getValues(fromName);
    const toValue = getValues(toName);

    if (toValue === "" || fromValue === "") {
      return true;
    }

    const fromTime = valueOf(fromValue);
    const toTime = valueOf(toValue as string);

    return fromTime <= toTime || "Zeitraum 'bis' muss nach 'von' liegen";
  }, [fromName, toName, getValues, valueOf]);

  const zeitraumToRegisterOptions: RegisterOptions<TFieldValues> = useMemo(
    () => ({
      onChange: onChangeTo,
      required: "Feld 'bis' ist erforderlich",
    }),
    [onChangeTo],
  );

  const zeitraumFromRegisterOptions: RegisterOptions<TFieldValues> = useMemo(
    () => ({
      deps: [toName],
      onChange: onChangeFrom,
      validate: { valuesMakeUpValidZeitraum },
      required: "Feld 'von' ist erforderlich",
    }),
    [toName, onChangeFrom, valuesMakeUpValidZeitraum],
  );

  const [toValue, setToValue] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("");

  return (
    <fieldset className={classNames("mb-16", className)}>
      <legend className="sr-only">{listingIndex}. Zeitraum</legend>

      <div className="flex w-full flex-wrap gap-16">
        <CustomSelect
          register={register}
          registerOptions={zeitraumFromRegisterOptions}
          name={fromName}
          label={fromLabel}
          errors={errors}
          options={options}
          disabled={disabled}
          required={required}
          className="flex-1"
          {...aria}
        />
        <CustomSelect
          register={register}
          registerOptions={zeitraumToRegisterOptions}
          name={toName}
          label={toLabel}
          options={toOptions}
          errors={errors}
          disabled={disabled}
          required={required}
          className="flex-1"
          {...aria}
        />
        <p id={name} className="sr-only">
          {fromValue && toValue
            ? `im Zeitraum ${fromLabel} ${fromValue} ${toLabel} ${toValue} :`
            : ""}
        </p>
      </div>
    </fieldset>
  );
}
