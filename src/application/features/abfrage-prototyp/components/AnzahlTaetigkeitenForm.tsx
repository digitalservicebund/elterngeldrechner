import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
  Antragstellende,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import {
  Ausklammerung,
  berechneExaktenBemessungszeitraum,
} from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";
import { InfoZuTaetigkeiten } from "./InfoZuTaetigkeiten";
import { YesNoRadio } from "../../abfrageteil/components/common";
import { YesNo } from "../../abfrageteil/state";
import {
  TaetigkeitAngaben,
  TaetigkeitenSelektor,
} from "../state/stepPrototypSlice";
import { EinkommenAngabenStep } from "@/application/pages/abfrage-protoyp/PersonPage";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasWeitereTaetigkeiten?: YesNo | null,
    taetigkeitenRouting?: EinkommenAngabenStep[],
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  // readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
};

export function AnzahlTaetigkeitenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
  elternteil,
}: Props) {
  const store = useAppStore();

  const stepState = store.getState().stepPrototyp;

  const taetigkeitenDefaults: TaetigkeitAngaben[] = [
    {
      taetigkeitenArt:
        flow === PersonPageFlow.selbststaendig ||
        flow === PersonPageFlow.mischeinkuenfte
          ? "selbststaendig"
          : "nichtSelbststaendig",

      zahlenSieKirchenSteuer: null,

      selbststaendigKVPflichtversichert: null,
      selbststaendigRVPflichtversichert: null,
      selbststaendigAVPflichtversichert: null,
      bruttoJahresgewinn: null,

      bruttoMonatsschnitt: null,
      bruttoMonatsangaben: null,
      isMinijob: null,
      steuerklasse: null,
    },
  ];

  if (flow === PersonPageFlow.mischeinkuenfte) {
    taetigkeitenDefaults.push({
      taetigkeitenArt: "nichtSelbststaendig",

      zahlenSieKirchenSteuer: null,

      selbststaendigKVPflichtversichert: null,
      selbststaendigRVPflichtversichert: null,
      selbststaendigAVPflichtversichert: null,
      bruttoJahresgewinn: null,

      bruttoMonatsschnitt: null,
      bruttoMonatsangaben: null,
      isMinijob: null,
      steuerklasse: null,
    });
  }

  const { handleSubmit, register, formState, getValues } = useForm({
    defaultValues: {
      ...stepState,
      ET1: {
        ...stepState.ET1,
        taetigkeiten:
          stepState.ET1.taetigkeiten.length > 0 || elternteil != Elternteil.Eins
            ? stepState.ET1.taetigkeiten
            : taetigkeitenDefaults,
      },
      ET2: {
        ...stepState.ET2,
        taetigkeiten:
          stepState.ET2.taetigkeiten.length > 0 || elternteil != Elternteil.Zwei
            ? stepState.ET2.taetigkeiten
            : taetigkeitenDefaults,
      },
    },
  });

  const submitAnzahlTaetigkeiten = useCallback(
    (values: StepPrototypState) => {
      const hasWeitereTaetigkeiten = getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasWeitereTaetigkeiten`,
      );

      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(
        values,
        undefined,
        undefined,
        undefined,
        undefined,
        hasWeitereTaetigkeiten,
        hasWeitereTaetigkeiten === YesNo.NO
          ? elternteil === Elternteil.Eins
            ? createEinkommenRouting(values.ET1.taetigkeiten)
            : createEinkommenRouting(values.ET2.taetigkeiten)
          : undefined,
      );
    },
    [store, onSubmit],
  );

  function createEinkommenRouting(taetigkeiten: TaetigkeitAngaben[]) {
    const einkommenAngabenSteps: EinkommenAngabenStep[] = [];

    taetigkeiten.forEach((value, index) => {
      einkommenAngabenSteps.push({
        taetigkeitIndex: index,
        taetigkeitArt: value.taetigkeitenArt,
      });
    });

    return einkommenAngabenSteps;
  }

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
    auszuklammerndeZeitraeume ?? [],
  );

  return (
    <form id={id} onSubmit={handleSubmit(submitAnzahlTaetigkeiten)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>
        <h3 className="my-16">
          Hatten Sie noch weitere Tätigkeiten im Bemessungszeitraum?
        </h3>

        <YesNoRadio
          className="mb-32"
          legend=""
          slotBetweenLegendAndOptions={<InfoZuTaetigkeiten />}
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasWeitereTaetigkeiten`}
          errors={formState.errors}
        />
      </div>
    </form>
  );
}
