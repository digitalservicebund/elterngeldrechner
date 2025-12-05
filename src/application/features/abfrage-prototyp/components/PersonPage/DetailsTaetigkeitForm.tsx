import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/application/components/Alert";
import { InfoZuAVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuAVPflicht";
import { InfoZuBruttoGewinn } from "@/application/features/abfrage-prototyp/components/InfoZuBruttoGewinn";
import { InfoZuKVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuKVPflicht";
import { InfoZuRVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuRVPflicht";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import { berechneExaktenBemessungszeitraum } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import {
  CustomNumberField,
  InfoZuMiniJobs,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly incomeIndex: number;
};

export function DetailsTaetigkeitForm({
  id,
  onSubmit,
  elternteil,
  incomeIndex,
}: Props) {
  const store = useAppStore();

  const { control, handleSubmit, register, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAngabenEinkommen = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const taetigkeitenET1 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET1,
  );
  const taetigkeitenET2 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET2,
  );
  const taetigkeit =
    elternteil === Elternteil.Eins
      ? taetigkeitenET1[incomeIndex]
      : taetigkeitenET2[incomeIndex];

  const ausklammerungenET1 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET1,
  );
  const ausklammerungenET2 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET2,
  );
  const ausklammerungen =
    elternteil === Elternteil.Eins ? ausklammerungenET1 : ausklammerungenET2;

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const flowForBMZ =
    taetigkeit?.taetigkeitenArt === "selbststaendig"
      ? PersonPageFlow.selbststaendig
      : PersonPageFlow.nichtSelbststaendig;
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flowForBMZ,
    ausklammerungen,
  );

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        <div className="my-40 inline-block rounded bg-grey-light py-10">
          <span className="px-20 font-bold">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>

        {taetigkeit?.taetigkeitenArt === "selbststaendig" && (
          <div>
            <h3 className="mb-10">Details zur selbstständigen Tätigkeit</h3>
            <p>
              Bitte geben Sie hier Details zu Ihrer Tätigkeit an. Im Anschluss
              haben Sie die Möglichkeit noch eine weitere Tätigkeit anzugeben.
            </p>

            <h5 className="mb-8 mt-40">Sind Sie kirchensteuerpflichtig?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.zahlenSieKirchenSteuer`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Sind Sie über die gesetzliche Krankenversicherung
              pflichtversichert?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuKVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigKVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche Rentenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuRVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigRVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche
              Arbeitslosenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuAVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigAVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8 mt-40">
              Wie viel haben Sie mit Ihrer selbstständigen Arbeit brutto im{" "}
              {maximalerBemessungszeitraum} verdient?
            </h5>
            <CustomNumberField
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.bruttoJahresgewinn`}
              label="Brutto-Gewinn im gesamten Kalenderjahr"
              slotBeforeLabel={<InfoZuBruttoGewinn selbststaendig />}
              suffix="Euro"
              control={control}
            />

            <Alert
              headline="Ihr Einkommenststeuerbescheid für das letzte Jahr liegt noch nicht vor?"
              className="mt-40"
            >
              Wenn der aktuelle Einkommensteuerbescheid noch nicht vorliegt,
              geben Sie einen geschätzten Brutto-Gewinn an. Beachten Sie, dass
              das Ergebnis der Elterngeldberechnung dadurch abweichen kann.
            </Alert>
          </div>
        )}

        {taetigkeit?.taetigkeitenArt === "nichtSelbststaendig" && (
          <div>
            <h3 className="mb-10">Details zur angestellten Tätigkeit</h3>
            <p>
              Bitte geben Sie hier Details zu Ihrer Tätigkeit an. Im Anschluss
              haben Sie die Möglichkeit noch eine weitere Tätigkeit anzugeben.
            </p>

            <h5 className="mb-8 mt-40">
              Handelt es sich um Einkommen aus einem Minijob?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuMiniJobs />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.isMinijob`}
              errors={formState.errors}
            />
          </div>
        )}
      </div>
    </form>
  );
}
