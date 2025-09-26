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
import { Alert } from "@/application/components/Alert";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  // readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
};

export function Bemessungszeitraum({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
}: Props) {
  const store = useAppStore();

  const { handleSubmit } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

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

  return (
    <form id={id} onSubmit={handleSubmit(submitBmz)} noValidate>
      <div>
        <h3 className="mb-16">Das ist Ihr errechneter Bemessungszeitraum:</h3>
        <section
          className="rounded bg-grey-light p-24"
          aria-live="polite"
          aria-labelledby="bmz"
        >
          <h4 className="text-center">{maximalerBemessungszeitraum}</h4>
        </section>
        {auszuklammerndeZeitraeume && auszuklammerndeZeitraeume?.length > 0 && (
          <section
            className="rounded border-dashed p-24 mt-32"
            aria-live="polite"
            aria-labelledby="bmz"
          >
            <div className="pl-32">
              <h4 className="italic">Übersprungene Zeiträume:</h4>
              {auszuklammerndeZeitraeume &&
                auszuklammerndeZeitraeume.map((ausklammerung) => (
                  <p key={ausklammerung.beschreibung}>
                    {ausklammerung.beschreibung}{" "}
                    {formattedDate(ausklammerung.von)} bis{" "}
                    {formattedDate(ausklammerung.bis)}
                  </p>
                ))}
            </div>
          </section>
        )}
        {(flow === PersonPageFlow.selbststaendig ||
          flow === PersonPageFlow.mischeinkuenfte) && (
          <Alert headline="Hinweis" className="mt-32">
            Wenn Sie noch ein weiteres Jahr zurückgehen wollen, müssen Sie das
            selbst eintragen.In diesem Planer kann der Zeitraum nur um ein Jahr
            verschoben werden.
          </Alert>
        )}
      </div>
    </form>
  );
}
