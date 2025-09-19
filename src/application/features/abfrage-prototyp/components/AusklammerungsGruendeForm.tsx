import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { berechneUngefaehrenBemessungszeitraum } from "./berechneBemessungszeitraum";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import { Alert } from "@/application/components/Alert";
import { PersonPageFlow } from "./PersonPageRouting";
import { InfoZumMutterschutz } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZumMutterschutz";
import { InfoZuMutterschutzAnderesKind } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuMutterschutzAnderesKind";
import { InfoZuElternzeitAnderesKind } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuElternzeitAnderesKind";
import { InfoZuKrankheit } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuKrankheit";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
};

export function AusklammerungsGruendeForm({ id, onSubmit, flow }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAusklammerungsGruende = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, undefined, isAnyOptionSelected());
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const ungefährerBemessungszeitraum = berechneUngefaehrenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
  );

  const checkboxNames: (keyof StepPrototypState)[] = [
    "hasMutterschutzDiesesKind",
    "hasMutterschutzAnderesKind",
    "isBeamtet",
    "hasElterngeldAnderesKind",
    "hasErkrankung",
  ];

  function isAnyOptionSelected(): boolean {
    return checkboxNames.some((fieldName) => getValues(fieldName));
  }

  // const hasGeschwisterkinder = () => {
  //   const geschwisterkinder = getValues("geschwisterkinder")
  //   return geschwisterkinder.length > 0 ? true : false
  // }

  return (
    <form
      id={id}
      onSubmit={handleSubmit(submitAusklammerungsGruende)}
      noValidate
    >
      <div>
        <h3 className="mb-16 mt-40">
          Treffen folgende Gründe auf Sie zu für den Zeitraum:
          <ul className="list list-disc ml-40">
            <li>{ungefährerBemessungszeitraum}</li>
          </ul>
        </h3>
        {(flow === PersonPageFlow.selbststaendig ||
          flow === PersonPageFlow.mischeinkuenfte) && (
          <p>
            Wenn Sie hier etwas auswählen, kann für die Berechnung Ihres
            Elterngeldes ein anderes Jahr genommen werden. Und zwar das Jahr, in
            dem Sie mehr verdient haben.
          </p>
        )}
        {flow !== PersonPageFlow.selbststaendig &&
          flow !== PersonPageFlow.mischeinkuenfte && (
            <p>
              Wenn Sie hier etwas auswählen, kann für die Berechnung Ihres
              Elterngeldes ein anderer Monat genommen werden. Und zwar der
              Monat, in dem Sie mehr verdient haben.
            </p>
          )}
      </div>

      <div className="mt-32">
        <CustomCheckbox
          register={register}
          name="hasMutterschutzDiesesKind"
          label="Ich war oder werde im Mutterschutz sein und hatte weniger Einkommen"
          labelComponent={<InfoZumMutterschutz />}
          onChange={(checked) => {
            if (checked) {
              setValue("hasKeinGrund", false);
            }
          }}
        />

        {/* {hasGeschwisterkinder() && ( */}
        <CustomCheckbox
          className="mt-20"
          register={register}
          name="hasMutterschutzAnderesKind"
          label="Ich war im Mutterschutz für ein älteres Kind und hatte weniger Einkommen"
          labelComponent={<InfoZuMutterschutzAnderesKind />}
          onChange={(checked) => {
            if (checked) {
              setValue("hasKeinGrund", false);
            }
          }}
        />
        {/* )} */}

        {flow !== PersonPageFlow.selbststaendig && (
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="isBeamtet"
            label="Ich bin Beamtin und war oder werde im Mutterschutz sein"
            onChange={(checked) => {
              if (checked) {
                setValue("hasKeinGrund", false);
              }
            }}
          />
        )}

        {/* {hasGeschwisterkinder() && ( */}
        <CustomCheckbox
          className="mt-20"
          register={register}
          name="hasElterngeldAnderesKind"
          label="Ich habe Elterngeld für ein älteres Kind bekommen und hatte weniger Einkommen"
          labelComponent={<InfoZuElternzeitAnderesKind />}
          onChange={(checked) => {
            if (checked) {
              setValue("hasKeinGrund", false);
            }
          }}
        />
        {/* )} */}

        <CustomCheckbox
          className="mt-20"
          register={register}
          name="hasErkrankung"
          label="Ich hatte eine Erkrankung wegen meiner Schwangerschaft und hatte weniger Einkommen"
          labelComponent={<InfoZuKrankheit />}
          onChange={(checked) => {
            if (checked) {
              setValue("hasKeinGrund", false);
            }
          }}
        />

        <CustomCheckbox
          className="mt-20"
          register={register}
          name="hasKeinGrund"
          label="Keiner der genannten Gründe"
          onChange={(checked) => {
            setValue("hasKeinGrund", checked);
            if (checked) {
              checkboxNames.forEach((name) => setValue(name, false));
            }
          }}
        />
      </div>

      <Alert
        headline="Gut zu wissen für die spätere Antragstellung:"
        className="mt-32"
      >
        Wenn Sie vor der Geburt selbständig gearbeitet haben, kann dieser
        Zeitraum bei der Berechnung des Elterngeldes übersprungen werden. Wenn
        Sie das möchten, müssen Sie das später im Antrag angeben.
      </Alert>
    </form>
  );
}
