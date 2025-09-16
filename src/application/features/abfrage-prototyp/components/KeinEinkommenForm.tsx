import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { PersonPageFlow } from "./PersonPageRouting";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
};

export function KeinEinkommenForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const { handleSubmit } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  return (
    <form
      id={id}
      // className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <h3>Kein Einkommen</h3>

      {/* <ErwerbstaetigkeitCheckboxGroup
        elternteil={"ET1"}
        elternteilName={"Sascha"}
        antragssteller={"FuerBeide"}
      /> */}
    </form>
  );
}
