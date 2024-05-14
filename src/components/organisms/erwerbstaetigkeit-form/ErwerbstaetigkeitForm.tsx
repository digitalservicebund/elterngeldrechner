import { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "../../../redux/stepErwerbstaetigkeitSlice";
import ErwerbstaetigkeitFormElternteil from "./ErwerbstaetigkeitFormElternteil";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import { useAppSelector } from "../../../redux/hooks";
import { ButtonGroup, Split } from "../../molecules";
import { SplitItem } from "../../atoms";

interface ErwerbstaetigkeitFormProps {
  initialValues: StepErwerbstaetigkeitState;
  onSubmit: SubmitHandler<StepErwerbstaetigkeitState>;
  handleDirtyForm: (isFormDirty: boolean, dirtyFields: object) => void;
}

export const ErwerbstaetigkeitForm: FC<ErwerbstaetigkeitFormProps> = ({
  initialValues,
  onSubmit,
  handleDirtyForm,
}) => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: initialValues,
  });
  const { handleSubmit, reset, getValues } = methods;
  const { isDirty, dirtyFields } = methods.formState;

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const handlePageBack = () => navigate("/nachwuchs");

  useEffect(() => {
    handleDirtyForm(isDirty, dirtyFields);
  }, [isDirty, dirtyFields, handleDirtyForm]);

  // reset state if ET2 is not displayed any more
  useEffect(() => {
    if (antragssteller !== "FuerBeide") {
      reset({
        ...getValues(),
        ET2: initialStepErwerbstaetigkeitElternteil,
      });
    }
  }, [reset, antragssteller, getValues]);

  return (
    <>
      <h3>
        Erwerbstätigkeit{antragssteller === "EinenElternteil" ? " *" : ""}
      </h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Split>
            <SplitItem>
              <ErwerbstaetigkeitFormElternteil
                elternteil="ET1"
                elternteilName={ET1}
                antragssteller={antragssteller}
              />
            </SplitItem>
            {antragssteller === "FuerBeide" && (
              <SplitItem hasDivider={true}>
                <ErwerbstaetigkeitFormElternteil
                  elternteil="ET2"
                  elternteilName={ET2}
                  antragssteller={antragssteller}
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
