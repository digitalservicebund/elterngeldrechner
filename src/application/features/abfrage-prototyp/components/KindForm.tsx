import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { Counter } from "@/application/features/abfrageteil/components/NachwuchsForm/Counter";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
import { InfoZuFruehgeburten } from "@/application/features/abfrageteil/components/NachwuchsForm/InfoZuFruehgeburten";
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
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function KindForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const wahrscheinlichesGeburtsDatumInputIdentifier = useId();
  const wahrscheinlichesGeburtsDatumDescriptionIdentifier = useId();

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

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div>
        <h3 id={wahrscheinlichesGeburtsDatumDescriptionIdentifier}>
          Wann ist der Geburtstermin oder das Geburtsdatum von Ihrem Kind?
        </h3>

        <label
          className="mt-20 block text-16"
          htmlFor={wahrscheinlichesGeburtsDatumInputIdentifier}
        >
          Geburtsdatum
        </label>

        <CustomDate
          id={wahrscheinlichesGeburtsDatumInputIdentifier}
          error={errors.wahrscheinlichesGeburtsDatum?.message}
          aria-describedby={wahrscheinlichesGeburtsDatumDescriptionIdentifier}
          {...register("wahrscheinlichesGeburtsDatum", {
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen",
            },
            validate: validateMonth,
          })}
        />

        <InfoZuFruehgeburten />
      </div>

      <div>
        <h3 id={wahrscheinlichesGeburtsDatumDescriptionIdentifier}>
          Wie viele Kinder werden oder wurden geboren?
        </h3>

        <p className="pb-20">
          Bei der Geburt von mehreren Kindern geben Sie bitte die Anzahl der
          Kinder an (zum Beispiel 2 bei Zwillingen).
        </p>

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
          label=""
          errors={errors}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          required
        />
      </div>
    </form>
  );
}
