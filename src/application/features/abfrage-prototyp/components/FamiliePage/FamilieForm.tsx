import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { InfoZumEinkommenslimit } from "@/application/features/abfrageteil/components/EinkommenForm/InfoZumEinkommenslimit";
import {
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import { bundeslaender } from "@/application/features/pdfAntrag";
import { useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
};

export function FamilieForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (bundesland) => ({ value: bundesland.name, label: bundesland.name }),
  );

  return (
    <form
      id={id}
      className="flex flex-col gap-40"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 className="mb-10">
          In welchem Bundesland wollen Sie Elterngeld beantragen?
        </h3>

        <CustomSelect
          autoWidth
          register={register}
          registerOptions={{
            required: "Ein Bundesland muss ausgewählt sein",
          }}
          name="familie.bundesland"
          label="Bundesland"
          errors={formState.errors}
          options={bundeslandOptions}
          required
        />
      </div>

      <div>
        <h3 className="mb-10">
          Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr
          als 175.000 Euro?
        </h3>

        <YesNoRadio
          className="mb-32"
          legend=""
          slotBetweenLegendAndOptions={<InfoZumEinkommenslimit />}
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="familie.limitEinkommenUeberschritten"
          errors={formState.errors}
        />
      </div>
    </form>
  );
}
