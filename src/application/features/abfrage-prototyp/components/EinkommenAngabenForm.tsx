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
import { YesNo } from "../../abfrageteil/state";
import { CustomRadioGroup } from "@/application/components";
import { TaetigkeitenSelektor } from "../state/stepPrototypSlice";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasMehrereTaetigkeiten?: YesNo | null,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
  readonly taetigkeitIndex: number;
};

export function EinkommenAngabenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
  taetigkeitIndex,
}: Props) {
  const store = useAppStore();

  const stepState = store.getState().stepPrototyp;

  const { control, handleSubmit, register, formState, watch, getValues } =
    useForm({
      defaultValues: {
        ...stepState,
        taetigkeiten:
          stepState.taetigkeiten?.length > 0
            ? stepState.taetigkeiten
            : [
                {
                  taetigkeitenArt: (flow === PersonPageFlow.selbststaendig
                    ? "selbststaendig"
                    : "nichtSelbststaendig") as TaetigkeitenSelektor,
                  bruttoJahresgewinn: null,
                  selbststaendigPflichtversichert: null,
                  selbststaendigRentenversichert: null,
                  bruttoMonatsschnitt: null,
                  isMinijob: null,
                  steuerklasse: null,
                  zahlenSieKirchenSteuer: null,
                  versicherung: null,
                },
              ],
      },
    });

  const submitAngabenTaetigkeit = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(
        values,
        undefined,
        undefined,
        undefined,
        getValues("hasMehrereTaetigkeiten"),
      );
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

  const taetigkeiten = watch("taetigkeiten");

  console.log(getValues("taetigkeiten"));

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenTaetigkeit)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>
        <h2 className="mt-16">Einkommen {taetigkeitIndex + 1}:</h2>

        {taetigkeiten[taetigkeitIndex]!.taetigkeitenArt ===
          "selbststaendig" && (
          <div>
            <h3 className="mb-40">Einkommen aus selbstständiger Arbeit</h3>

            <h5 className="mb-8">Sind Sie gesetzlich pflichtversichert?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuTaetigkeiten />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="taetigkeiten.0.selbststaendigPflichtversichert"
              errors={formState.errors}
            />

            <h5 className="mb-8 mt-40">Wie waren Sie rentenversichert?</h5>
            <CustomRadioGroup
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="taetigkeiten.0.selbststaendigRentenversichert"
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
              name="taetigkeiten.0.bruttoJahresgewinn"
              label="Brutto-Gewinn im Kalenderjahr"
              suffix="Euro"
              control={control}
            />
          </div>
        )}

        {taetigkeiten[taetigkeitIndex]!.taetigkeitenArt ===
          "nichtSelbststaendig" && (
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
              name="taetigkeiten.0.isMinijob"
              errors={formState.errors}
            />
          </div>
        )}
      </div>
    </form>
  );
}
