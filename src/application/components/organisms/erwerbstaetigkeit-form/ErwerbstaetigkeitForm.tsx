import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import ErwerbstaetigkeitFormElternteil from "./ErwerbstaetigkeitFormElternteil";
import { ButtonGroup, Split } from "@/application/components/molecules";
import { useAppSelector } from "@/application/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/application/redux/stepAllgemeineAngabenSlice";
import {
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/application/redux/stepErwerbstaetigkeitSlice";

interface ErwerbstaetigkeitFormProps {
  readonly initialValues: StepErwerbstaetigkeitState;
  readonly onSubmit: SubmitHandler<StepErwerbstaetigkeitState>;
}

export function ErwerbstaetigkeitForm({
  initialValues,
  onSubmit,
}: ErwerbstaetigkeitFormProps) {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: initialValues,
  });
  const { handleSubmit, setValue } = methods;

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const handlePageBack = () => navigate("/nachwuchs");

  // reset state if ET2 is not displayed anymore
  useEffect(() => {
    if (antragssteller !== "FuerBeide") {
      setValue("ET2", initialStepErwerbstaetigkeitElternteil);
    }
  }, [antragssteller, setValue]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Split>
          <ErwerbstaetigkeitFormElternteil
            elternteil="ET1"
            elternteilName={ET1}
            antragssteller={antragssteller}
          />

          {antragssteller === "FuerBeide" && (
            <ErwerbstaetigkeitFormElternteil
              elternteil="ET2"
              elternteilName={ET2}
              antragssteller={antragssteller}
            />
          )}
        </Split>
        <ButtonGroup onClickBackButton={handlePageBack} />
      </form>
    </FormProvider>
  );
}
