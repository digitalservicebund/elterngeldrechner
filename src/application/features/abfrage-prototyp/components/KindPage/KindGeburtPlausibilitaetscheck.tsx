import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { InfoZuGeburtsdatum } from "./InfoZuGeburtsdatum";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
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

export function KindGeburtPlausibilitaetscheck({ id, onSubmit }: Props) {
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

  const geburtsDatumInputIdentifier = useId();

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 className="mb-10">
          Wann war das tatsächliche Geburtsdatum Ihres Kindes?
        </h3>

        <InfoZuGeburtsdatum />

        <label
          className="mb-4 mt-20 block text-16"
          htmlFor={geburtsDatumInputIdentifier}
        >
          Geburtsdatum (TT.MM.JJJJ)
        </label>

        <CustomDate
          id={geburtsDatumInputIdentifier}
          error={errors.kind?.geburtsdatum?.message}
          {...register("kind.geburtsdatum", {
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
