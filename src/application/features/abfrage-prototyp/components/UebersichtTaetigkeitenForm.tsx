import { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import IconAdd from "@digitalservicebund/icons/Add";
import IconClear from "@digitalservicebund/icons/Clear";
import IconEdit from "@digitalservicebund/icons/CreateOutlined";
import {
  TaetigkeitAngaben,
  TaetigkeitenSelektor,
} from "../state/stepPrototypSlice";
import { Button } from "@/application/components";
import classNames from "classnames";
import { Antragstellende, YesNo } from "../../abfrageteil/state";
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

export function UebersichtTaetigkeitenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
  elternteil,
}: Props) {
  const store = useAppStore();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitTaetigkeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(
        values,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        elternteil === Elternteil.Eins
          ? createEinkommenRouting(values.ET1.taetigkeiten)
          : createEinkommenRouting(values.ET2.taetigkeiten),
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

  const [isOpen, setIsOpen] = useState(false);
  const [isBeingChanged, setIsBeingChanged] = useState<number | null>(null);

  const taetigkeiten = watch(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten`,
  );

  const [neueTaetigkeitArt, setNeueTaetigkeitArt] =
    useState<TaetigkeitenSelektor | null>(null);
  const [changedTaetigkeitArt, setChangedTaetigkeitArt] =
    useState<TaetigkeitenSelektor | null>(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten`,
  });

  function addTaetigkeit() {
    if (
      flow === PersonPageFlow.selbststaendig ||
      flow === PersonPageFlow.mischeinkuenfte
    ) {
      setIsOpen(true);
    } else {
      onAddTaetigkeit("nichtSelbststaendig");
    }
  }

  function activateChangeTaetigkeit(index: number) {
    setIsBeingChanged(index);
    setChangedTaetigkeitArt(fields[index]!.taetigkeitenArt);
  }

  function changeTaetigkeit() {
    if (isBeingChanged !== null && changedTaetigkeitArt) {
      const current = fields[isBeingChanged];
      update(isBeingChanged, {
        ...current!,
        taetigkeitenArt: changedTaetigkeitArt,
      });
    }

    setIsBeingChanged(null);
    setChangedTaetigkeitArt(null);
  }

  const onAddTaetigkeit = (art: TaetigkeitenSelektor | null) => {
    if (art) {
      append({
        taetigkeitenArt: art,
        zahlenSieKirchenSteuer: null,

        selbststaendigKVPflichtversichert: null,
        selbststaendigRVPflichtversichert: null,
        selbststaendigAVPflichtversichert: null,
        bruttoJahresgewinn: null,

        bruttoMonatsschnitt: null,
        isMinijob: null,
        steuerklasse: null,
        versicherung: null,
      });
    }
    setIsOpen(false);
    setNeueTaetigkeitArt(null);
  };

  function getInputClassName(disabled: boolean): string {
    return classNames(
      "relative size-32 min-w-32 rounded-full border border-solid border-primary bg-white",
      "before:size-16 before:rounded-full before:content-['']",
      "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
      "checked:before:bg-primary",
      { "hover:border-2 hover:border-primary": !disabled },
      { "focus:border-2 focus:border-primary": !disabled },
      { "cursor-default": disabled },
    );
  }

  function getLabelClassName(disabled: boolean) {
    return classNames("flex content-center gap-x-16 gap-y-8 items-center", {
      "cursor-default text-grey": disabled,
    });
  }

  return (
    <form id={id} onSubmit={handleSubmit(submitTaetigkeiten)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>

        <h3 className="mt-16 mb-32">
          Bitte fügen Sie die weiteren Tätigkeiten hinzu
        </h3>

        {fields.map((field, index) => (
          <div key={field.id}>
            {(
              flow === PersonPageFlow.mischeinkuenfte ? index <= 1 : index === 0
            ) ? (
              <div className="flex flex-col mb-40 gap-4 bg-primary-light border border-solid border-primary pl-40 pr-32 py-24 text-primary">
                <h4>Tätigkeit {index + 1}:</h4>
                <p>
                  Einkommen aus{" "}
                  {field.taetigkeitenArt === "selbststaendig"
                    ? "selbstständiger"
                    : "nicht-selbstständiger"}{" "}
                  Arbeit
                </p>
              </div>
            ) : (
              <div>
                {isBeingChanged === index ? (
                  <div className="border border-dashed border-primary py-24 cursor-pointer flex flex-col mb-10 gap-20">
                    <div className="flex flex-col gap-4 pl-40">
                      <h4 className="text-primary">Tätigkeit {index + 1}:</h4>
                      <div className="flex flex-col gap-10 mt-16 mb-4">
                        <label className={getLabelClassName(false)}>
                          <input
                            type="radio"
                            value="nichtSelbststaendig"
                            className={getInputClassName(false)}
                            checked={
                              changedTaetigkeitArt === "nichtSelbststaendig"
                            }
                            onChange={() =>
                              setChangedTaetigkeitArt("nichtSelbststaendig")
                            }
                          />
                          <div>
                            <strong>
                              Einkommen aus nicht-selbstständiger Arbeit
                            </strong>
                            <p>
                              zum Beispiel angestellt: ob in Vollzeit, Teilzeit,
                              als Minijob, in Ausbildung, Freiwilligendienst
                              oder als Beamter/Beamtin.
                            </p>
                          </div>
                        </label>
                        <label className={getLabelClassName(false)}>
                          <input
                            type="radio"
                            value="selbststaendig"
                            className={getInputClassName(false)}
                            checked={changedTaetigkeitArt === "selbststaendig"}
                            onChange={() =>
                              setChangedTaetigkeitArt("selbststaendig")
                            }
                          />
                          <div>
                            <strong>
                              Einkommen aus selbstständiger Arbeit
                            </strong>
                            <p>
                              zum Beispiel freiberuflich, mit Gewerbe, als
                              Honorarkraft, mit Land- oder Forstbetrieb.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        className="px-80"
                        type="button"
                        buttonStyle="secondary"
                        onClick={() => changeTaetigkeit()}
                        disabled={changedTaetigkeitArt === null}
                      >
                        Übernehmen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex mb-40 gap-4 bg-off-white border border-solid border-primary pl-40 pr-32 py-24 text-primary">
                    <div className="flex flex-col">
                      <h4>Tätigkeit {index + 1}:</h4>
                      <p>
                        Einkommen aus{" "}
                        {field.taetigkeitenArt === "selbststaendig"
                          ? "selbstständiger"
                          : "nicht-selbstständiger"}{" "}
                        Arbeit
                      </p>
                    </div>
                    <div className="flex flex-col ml-auto mr-20">
                      <div>
                        <IconClear className="mr-8" />
                        <Button
                          type="button"
                          buttonStyle="link"
                          onClick={() => remove(index)}
                        >
                          löschen
                        </Button>
                      </div>
                      {flow === PersonPageFlow.selbststaendig ||
                        (flow === PersonPageFlow.mischeinkuenfte && (
                          <div className="mt-8">
                            <IconEdit className="mr-8" />
                            <Button
                              type="button"
                              buttonStyle="link"
                              onClick={() => activateChangeTaetigkeit(index)}
                            >
                              ändern
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {!isBeingChanged && (
          <div className="border border-dashed border-primary py-24 cursor-pointer">
            {!isOpen && (
              <div
                className="flex justify-center items-center text-primary"
                onClick={() => addTaetigkeit()}
              >
                <IconAdd />
                <span className="ml-8 pb-4">weitere Tätigkeit hinzufügen</span>
              </div>
            )}

            {isOpen && (
              <div className="flex flex-col mb-10 gap-20">
                <div className="flex flex-col gap-4 pl-40">
                  <h4 className="text-primary">
                    Tätigkeit {taetigkeiten.length + 1}:
                  </h4>
                  <div className="flex flex-col gap-10 mt-16 mb-4">
                    <label className={getLabelClassName(false)}>
                      <input
                        type="radio"
                        value="nichtSelbststaendig"
                        className={getInputClassName(false)}
                        checked={neueTaetigkeitArt === "nichtSelbststaendig"}
                        onChange={() =>
                          setNeueTaetigkeitArt("nichtSelbststaendig")
                        }
                      />
                      <div>
                        <strong>
                          Einkommen aus nicht-selbstständiger Arbeit
                        </strong>
                        <p>
                          zum Beispiel angestellt: ob in Vollzeit, Teilzeit, als
                          Minijob, in Ausbildung, Freiwilligendienst oder als
                          Beamter/Beamtin.
                        </p>
                      </div>
                    </label>
                    <label className={getLabelClassName(false)}>
                      <input
                        type="radio"
                        value="selbststaendig"
                        className={getInputClassName(false)}
                        checked={neueTaetigkeitArt === "selbststaendig"}
                        onChange={() => setNeueTaetigkeitArt("selbststaendig")}
                      />
                      <div>
                        <strong>Einkommen aus selbstständiger Arbeit</strong>
                        <p>
                          zum Beispiel freiberuflich, mit Gewerbe, als
                          Honorarkraft, mit Land- oder Forstbetrieb.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    className="px-80"
                    type="button"
                    buttonStyle="secondary"
                    onClick={() => onAddTaetigkeit(neueTaetigkeitArt)}
                    disabled={neueTaetigkeitArt === null}
                  >
                    Übernehmen
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
