import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { InfoZuET } from "./InfoZuET";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { Counter } from "@/application/features/abfrageteil/components/NachwuchsForm/Counter";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
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

export function KindGeburtNichtErfolgtForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const {
    register,
    handleSubmit,
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

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 id={wahrscheinlichesGeburtsDatumDescriptionIdentifier}>
          Wie viele Kinder werden oder wurden geboren?
        </h3>

        <p className="mt-10 pb-20">
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
          name="kind.anzahlKuenftigerKinder"
          label="Anzahl der Kinder"
          errors={errors}
          required
        />
      </div>

      <div className="mt-20">
        <h3 className="mb-10">
          Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
        </h3>

        <InfoZuET />

        <label
          className="mb-4 mt-20 block text-16"
          htmlFor={wahrscheinlichesGeburtsDatumInputIdentifier}
        >
          Errechneter Entbindungstermin (TT.MM.JJJJ)
        </label>

        <CustomDate
          id={wahrscheinlichesGeburtsDatumInputIdentifier}
          error={errors.kind?.errechneterGeburtstermin?.message}
          aria-describedby={wahrscheinlichesGeburtsDatumDescriptionIdentifier}
          {...register("kind.errechneterGeburtstermin", {
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen",
            },
            validate: validateMonth,
          })}
        />
      </div>
    </form>
  );
}
