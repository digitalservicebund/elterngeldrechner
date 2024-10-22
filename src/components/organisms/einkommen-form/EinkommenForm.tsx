import { useEffect } from "react";
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
import { SplitItem } from "@/components/atoms";
import { infoTexts } from "@/components/molecules/info-dialog";
import { YesNo } from "@/globals/js/calculations/model";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

interface Props {
  readonly initialValues: StepEinkommenState;
  readonly onSubmit: SubmitHandler<StepEinkommenState>;
  readonly handleDirtyForm: (isFormDirty: boolean, dirtyFields: object) => void;
}

export function EinkommenForm({
  initialValues,
  onSubmit,
  handleDirtyForm,
}: Props) {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues: initialValues });
  const { isDirty, dirtyFields, errors } = methods.formState;

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

  useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);

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
            <SplitItem>
              <EinkommenFormElternteil elternteil="ET1" elternteilName={ET1} />
            </SplitItem>
            {antragstellende === "FuerBeide" && (
              <SplitItem hasDivider>
                <EinkommenFormElternteil
                  elternteil="ET2"
                  elternteilName={ET2}
                />
              </SplitItem>
            )}
          </Split>
          <ButtonGroup onClickBackButton={handlePageBack} />
        </form>
      </FormProvider>
    </>
  );
}
