import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { EinkommenFormElternteil } from "./EinkommenFormElternteil";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { useAppSelector } from "@/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import {
  ButtonGroup,
  Split,
  FormFieldGroup,
  YesNoRadio,
} from "@/components/molecules";
import { infoTexts } from "@/components/molecules/info-dialog";
import { YesNo } from "@/globals/js/calculations/model";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

interface Props {
  readonly initialValues: StepEinkommenState;
  readonly onSubmit: SubmitHandler<StepEinkommenState>;
}

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
    <>
      <h2 className="mb-10">Ihr Einkommen</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <FormFieldGroup
            data-testid="egr-anspruch"
            description={`Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als ${amountLimitEinkommen.toLocaleString()} Euro?`}
            info={infoTexts.einkommenLimitÜberschritten}
          >
            <YesNoRadio
              register={methods.register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="limitEinkommenUeberschritten"
              errors={errors}
              required
            />
          </FormFieldGroup>

          <Split>
            <EinkommenFormElternteil elternteil="ET1" elternteilName={ET1} />

            {antragstellende === "FuerBeide" && (
              <EinkommenFormElternteil elternteil="ET2" elternteilName={ET2} />
            )}
          </Split>
          <ButtonGroup onClickBackButton={handlePageBack} />
        </form>
      </FormProvider>
    </>
  );
}
