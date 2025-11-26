import { useCallback, useId } from "react";
import { FieldError, get, useForm } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { InfoZuAlleinerziehenden } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoFuerAlleinerziehenden";
import { InfoZuAntragstellenden } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuAntragstellenden";
import { InfoZuVornamen } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuVornamen";
import { YesNoRadio } from "@/application/features/abfrageteil/components/common";
import {
  Antragstellende,
  YesNo,
} from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
};

export function AngabenPersonForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const { register, getValues, handleSubmit, formState, watch } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const antragstellende = watch("antragstellende");
  const antragsstellendenStatus = (): Antragstellende | undefined => {
    const antragssteller = getValues("antragstellende");
    if (antragssteller != null) {
      return antragssteller;
    }
    return undefined;
  };

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      if (values.ET1.mutterschutz === YesNo.YES) {
        values.ET2.mutterschutz = null;
      }
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, antragsstellendenStatus());
    },
    [store, onSubmit, antragsstellendenStatus],
  );

  const pseudonym1Error = get(formState.errors, "pseudonym.ET1") as
    | FieldError
    | undefined;
  const pseudonym2Error = get(formState.errors, "pseudonym.ET2") as
    | FieldError
    | undefined;

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

  const mutterschutzOptions: CustomRadioGroupOption[] = [
    {
      value: YesNo.YES,
      label: "Ja",
    },
    {
      value: YesNo.NO,
      label: "Nein",
    },
    {
      value: YesNo.YES,
      label: "Ich weiß es noch nicht",
    },
  ];

  const mutterschutzET1 = getValues("ET1.mutterschutz");

  const personNameInputIdentifier = useId();

  return (
    <form id={id} onSubmit={handleSubmit(submitNachwuchs)} noValidate>
      {elternteil === Elternteil.Eins && (
        <div className="mb-32">
          <p>
            Auf den folgenden Seiten fragen wir alle Informationen zu Person 1
            ab. Sollte es eine weitere Person geben, können hierzu Angaben im
            Anschluss gemacht werden.
          </p>

          <div className="mt-32">
            <h3 className="mb-10">
              Wie heißt Person 1 die Elterngeld erhalten soll?
            </h3>

            <InfoZuVornamen />

            <div className="mt-20">
              <label
                className="mb-4 block text-16"
                htmlFor={personNameInputIdentifier}
              >
                Vorname Person 1
              </label>
              <input
                id={personNameInputIdentifier}
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
            </div>
          </div>

          <div className="mt-32">
            <h3 className="mb-10">Sind Sie alleinerziehend?</h3>

            <InfoZuAlleinerziehenden />

            <YesNoRadio
              className="mt-20"
              legend=""
              register={register}
              registerOptions={{
                required: "Dieses Feld ist erforderlich",
              }}
              name="alleinerziehend"
              errors={formState.errors}
              required
            />
          </div>

          <div className="mt-32">
            <h3 className="mb-10">
              Sind oder werden Sie im Mutterschutz sein?
            </h3>

            <InfoZuAlleinerziehenden />

            <CustomRadioGroup
              className="mt-20"
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="ET1.mutterschutz"
              errors={formState.errors}
              options={mutterschutzOptions}
              required
            />
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
            <>
              <div className="mt-32">
                <h3>Wie heißt Person 2 die Elterngeld erhalten soll?</h3>

                <div className="mt-20">
                  <label
                    className="mb-4 block text-16"
                    htmlFor={personNameInputIdentifier}
                  >
                    Vorname Person 2
                  </label>
                  <input
                    id={personNameInputIdentifier}
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

              {mutterschutzET1 !== YesNo.YES && (
                <div className="mt-32">
                  <h3 className="mb-10">
                    Sind oder werden Sie im Mutterschutz sein?
                  </h3>

                  <InfoZuAlleinerziehenden />

                  <CustomRadioGroup
                    className="mt-20"
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name="ET2.mutterschutz"
                    errors={formState.errors}
                    options={mutterschutzOptions}
                    required
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
}
