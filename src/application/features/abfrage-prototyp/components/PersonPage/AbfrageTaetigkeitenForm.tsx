import { useCallback, useId } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import { InfoZuTaetigkeiten } from "@/application/features/abfrage-prototyp/components/InfoZuTaetigkeiten";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import { berechneMaximalenBemessungszeitraum } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import {
  CustomCheckbox,
  Description,
} from "@/application/features/abfrageteil/components/common";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil?: Elternteil;
  readonly flow?: PersonPageFlow;
};

export function AbfrageTaetigkeitenForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
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
    const person = elternteil === Elternteil.Eins ? "ET1" : "ET2";
    const anyOptionIsSelected = (
      [
        `${person}.isNichtSelbststaendig`,
        `${person}.isSelbststaendig`,
        `${person}.isBeamtet`,
        `${person}.hasSozialleistungen`,
        `${person}.hasKeinEinkommen`,
      ] as const
    ).some((fieldName) => getValues(fieldName));

    return anyOptionIsSelected || "Bitte wählen sie mindestens ein Feld aus.";
  }

  const error = get(
    formState.errors,
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.isNichtSelbststaendig`,
  ) as FieldError | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  return (
    <form id={id} onSubmit={handleSubmit(submitNachwuchs)} noValidate>
      <div className="mb-10 mt-40">
        <h3 className="mb-16">
          Bitte wählen Sie alles aus, was auf Sie zutrifft.
        </h3>
        <div
          className="rounded bg-grey-light p-20"
          aria-live="polite"
          aria-labelledby="bmz"
        >
          <ul className="list ml-40 list-disc">
            <li className="text-28">{maximalerBemessungszeitraum[0]}</li>
          </ul>
        </div>
      </div>

      <InfoZuTaetigkeiten />

      <div className="mt-32">
        <CustomCheckbox
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.isNichtSelbststaendig`}
          labelHeading="Ich war oder bin angestellt"
          label="zum Beispiel in Vollzeit, Teilzeit, als Minijob, in Ausbildung, Freiwilligendienst"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.isSelbststaendig`}
          labelHeading="Ich war oder bin selbstständig"
          label="zum Beispiel freiberuflich, mit Gewerbe oder Land- oder Forstbetrieb"
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.isBeamtet`}
          labelHeading="Ich war oder bin Beamtin"
          label=""
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasSozialleistungen`}
          labelHeading="Ich erhielt oder erhalte Sozialleistungen oder Lohnersatzleistungen"
          label="zum Beispiel BAföG, Bürgergeld, Arbeitslosengeld, Krankengeld oder Elterngeld."
          errors={hasError}
        />

        <CustomCheckbox
          className="mt-16"
          register={register}
          registerOptions={{ validate: { isAnyOptionSelected } }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinEinkommen`}
          labelHeading="Ich hatte oder habe kein Einkommen"
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
