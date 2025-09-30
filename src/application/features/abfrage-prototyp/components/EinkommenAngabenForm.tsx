import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import {
  Ausklammerung,
  berechneExaktenBemessungszeitraum,
} from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";
import {
  CustomNumberField,
  InfoZuMiniJobs,
  YesNoRadio,
} from "../../abfrageteil/components/common";
import { Antragstellende, YesNo } from "../../abfrageteil/state";
import { CustomRadioGroup } from "@/application/components";
import { EinkommenAngabenStep } from "@/application/pages/abfrage-protoyp/PersonPage";
import { InfoZuKVPflicht } from "./InfoZuKVPflicht";
import { InfoZuRVPflicht } from "./InfoZuRVPflicht";
import { InfoZuAVPflicht } from "./InfoZuAVPflicht";
import { InfoZuBruttoGewinn } from "./InfoZuBruttoGewinn";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasWeitereTaetigkeiten?: YesNo | null,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  // readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
  readonly einkommenAngabenStep: EinkommenAngabenStep;
};

export function EinkommenAngabenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
  einkommenAngabenStep,
  elternteil,
}: Props) {
  const store = useAppStore();

  const { control, handleSubmit, register, formState, watch, getValues } =
    useForm({
      defaultValues: store.getState().stepPrototyp,
    });

  const submitAngabenEinkommen = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
    auszuklammerndeZeitraeume ?? [],
  );

  const isMinijob = watch(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.isMinijob`,
  );

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        {einkommenAngabenStep.taetigkeitArt === "selbststaendig" && (
          <div>
            <h3>Einkommen aus selbstständiger Arbeit</h3>
            <div className="mt-20 mb-40 rounded bg-grey-light inline-block py-10">
              <span className="font-bold px-20">
                Bemessungszeitraum: {maximalerBemessungszeitraum}
              </span>
            </div>

            <h5 className="mb-8">Sind Sie kirchensteuerpflichtig?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.zahlenSieKirchenSteuer`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Sind Sie über die gesetzliche Krankenversicherung
              pflichtversichert?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuKVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigKVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche Rentenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuRVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigRVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche
              Arbeitslosenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuAVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigAVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8 mt-40">
              Wie viel haben Sie im Bemessungszeitraum brutto im Kalenderjahr
              verdient?
            </h5>
            <CustomNumberField
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoJahresgewinn`}
              label="Brutto-Gewinn im Kalenderjahr"
              slotBeforeLabel={<InfoZuBruttoGewinn />}
              suffix="Euro"
              control={control}
            />
          </div>
        )}

        {einkommenAngabenStep.taetigkeitArt === "nichtSelbststaendig" && (
          <div>
            <h3>Einkommen aus nicht-selbstständiger Arbeit</h3>

            <div className="mt-20 mb-40 rounded bg-grey-light inline-block py-10">
              <span className="font-bold px-20">
                Bemessungszeitraum: {maximalerBemessungszeitraum}
              </span>
            </div>

            <h5 className="mb-8">
              Handelt es sich um Einkommen aus einem Minijob?{" "}
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuMiniJobs />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.isMinijob`}
              errors={formState.errors}
            />

            {isMinijob === YesNo.YES && (
              <div>
                <h5 className="mb-8 mt-40">
                  Wie viel haben Sie im Bemessungszeitraum durchschnittlich im
                  Monat brutto verdient?
                </h5>
                <p className="mt-20">
                  Wenn Ihr Einkommen über diesen Zeitraum schwankte, geben Sie
                  Ihr Einkommen pro Monat ein.
                </p>
                <CustomNumberField
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoJahresgewinn`}
                  label="Durschnittliches Brutto-Einkommen pro Monat"
                  suffix="Euro"
                  control={control}
                  className="mt-20"
                />
              </div>
            )}

            {isMinijob === YesNo.NO && (
              <div>
                <h5 className="mb-8 mt-40">
                  Test: Wie viel haben Sie im Bemessungszeitraum
                  durchschnittlich im Monat brutto verdient?
                </h5>
                <p className="mt-20">
                  Wenn Ihr Einkommen über diesen Zeitraum schwankte, geben Sie
                  Ihr Einkommen pro Monat ein.
                </p>
                <CustomNumberField
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoJahresgewinn`}
                  label="Durschnittliches Brutto-Einkommen pro Monat"
                  suffix="Euro"
                  control={control}
                  className="mt-20"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
