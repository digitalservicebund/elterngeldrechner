import { useCallback } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import {
  Antragstellende,
  YesNo,
} from "@/application/features/abfrageteil/state";
import { InfoZuVornamen } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuVornamen";
import { InfoZuAlleinerziehenden } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoFuerAlleinerziehenden";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import { InfoZuAntragstellenden } from "../../abfrageteil/components/AllgemeineAngabenForm/InfoZuAntragstellenden";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
};

export function PersonForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, getValues, handleSubmit, setValue, formState, watch } =
    useForm({
      defaultValues: store.getState().stepPrototyp,
    });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, antragsstellendenStatus());
    },
    [store, onSubmit],
  );

  const pseudonym1Error = get(formState.errors, "pseudonym.ET1") as
    | FieldError
    | undefined;
  const pseudonym2Error = get(formState.errors, "pseudonym.ET2") as
    | FieldError
    | undefined;

  // const initializeAntragstellendeIfAlleinerziehend = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   if ((event.target.value as YesNo) === YesNo.YES) {
  //     setValue("antragstellende", "EinenElternteil");
  //   }
  // };

  const antragstellendeOptions: CustomRadioGroupOption[] = [
    {
      value: "FuerBeide",
      label: "Ja, beide Elternteile sollen Elterngeld bekommen",
    },
    {
      value: "EinenElternteil",
      label: "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen",
    },
    {
      value: "FuerBeideUnentschlossen",
      label: "Wir wissen es noch nicht: Ein Elternteil überlegt noch",
    },
  ];

  const antragstellende = watch("antragstellende");
  const antragsstellendenStatus = (): Antragstellende | undefined => {
    const antragssteller = getValues("antragstellende");
    if (antragssteller != null) {
      return antragssteller;
    }
    return undefined;
  };

  return (
    <form id={id} onSubmit={handleSubmit(submitNachwuchs)} noValidate>
      {elternteil === Elternteil.Eins && (
        <div>
          <p>
            Auf den folgenden Seiten fragen wir alle Informationen zu Person 1
            ab. Sollte es eine weitere Person geben, können hierzu Angaben im
            Anschluss gemacht werden.
          </p>

          <div className="mt-32">
            <h3>Wie heißt Person 1 die Elterngeld erhalten soll?</h3>
            <div className="mt-20">
              <label className="block text-16 mb-4">Vorname Person 1</label>
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

          <div className="mt-32">
            <h3>Sind Sie alleinerziehend?</h3>

            <YesNoRadio
              legend=""
              register={register}
              registerOptions={{
                required: "Dieses Feld ist erforderlich",
                // onChange: initializeAntragstellendeIfAlleinerziehend,
              }}
              name="alleinerziehend"
              errors={formState.errors}
              required
            />

            <div className="mt-16">
              <InfoZuAlleinerziehenden />
            </div>
          </div>
        </div>
      )}

      {elternteil === Elternteil.Zwei && (
        <div className="mt-40">
          <CustomRadioGroup
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="antragstellende"
            errors={formState.errors}
            options={antragstellendeOptions}
            required
            slotBetweenLegendAndOptions={<InfoZuAntragstellenden />}
          />

          {(antragstellende === "FuerBeide" ||
            antragstellende === "FuerBeideUnentschlossen") && (
            <div className="mt-32">
              <h3>Wie heißt Person 2 die Elterngeld erhalten soll?</h3>

              <div className="mt-20">
                <label className="block text-16 mb-4">Vorname Person 2</label>
                <input
                  className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
                  {...register("pseudonym.ET2", {
                    required: "Dieses Feld ist erforderlich",
                  })}
                  required
                />
                {!!pseudonym2Error && (
                  <p className="mt-8 text-14 text-danger">
                    {pseudonym2Error.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
