import { VFC, useEffect } from "react";
import { useNavigate } from "react-router";
import { StepEinkommenState } from "../../../redux/stepEinkommenSlice";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "../../../redux/hooks";
import { EinkommenFormElternteil } from "./EinkommenFormElternteil";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import { ButtonGroup, Split } from "../../molecules";
import { SplitItem } from "../../atoms";

interface Props {
  initialValues: StepEinkommenState;
  onSubmit: SubmitHandler<StepEinkommenState>;
  handleDirtyForm: (isFormDirty: boolean, dirtyFields: object) => void;
}

export const EinkommenForm: VFC<Props> = ({
  initialValues,
  onSubmit,
  handleDirtyForm,
}) => {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues: initialValues });
  const { isDirty, dirtyFields } = methods.formState;

  const antragstellende = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );
  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const handlePageBack = () => navigate("/erwerbstaetigkeit");

  useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);

  return (
    <>
      <h3>Ihr Einkommen</h3>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Split>
            <SplitItem>
              <EinkommenFormElternteil elternteil="ET1" elternteilName={ET1} />
            </SplitItem>
            {antragstellende === "FuerBeide" && (
              <SplitItem hasDivider={true}>
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
};
