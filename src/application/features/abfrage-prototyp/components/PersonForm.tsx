import { useCallback } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import { YesNo } from "@/application/features/abfrageteil/state";
import { InfoZuVornamen } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuVornamen";
import { InfoZuAlleinerziehenden } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoFuerAlleinerziehenden";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
};

export function PersonForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const pseudonym1Error = get(formState.errors, "pseudonym.ET1") as
    | FieldError
    | undefined;

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  return (
    <form
      id={id}
      // className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      {elternteil === Elternteil.Eins ? (
        <p>
          Auf den folgenden Seiten fragen wir alle Informationen zu Person 1 ab.
          Sollte es eine weitere Person geben, können hierzu Angaben im
          Anschluss gemacht werden.
        </p>
      ) : (
        <>
          <p>
            Sollen beide Elternteile Elterngeld bekommen? Dann bekommen beide
            mehr und länger Elterngeld.
          </p>
          <p>
            Planen Sie Ihr Elterngeld möglichst gemeinsam, um mehr und länger
            Elterngeld zu bekommen. Aber manchmal möchte ein Elternteil kein
            Elterngeld bekommen, zum Beispiel weil das zweite Einkommen
            gebraucht wird.
          </p>
        </>
      )}
      <div className="mt-32">
        {elternteil === Elternteil.Eins ? (
          <h3>Wie heißt Person 1 die Elterngeld erhalten soll?</h3>
        ) : (
          <h3>Wie heißt Person 2 die Elterngeld erhalten soll?</h3>
        )}

        <div className="mt-20">
          <label className="block text-16 mb-4">
            Vorname {elternteil === Elternteil.Eins ? "Person 1" : "Person 2"}
          </label>
          <input
            className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
            {...register("pseudonym.ET1", {
              required: "Dieses Feld ist erforderlich",
            })}
            required
          />
          {!!pseudonym1Error && (
            <p className="mt-8 text-14 text-danger">
              {pseudonym1Error.message}
            </p>
          )}
          <div className="mt-16">
            <InfoZuVornamen />
          </div>
        </div>
      </div>

      {elternteil === Elternteil.Eins && (
        <div className="mt-32">
          <h3>Sind Sie alleinerziehend?</h3>

          <YesNoRadio
            legend=""
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
              onChange: initializeAntragstellendeIfAlleinerziehend,
            }}
            name="alleinerziehend"
            errors={formState.errors}
            required
          />

          <div className="mt-16">
            <InfoZuAlleinerziehenden />
          </div>
        </div>
      )}

      {elternteil === Elternteil.Zwei && (
        <div className="mt-32">
          <p>Überspringen: Keine weitere Person</p>
        </div>
      )}
    </form>
  );
}
