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
    if (getValues("isSelbststaendig")) {
      if (getValues("isNichtSelbststaendig")) {
        return PersonPageFlow.mischeinkuenfte;
      }
      return PersonPageFlow.selbststaendig;
    } else if (getValues("isNichtSelbststaendig")) {
      if (getValues("hasKeinEinkommen") && getValues("hasSozialleistungen")) {
        return PersonPageFlow.nichtSelbststaendigBeides;
      } else if (getValues("hasKeinEinkommen")) {
        return PersonPageFlow.nichtSelbststaendigKeinEinkommen;
      } else if (getValues("hasSozialleistungen")) {
        return PersonPageFlow.nichtSelbststaendigErsatzleistungen;
      }
      return PersonPageFlow.nichtSelbststaendig;
    } else if (
      getValues("hasKeinEinkommen") &&
      getValues("hasSozialleistungen")
    ) {
      return PersonPageFlow.sozialleistungenKeinEinkommen;
    } else if (getValues("hasKeinEinkommen")) {
      return PersonPageFlow.keinEinkommen;
    } else if (getValues("hasSozialleistungen")) {
      return PersonPageFlow.sozialleistungen;
    }
    return undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit(submitNachwuchs)} noValidate>
      <div className="mt-40">
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
          labelHeading="Ich war in diesem Zeitraum nicht-selbstständig"
          label="zum Beispiel angestellt: ob in Vollzeit, Teilzeit, als Minijob, in Ausbildung, Freiwilligendienst oder als Beamter/Beamtin."
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="isSelbststaendig"
          labelHeading="Ich war in diesem Zeitraum selbstständig"
          label="zum Beispiel freiberuflich, mit Gewerbe, als Honorarkraft, mit Land- oder Forstbetrieb"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="hasSozialleistungen"
          labelHeading="Ich habe Sozialleistungen oder Lohnersatzleistungen erhalten"
          label="zum Beispiel BAföG, Bürgergeld, Arbeitslosengeld, Krankengeld oder Elterngeld."
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name="hasKeinEinkommen"
          labelHeading="Ich hatte in diesem Zeitraum kein Einkommen"
          label="zum Beispiel während eines Studiums, unbezahlter Urlaub oder Pflegezeiten."
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
