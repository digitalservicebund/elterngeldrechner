import { useCallback, useId } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import { YesNo } from "@/application/features/abfrageteil/state";
import { berechneMaximalenBemessungszeitraum } from "./berechneBemessungszeitraum";
import { ErwerbstaetigkeitCheckboxGroup } from "../../abfrageteil/components/ErwerbstaetigkeitForm/ErwerbstaetigkeitCheckboxGroup";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
};

export function AusklammerungsZeitenForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const pseudonym1Error = get(formState.errors, "pseudonym.ET1") as
    | FieldError
    | undefined;

  // const alleinerziehendenFormValue = watch("alleinerziehend");

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneMaximalenBemessungszeitraum(
    geburtsdatumDesKindes,
  );
  const formattedDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <form
      id={id}
      // className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <h3>Ausklammerungszeiten</h3>

      {/* <ErwerbstaetigkeitCheckboxGroup
        elternteil={"ET1"}
        elternteilName={"Sascha"}
        antragssteller={"FuerBeide"}
      /> */}
    </form>
  );
}
