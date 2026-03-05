import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilZweitePersonAngaben,
  ElternteilZweitePersonAngabenSchema,
} from "./ElternteilSchema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilZweitePersonAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilZweitePersonAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(ElternteilZweitePersonAngabenSchema),
    shouldUnregister: true,
    defaultValues: encodeSafely(
      ElternteilZweitePersonAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilZweitePersonAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute));
  };

  const wirdZweitePersonBeruecksichtigt = watch(
    "wirdZweitePersonBeruecksichtigt",
  );

  const personNameInputIdentifier = useId();

  return (
    <Page heading="Angaben Person 2">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">
            Sollen beide Elternteile Elterngeld bekommen?
          </h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Planen Sie Ihr Elterngeld gemeinsam – wenn das für Sie möglich ist. Manchmal möchte ein Elternteil kein Elterngeld bekommen, zum Beispiel weil das zweite Einkommen gebraucht wird."
          />

          <CustomRadioGroup
            className="mt-16"
            legend=""
            errors={formErrors}
            register={register}
            name="wirdZweitePersonBeruecksichtigt"
            options={[
              {
                value: "yes",
                label: "Ja, beide Elternteile sollen Elterngeld bekommen",
              },
              {
                value: "no",
                label:
                  "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen",
              },
              {
                value: "unknown",
                label: "Wir wissen es noch nicht: Ein Elternteil überlegt noch",
              },
            ]}
          />
        </div>

        {(wirdZweitePersonBeruecksichtigt === "yes" ||
          wirdZweitePersonBeruecksichtigt === "unknown") && (
          <div className="mt-20">
            <h3 className="mb-10">
              Wie heißt Person 2 die Elterngeld erhalten soll?
            </h3>

            <InfoText
              question="Warum soll ich einen Vornamen angeben?"
              answer="Wir fragen nach einem Vornamen, damit Sie bei der Planung einen guten Überblick haben. Falls Sie sich entscheiden, Ihre Daten in den Antrag zu übertragen, können wir Sie dort eindeutig zuordnen."
            />

            <label
              className="mb-4 mt-20 block text-16"
              htmlFor={personNameInputIdentifier}
            >
              Vorname Person 2
            </label>

            <input
              id={personNameInputIdentifier}
              className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
              {...register("name")}
            />

            {"name" in formErrors && (
              <p className="mt-8 text-14 text-danger">
                {formErrors.name?.message}
              </p>
            )}
          </div>
        )}

        {/* TODO: Input für Mutterschutz */}

        <div className="mt-40 flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </form>
    </Page>
  );
}
