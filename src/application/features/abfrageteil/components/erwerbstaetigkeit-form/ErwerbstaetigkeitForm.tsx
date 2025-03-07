import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import ErwerbstaetigkeitFormElternteil from "./ErwerbstaetigkeitFormElternteil";
import { ButtonGroup, Split } from "@/application/components";
import {
  type StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
  stepAllgemeineAngabenSelectors,
  stepErwerbstaetigkeitSlice,
} from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";

type Props = {
  readonly onSubmit?: () => void;
};

export function ErwerbstaetigkeitForm({ onSubmit }: Props) {
  const store = useAppStore();

  const methods = useForm({
    defaultValues: store.getState().stepErwerbstaetigkeit,
  });
  const { handleSubmit, setValue } = methods;

  const submitErwerbstaetigkeit = useCallback(
    (values: StepErwerbstaetigkeitState) => {
      store.dispatch(stepErwerbstaetigkeitSlice.actions.submitStep(values));
      onSubmit?.();
    },
    [store, onSubmit],
  );

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  const { ET1, ET2 } = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const navigate = useNavigate();
  const handlePageBack = () => navigate("/nachwuchs");

  // reset state if ET2 is not displayed anymore
  useEffect(() => {
    if (antragssteller !== "FuerBeide") {
      setValue("ET2", initialStepErwerbstaetigkeitElternteil);
    }
  }, [antragssteller, setValue]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitErwerbstaetigkeit)} noValidate>
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
