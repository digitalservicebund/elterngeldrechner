import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import {
  Ausklammerung,
  berechneExaktenBemessungszeitraum,
} from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";
import { InfoZuTaetigkeiten } from "./InfoZuTaetigkeiten";
import { YesNoRadio } from "../../abfrageteil/components/common";
import { YesNo } from "../../abfrageteil/state";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasMehrereTaetigkeiten?: YesNo | null,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
};

export function EinkommenAngabenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
}: Props) {
  const store = useAppStore();

  const { handleSubmit, register, formState, getValues } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAnzahlTaetigkeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(
        values,
        undefined,
        undefined,
        undefined,
        getValues("hasMehrereTaetigkeiten"),
      );
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
    auszuklammerndeZeitraeume ?? [],
  );

  return (
    <form id={id} onSubmit={handleSubmit(submitAnzahlTaetigkeiten)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>
        <h3 className="my-16">Einkommen</h3>

        <YesNoRadio
          className="mb-32"
          legend=""
          slotBetweenLegendAndOptions={<InfoZuTaetigkeiten />}
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="hasMehrereTaetigkeiten"
          errors={formState.errors}
        />
      </div>
    </form>
  );
}
