import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import ErwerbstaetigkeitFormElternteil from "./ErwerbstaetigkeitFormElternteil";
import { ButtonGroup, Split } from "@/components/molecules";
import { useAppSelector } from "@/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { StepErwerbstaetigkeitState } from "@/redux/stepErwerbstaetigkeitSlice";

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
    shouldUnregister: true,
  });
  const { handleSubmit } = methods;

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const handlePageBack = () => navigate("/nachwuchs");

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
