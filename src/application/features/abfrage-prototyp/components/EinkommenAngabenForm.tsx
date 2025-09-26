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
import { InfoZuTaetigkeiten } from "./InfoZuTaetigkeiten";
import {
  CustomNumberField,
  YesNoRadio,
} from "../../abfrageteil/components/common";
import { Antragstellende, YesNo } from "../../abfrageteil/state";
import { CustomRadioGroup } from "@/application/components";
import { EinkommenAngabenStep } from "@/application/pages/abfrage-protoyp/PersonPage";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasMehrereTaetigkeiten?: YesNo | null,
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

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
    auszuklammerndeZeitraeume ?? [],
  );

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>
        <h2 className="mt-16">
          Einkommen {einkommenAngabenStep.taetigkeitIndex + 1}:
        </h2>

        <p>Test</p>

        {einkommenAngabenStep.taetigkeitArt === "selbststaendig" && (
          <div>
            <h3 className="mb-40">Einkommen aus selbstständiger Arbeit</h3>

            <h5 className="mb-8">Sind Sie gesetzlich pflichtversichert?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuTaetigkeiten />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8 mt-40">Wie waren Sie rentenversichert?</h5>
            <CustomRadioGroup
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigRentenversichert`}
              errors={formState.errors}
              options={[
                {
                  value: "gesetzlich",
                  label: "gesetzlich rentenversichert",
                },
                {
                  value: "privat",
                  label: "privat rentenversichert",
                },
                {
                  value: "nicht",
                  label: "Ich war nicht rentenversichert",
                },
              ]}
              required
            />

            <h5 className="mb-8 mt-40">
              Wie viel haben Sie im Bemessungszeitraum brutto im Kalenderjahr
              verdient??
            </h5>
            <CustomNumberField
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoJahresgewinn`}
              label="Brutto-Gewinn im Kalenderjahr"
              suffix="Euro"
              control={control}
            />
          </div>
        )}

        {einkommenAngabenStep.taetigkeitArt === "nichtSelbststaendig" &&
          (einkommenAngabenStep.einkommenFormPart === "A" ? (
            <div>
              <h3 className="mb-40">
                Einkommen aus nicht-selbstständiger Arbeit
              </h3>

              <h5 className="mb-8">
                Handelt es sich um Einkommen aus einem Minijob?{" "}
              </h5>
              <YesNoRadio
                className="mb-32"
                legend=""
                slotBetweenLegendAndOptions={<InfoZuTaetigkeiten />}
                register={register}
                registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.0.isMinijob`}
                errors={formState.errors}
              />
            </div>
          ) : (
            <p>Test</p>
          ))}
      </div>
    </form>
  );
}
