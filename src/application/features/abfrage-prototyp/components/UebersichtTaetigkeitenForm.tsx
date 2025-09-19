import { useCallback, type SyntheticEvent, useRef, useState } from "react";
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
import { Alert } from "@/application/components/Alert";
import Icon from "@digitalservicebund/icons/Add";
import {
  TaetigkeitAngaben,
  TaetigkeitenSelektor,
} from "../state/stepPrototypSlice";
import { useOnClickOutside } from "@/application/hooks/useOnClickOutside";
import { Button } from "@/application/components";

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

  const { handleSubmit, watch } = useForm({
    defaultValues: {
      ...stepState,
      taetigkeiten: [
        {
          taetigkeitenArt: "selbststaendig" as TaetigkeitenSelektor,
        },
        {
          taetigkeitenArt: "nichtSelbststaendig" as TaetigkeitenSelektor,
        },
      ],
    },
  });

  const taetigkeiten = watch("taetigkeiten");

  const submitBmz = useCallback(
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
  const formattedDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const detailsElement = useRef(null);

  // useOnClickOutside(detailsElement, () => {
  //   setIsOpen(false)
  // });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <form id={id} onSubmit={handleSubmit(submitBmz)} noValidate>
      <div>
        <div className="mt-40 rounded bg-grey-light inline-block py-10">
          <span className="font-bold px-20">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>

        <h3 className="mt-16 mb-32">
          Bitte fügen Sie die weiteren Tätigkeiten hinzu
        </h3>

        {taetigkeiten.map((item, index) => (
          <div
            key={index}
            className="flex flex-col mb-40 gap-4 bg-primary-light border border-solid border-primary pl-40 pr-32 py-24 text-primary"
          >
            <strong>Tätigkeit 1:</strong>
            <p>
              Einkommen aus{" "}
              {item.taetigkeitenArt === "selbststaendig"
                ? "selbstständiger"
                : "nicht-selbstständiger"}{" "}
              Arbeit
            </p>
          </div>
        ))}

        <div
          className="border border-dashed border-primary py-24 text-primary cursor-pointer"
          ref={detailsElement}
        >
          {!isOpen && (
            <div
              className="flex justify-center items-center"
              onClick={() => setIsOpen(true)}
            >
              <Icon />
              <span className="ml-8 pb-4">weitere Tätigkeit hinzufügen</span>
            </div>
          )}

          {isOpen && (
            <div className="flex flex-col mb-10 gap-20 text-primary">
              <div className="flex flex-col gap-4 pl-40">
                <strong>Tätigkeit 2:</strong>
                <p>Einkommen aus Arbeit</p>
              </div>

              <div className="text-center">
                <Button
                  className="px-80"
                  type="button"
                  buttonStyle="secondary"
                  onClick={() => setIsOpen(false)}
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
