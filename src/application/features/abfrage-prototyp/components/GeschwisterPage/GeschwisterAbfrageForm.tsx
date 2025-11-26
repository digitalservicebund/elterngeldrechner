import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { InfoZuFruehgeburten } from "@/application/features/abfrageteil/components/NachwuchsForm/InfoZuFruehgeburten";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import { useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function GeschwisterAbfrageForm({ id, onSubmit }: Props) {
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

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 className="mb-10">Gibt es ältere Geschwisterkinder?</h3>

        <InfoZuFruehgeburten />

        <YesNoRadio
          className="mb-32 mt-20"
          legend=""
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`geschwister.esGibtGeschwister.${0}`}
          errors={errors}
        />
      </div>
    </form>
  );
}
