import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import { YesNo } from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function KindAbgabeGeburtForm({ id, onSubmit }: Props) {
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
      if (values.kind.geburtIstErfolgt === YesNo.NO) {
        values.kind.geburtsdatum = "";
      }
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
        <h3 className="mb-10">Ist Ihr Kind schon geboren?</h3>

        <YesNoRadio
          className="mb-32"
          legend=""
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="kind.geburtIstErfolgt"
          errors={errors}
        />
      </div>
    </form>
  );
}
