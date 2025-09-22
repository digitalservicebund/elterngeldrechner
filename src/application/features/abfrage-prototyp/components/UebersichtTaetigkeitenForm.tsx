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
import { TaetigkeitenSelektor } from "../state/stepPrototypSlice";
import { Button } from "@/application/components";
import classNames from "classnames";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
};

export function UebersichtTaetigkeitenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
}: Props) {
  const store = useAppStore();

  const stepState = store.getState().stepPrototyp;

  const { control, handleSubmit, watch } = useForm({
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

  const submitTaetigkeiten = useCallback(
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

  const [isOpen, setIsOpen] = useState(false);

  const taetigkeiten = watch("taetigkeiten");

  const [neueTaetigkeitArt, setNeueTaetigkeitArt] =
    useState<TaetigkeitenSelektor | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taetigkeiten",
  });

  const onAddTaetigkeit = (art: TaetigkeitenSelektor | null) => {
    if (art) {
      append({
        taetigkeitenArt: art,
        bruttoJahresgewinn: null,
        selbststaendigPflichtversichert: null,
        selbststaendigRentenversichert: null,
        bruttoMonatsschnitt: null,
        isMinijob: null,
        steuerklasse: null,
        zahlenSieKirchenSteuer: null,
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
            {index === 0 ? (
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
                  <div className="mt-8">
                    <IconEdit className="mr-8" />
                    <Button type="button" buttonStyle="link" onClick={() => {}}>
                      ändern
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="border border-dashed border-primary py-24 cursor-pointer">
          {!isOpen && (
            <div
              className="flex justify-center items-center text-primary"
              onClick={() => setIsOpen(true)}
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
                  <label
                    className={getLabelClassName(
                      flow === PersonPageFlow.selbststaendig,
                    )}
                  >
                    <input
                      type="radio"
                      value="nichtSelbststaendig"
                      className={getInputClassName(
                        flow === PersonPageFlow.selbststaendig,
                      )}
                      checked={neueTaetigkeitArt === "nichtSelbststaendig"}
                      onChange={() =>
                        setNeueTaetigkeitArt("nichtSelbststaendig")
                      }
                      disabled={flow === PersonPageFlow.selbststaendig}
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
                  <label
                    className={getLabelClassName(
                      flow !== PersonPageFlow.selbststaendig &&
                        flow !== PersonPageFlow.mischeinkuenfte,
                    )}
                  >
                    <input
                      type="radio"
                      value="selbststaendig"
                      className={getInputClassName(
                        flow !== PersonPageFlow.selbststaendig &&
                          flow !== PersonPageFlow.mischeinkuenfte,
                      )}
                      checked={neueTaetigkeitArt === "selbststaendig"}
                      onChange={() => setNeueTaetigkeitArt("selbststaendig")}
                      disabled={
                        flow !== PersonPageFlow.selbststaendig &&
                        flow !== PersonPageFlow.mischeinkuenfte
                      }
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
      </div>
    </form>
  );
}
