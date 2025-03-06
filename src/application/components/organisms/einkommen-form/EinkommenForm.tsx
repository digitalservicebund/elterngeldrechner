import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { EinkommenFormElternteil } from "./EinkommenFormElternteil";
import {
  ButtonGroup,
  Split,
  YesNoRadio,
} from "@/application/components/molecules";
import { useAppSelector } from "@/application/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/application/redux/stepAllgemeineAngabenSlice";
import { StepEinkommenState } from "@/application/redux/stepEinkommenSlice";
import { YesNo } from "@/application/redux/yes-no";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/elterngeldrechner/model/egr-berechnung-param-id";

interface Props {
  readonly initialValues: StepEinkommenState;
  readonly onSubmit: SubmitHandler<StepEinkommenState>;
}

const einkommenLimitUeberschrittenInfoText =
  "Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 200.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen.";

export function EinkommenForm({ initialValues, onSubmit }: Props) {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues: initialValues });
  const { errors } = methods.formState;

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

  const handlePageBack = () => navigate("/erwerbstaetigkeit");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
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

        <ButtonGroup onClickBackButton={handlePageBack} />
      </form>
    </FormProvider>
  );
}
