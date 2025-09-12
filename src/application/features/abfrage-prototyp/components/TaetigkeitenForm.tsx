import { useCallback, useId } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import {
  CustomCheckbox,
  Description,
} from "@/application/features/abfrageteil/components/common";
import { berechneMaximalenBemessungszeitraum } from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    flow?: PersonPageFlow,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil?: Elternteil;
};

export function TaetigkeitenForm({ id, onSubmit }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, personPageFlow());
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneMaximalenBemessungszeitraum(
    geburtsdatumDesKindes,
  );

  function isAnyOptionSelected(): true | string {
    const anyOptionIsSelected = (
      [
        "isNichtSelbststaendig",
        "isSelbststaendig",
        "hasSozialleistungen",
        "hasKeinEinkommen",
      ] as const
    ).some((fieldName) => getValues(fieldName));

    return anyOptionIsSelected || "Bitte wählen sie mindestens ein Feld aus.";
  }

  const error = get(formState.errors, "isNichtSelbststaendig") as
    | FieldError
    | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const personPageFlow = () => {
    if (getValues("hasKeinEinkommen")) {
      return PersonPageFlow.keinEinkommen;
    } else if (getValues("hasSozialleistungen")) {
      return PersonPageFlow.sozialleistungen;
    } else if (
      getValues("isSelbststaendig") &&
      getValues("isNichtSelbststaendig")
    ) {
      return PersonPageFlow.mischeinkuenfte;
    } else if (getValues("isSelbststaendig")) {
      return PersonPageFlow.selbststaendig;
    } else if (getValues("isNichtSelbststaendig")) {
      return PersonPageFlow.nichtSelbststaendig;
    }
    return undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit(submitNachwuchs)} noValidate>
      <div>
        <h3 className="mb-16">
          Welche Tätigkeiten hatten Sie:
          <ul className="list list-disc ml-40">
            <li>{maximalerBemessungszeitraum[0]}</li>
            <li>{maximalerBemessungszeitraum[1]}</li>
          </ul>
        </h3>
        <p>
          Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld
          festzulegen. Der Bemessungszeitraum ist die Zeit vor der Geburt, in
          der Ihr Einkommen geprüft wird. Daraus wird die Höhe Ihres
          Elterngeldes berechnet.
        </p>
      </div>

      <div className="mt-32">
        <CustomCheckbox
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="isNichtSelbststaendig"
          label="Ich war in diesem Zeitraum nicht-selbstständig"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-20"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="isSelbststaendig"
          label="Ich war in diesem Zeitraum selbstständig"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-20"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="hasSozialleistungen"
          label="Ich habe Sozialleistungen oder Lohnersatzleistungen erhalten"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-20"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="hasKeinEinkommen"
          label="Ich hatte in diesem Zeitraum kein Einkommen"
          errors={hasError}
        />

        {!!hasError && (
          <Description id={errorIdentifier} error>
            {error.message}
          </Description>
        )}
      </div>
    </form>
  );
}
