import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { EinkommenFormElternteil } from "./EinkommenFormElternteil";
import { InfoZumEinkommenslimit } from "./InfoZumEinkommenslimit";
import { Button } from "@/application/components";
import {
  Split,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  type StepEinkommenState,
  stepAllgemeineAngabenSelectors,
  stepEinkommenSlice,
} from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { MAX_EINKOMMEN } from "@/elterngeldrechner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: () => void;
  readonly hideSubmitButton?: boolean;
};

export function EinkommenForm({ id, onSubmit, hideSubmitButton }: Props) {
  const store = useAppStore();
  const methods = useForm({ defaultValues: store.getState().stepEinkommen });
  const { errors } = methods.formState;

  const submitEinkommen = useCallback(
    (values: StepEinkommenState) => {
      store.dispatch(stepEinkommenSlice.actions.submitStep(values));
      onSubmit?.();
    },
    [store, onSubmit],
  );

  const antragstellende = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );
  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );
  const limitEinkommenUeberschrittenLegend =
    antragstellende === "FuerBeide" ? (
      <>
        Hatten {ET1} und {ET2} im Kalenderjahr vor der Geburt ein
        Gesamteinkommen von zusammen mehr als{" "}
        {MAX_EINKOMMEN.toLocaleString("de-DE")} Euro?
      </>
    ) : (
      <>
        Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr
        als {MAX_EINKOMMEN.toLocaleString("de-DE")} Euro?
      </>
    );

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(submitEinkommen)} noValidate>
        <YesNoRadio
          className="mb-32"
          legend={limitEinkommenUeberschrittenLegend}
          slotBetweenLegendAndOptions={<InfoZumEinkommenslimit />}
          register={methods.register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="limitEinkommenUeberschritten"
          errors={errors}
        />

        <Split>
          <EinkommenFormElternteil
            elternteil="ET1"
            elternteilName={ET1}
            antragstellende={antragstellende}
          />

          {antragstellende === "FuerBeide" && (
            <EinkommenFormElternteil
              elternteil="ET2"
              elternteilName={ET2}
              antragstellende={antragstellende}
            />
          )}
        </Split>

        {!hideSubmitButton && <Button type="submit">Weiter</Button>}
      </form>
    </FormProvider>
  );
}
