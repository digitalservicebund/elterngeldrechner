import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { EinkommenFormElternteil } from "./EinkommenFormElternteil";
import { Button } from "@/application/components";
import {
  Split,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  type StepEinkommenState,
  YesNo,
  stepAllgemeineAngabenSelectors,
  stepEinkommenSlice,
} from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/elterngeldrechner/model/egr-berechnung-param-id";

const einkommenLimitUeberschrittenInfoText =
  "Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 200.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen.";

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
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend,
  );

  const amountLimitEinkommen =
    alleinerziehend === YesNo.YES ? MAX_EINKOMMEN_ALLEIN : MAX_EINKOMMEN_BEIDE;

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(submitEinkommen)} noValidate>
        <YesNoRadio
          className="mb-32"
          legend={`Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als ${amountLimitEinkommen.toLocaleString()} Euro?`}
          info={einkommenLimitUeberschrittenInfoText}
          register={methods.register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name="limitEinkommenUeberschritten"
          errors={errors}
        />

        <Split>
          <EinkommenFormElternteil elternteil="ET1" elternteilName={ET1} />

          {antragstellende === "FuerBeide" && (
            <EinkommenFormElternteil elternteil="ET2" elternteilName={ET2} />
          )}
        </Split>

        {!hideSubmitButton && <Button label="Weiter" isSubmitButton />}
      </form>
    </FormProvider>
  );
}
