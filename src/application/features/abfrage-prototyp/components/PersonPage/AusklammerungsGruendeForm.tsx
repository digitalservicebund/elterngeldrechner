import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { InfoZuAusklammerungsgruende } from "./InfoBoxen/InfoZuAusklammerungsgruende";
import { Alert } from "@/application/components/Alert";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { InfoZuElternzeitAnderesKind } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuElternzeitAnderesKind";
import { InfoZuKrankheit } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuKrankheit";
import { InfoZuMutterschutzAnderesKind } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuMutterschutzAnderesKind";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    // antragsstellende?: Antragstellende,
    // flow?: PersonPageFlow,
    // hasAusklammerungsgrund?: boolean,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  // readonly flow?: PersonPageFlow;
};

export function AusklammerungsGruendeForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAusklammerungsGruende = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  // function isAnyOptionSelected(): boolean {
  //   const person = elternteil === Elternteil.Eins ? "ET1" : "ET2";
  //   const anyOptionIsSelected = (
  //     [
  //       `${person}.hasMutterschutzAnderesKind`,
  //       `${person}.hasElterngeldAnderesKind`,
  //       `${person}.hasErkrankung`,
  //     ] as const
  //   ).some((fieldName) => getValues(fieldName));

  //   return anyOptionIsSelected;
  // }

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
        <h3 className="mb-16 mt-40">Treffen folgende Gründe auf Sie zu?</h3>
        <InfoZuAusklammerungsgruende />
      </div>

      <div className="mt-32">
        {/* {hasGeschwisterkinder() && ( */}
        <CustomCheckbox
          className="mt-20"
          register={register}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasMutterschutzAnderesKind`}
          label="Ich war für ein älteres Kind im Mutterschutz"
          labelComponent={<InfoZuMutterschutzAnderesKind />}
          onChange={(checked) => {
            if (checked) {
              setValue(
                `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinGrund`,
                false,
              );
            }
          }}
        />
        {/* )} */}

        {/* {hasGeschwisterkinder() && ( */}
        <CustomCheckbox
          className="mt-20"
          register={register}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasElterngeldAnderesKind`}
          label="Ich habe für ein älteres Kind Elterngeld bekommen"
          labelComponent={<InfoZuElternzeitAnderesKind />}
          onChange={(checked) => {
            if (checked) {
              setValue(
                `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinGrund`,
                false,
              );
            }
          }}
        />
        {/* )} */}

        <CustomCheckbox
          className="mt-20"
          register={register}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasErkrankung`}
          label="Ich hatte eine Erkrankung wegen meiner Schwangerschaft und hatte weniger Einkommen"
          labelComponent={<InfoZuKrankheit />}
          onChange={(checked) => {
            if (checked) {
              setValue(
                `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinGrund`,
                false,
              );
            }
          }}
        />

        <CustomCheckbox
          className="mt-20"
          register={register}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinGrund`}
          label="Keiner der genannten Gründe"
          onChange={(checked) => {
            setValue(
              `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasKeinGrund`,
              checked,
            );
            if (checked) {
              (
                [
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasMutterschutzAnderesKind`,
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasElterngeldAnderesKind`,
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasErkrankung`,
                ] as const
              ).forEach((name) => setValue(name, false));
            }
          }}
        />
      </div>

      <Alert
        headline="Gut zu wissen für die spätere Antragstellung:"
        className="mt-32"
      >
        Wenn Sie vor der Geburt selbstständig waren und auf dieser Seite einen
        Grund auswählen, können Sie später im Elterngeldantrag beantragen, den
        Bemessungszeitraum aufgrund dieser Angaben um ein Jahr vorzuverlegen.
      </Alert>
    </form>
  );
}
