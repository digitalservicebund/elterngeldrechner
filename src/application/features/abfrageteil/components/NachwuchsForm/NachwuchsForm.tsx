import AddIcon from "@digitalservicebund/icons/Add";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { useCallback, useId } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Counter } from "./Counter";
import { CustomDate } from "./CustomDate";
import { InfoZuFruehgeburten } from "./InfoZuFruehgeburten";
import { InfoZumGeschwisterbonus } from "./InfoZumGeschwisterbonus";
import { Button } from "@/application/components";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import {
  type StepNachwuchsState,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";

const validateMonth = (date: string) => {
  const [inputDay, inputMonth, inputYear] = date.split(".");
  const year = Number.parseInt(inputYear ?? "0");
  const inputDate = new Date(`${year}-${inputMonth}-${inputDay}`);
  const now = new Date(Date.now());
  const dateMaxMonthAgo = new Date(
    now.setUTCFullYear(now.getUTCFullYear() - 3),
  );

  if (inputDate >= dateMaxMonthAgo) {
    return true;
  } else {
    return `Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.`;
  }
};

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepNachwuchsState) => void;
  readonly hideSubmitButton?: boolean;
};

export function NachwuchsForm({ id, onSubmit, hideSubmitButton }: Props) {
  const store = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: store.getState().stepNachwuchs,
  });

  const submitNachwuchs = useCallback(
    (values: StepNachwuchsState) => {
      store.dispatch(stepNachwuchsSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const wahrscheinlichesGeburtsDatumIdentifier = useId();

  const { fields, append, remove } = useFieldArray({
    name: "geschwisterkinder",
    control,
  });

  // Registration as a number is necessary because the addition "numberFutureChildren + 1" is added like a string and results in "21"
  register("anzahlKuenftigerKinder", { valueAsNumber: true });
  const anzahlKuenftigerKinder = watch("anzahlKuenftigerKinder");

  const handleDecrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.max(anzahlKuenftigerKinder - 1, 0),
      { shouldDirty: true },
    );
  const handleIncrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.min(anzahlKuenftigerKinder + 1, 8),
      { shouldDirty: true },
    );

  const handleAppendGeschwisterkind = () =>
    append({
      geburtsdatum: "",
      istBehindert: false,
    });

  const dateOf = (germanDate: string): Date => {
    const [day, month, year] = germanDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const geburtValidation = (date: string) => {
    if (date === "") {
      return true;
    }

    const geburtGeschwisterKind = dateOf(date);
    const wahrscheinlichesGeburtsDatum = getValues(
      "wahrscheinlichesGeburtsDatum",
    );
    const geburtKind = dateOf(wahrscheinlichesGeburtsDatum);

    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.";
    }
  };

  const geschwisterHeadingIdentifier = useId();

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div>
        <label htmlFor={wahrscheinlichesGeburtsDatumIdentifier}>
          Wann ist der Geburtstermin oder das Geburtsdatum von Ihrem Kind?
        </label>

        <InfoZuFruehgeburten />

        <CustomDate
          id={wahrscheinlichesGeburtsDatumIdentifier}
          className="mt-16"
          error={errors.wahrscheinlichesGeburtsDatum?.message}
          {...register("wahrscheinlichesGeburtsDatum", {
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen",
            },
            validate: validateMonth,
          })}
        />
      </div>

      <Counter
        register={register}
        registerOptions={{
          max: {
            value: 8,
            message: "Es können nicht mehr als 8 Kinder angegeben werden",
          },
          min: {
            value: 1,
            message: "Es muss mindestens ein Kind angegeben werden",
          },
          required: "Dieses Feld ist erforderlich",
        }}
        name="anzahlKuenftigerKinder"
        label="Wie viele Kinder werden oder wurden geboren?"
        errors={errors}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        required
      />

      <section
        aria-describedby={geschwisterHeadingIdentifier}
        className="pt-32"
      >
        <h3 id={geschwisterHeadingIdentifier} className="mb-10">
          Gibt es ältere Geschwister?
        </h3>

        <p className="flex justify-between">
          Wenn Sie weitere Kinder haben, die ebenfalls in Ihrem Haushalt leben,
          können Sie vielleicht einen Zuschlag zum Elterngeld bekommen, den
          Geschwisterbonus.
        </p>

        <InfoZumGeschwisterbonus />

        <ul className="m-0 mt-16 list-none p-0">
          {fields.map((field, index) => {
            const headingIdentifier = `${field.id}-heading`;
            const geburtsdatumInputIdentifier = `${field.id}-geburtsdatum`;

            return (
              <li
                key={field.id}
                aria-labelledby={headingIdentifier}
                className="mb-32"
              >
                <h4 id={headingIdentifier} className="mb-10 font-regular">
                  {index + 1}. Geschwisterkind
                </h4>

                <label htmlFor={geburtsdatumInputIdentifier}>
                  Wann wurde das Geschwisterkind geboren?
                </label>

                <CustomDate
                  id={geburtsdatumInputIdentifier}
                  className="mt-16"
                  error={
                    errors.geschwisterkinder?.[index]?.geburtsdatum?.message
                  }
                  {...register(`geschwisterkinder.${index}.geburtsdatum`, {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                    validate: geburtValidation,
                  })}
                />

                <CustomCheckbox
                  register={register}
                  name={`geschwisterkinder.${index}.istBehindert`}
                  label="Das Geschwisterkind hat eine Behinderung"
                />

                <Button
                  className="mt-16"
                  type="button"
                  onClick={() => remove(index)}
                  buttonStyle="link"
                >
                  Geschwisterkind entfernen <ClearIcon />
                </Button>
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          buttonStyle="secondary"
          onClick={handleAppendGeschwisterkind}
        >
          <AddIcon /> {fields.length === 0 ? "Älteres" : "Weiteres"}{" "}
          Geschwisterkind hinzufügen
        </Button>
      </section>

      {!hideSubmitButton && <Button type="submit">Weiter</Button>}
    </form>
  );
}
