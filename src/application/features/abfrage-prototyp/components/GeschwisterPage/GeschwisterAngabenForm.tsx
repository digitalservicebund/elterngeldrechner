import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly geschwisterIndex: number;
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function GeschwisterAngabenForm({
  geschwisterIndex,
  id,
  onSubmit,
}: Props) {
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

  const dateOf = (germanDate: string): Date => {
    const [day, month, year] = germanDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const geburtKind = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );

  const geburtValidation = (date: string) => {
    if (date === "") {
      return true;
    }

    const geburtGeschwisterKind = dateOf(date);
    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.";
    }
  };

  const geburtsdatumInputIdentifier = `geschwisterkind${geschwisterIndex}-geburtsdatum`;

  const geschwisterIndexAusgeschrieben = (geschwisterIndex: number) => {
    switch (geschwisterIndex) {
      case 1:
        return "erstes";
      case 2:
        return "zweites";
      case 3:
        return "drittes";
      case 4:
        return "viertes";
      case 5:
        return "fünftes";
      case 6:
        return "sechstes";
      case 7:
        return "siebtes";
      case 8:
        return "achtes";
      default:
        return "";
    }
  };

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 className="mb-10">Wann wurde das Geschwisterkind geboren?</h3>

        <label
          className="mb-4 mt-20 block text-16"
          htmlFor={geburtsdatumInputIdentifier}
        >
          Geburtsdatum (TT.MM.JJJJ)
        </label>

        <CustomDate
          id={geburtsdatumInputIdentifier}
          error={
            errors.geschwister?.geschwisterkinder?.[geschwisterIndex - 1]
              ?.geburtsdatum?.message
          }
          {...register(
            `geschwister.geschwisterkinder.${geschwisterIndex - 1}.geburtsdatum`,
            {
              required: "Dieses Feld ist erforderlich",
              pattern: {
                value: /^\d{2}\.\d{2}\.\d{4}$/,
                message: "Bitte das Feld vollständig ausfüllen",
              },
              validate: geburtValidation,
            },
          )}
        />

        <div className="mt-40">
          <h3 className="mb-10">Hat das Geschwisterkind eine Behinderung?</h3>

          <YesNoRadio
            className="mb-32 mt-20"
            legend=""
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name={`geschwister.geschwisterkinder.${geschwisterIndex - 1}.istBehindert`}
            errors={errors}
          />
        </div>

        <div className="mt-40">
          <h3 className="mb-10">
            Gibt es noch ein{" "}
            {geschwisterIndexAusgeschrieben(geschwisterIndex + 1)}{" "}
            Geschwisterkind?
          </h3>

          <YesNoRadio
            className="mb-32 mt-20"
            legend=""
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name={`geschwister.esGibtGeschwister.${geschwisterIndex}`}
            errors={errors}
          />
        </div>
      </div>
    </form>
  );
}
