import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAllgemeineAngaben,
  ElternteilAllgemeineAngabenSchema,
} from "./ElternteilSchema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilAllgemeineAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAllgemeineAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilAllgemeineAngabenSchema),
    defaultValues: encodeSafely(
      ElternteilAllgemeineAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAllgemeineAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const personNameInputIdentifier = useId();

  return (
    <Page heading="Angaben Person 1">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="-mt-20">
          Auf den folgenden Seiten fragen wir alle Informationen zu Person 1 ab.
          Sollte es eine weitere Person geben, können hierzu Angaben im
          Anschluss gemacht werden.
        </p>

        <div>
          <h3 className="mb-10">
            Wie heißt Person 1 die Elterngeld erhalten soll?
          </h3>

          <InfoText
            question="Warum soll ich einen Vornamen angeben?"
            answer="Wir fragen nach einem Vornamen, damit Sie bei der Planung einen guten Überblick haben. Falls Sie sich entscheiden, Ihre Daten in den Antrag zu übertragen, können wir Sie dort eindeutig zuordnen."
          />

          <div className="mt-16">
            <label
              className="mb-4 block text-16"
              htmlFor={personNameInputIdentifier}
            >
              Vorname Person 1
            </label>

            <input
              id={personNameInputIdentifier}
              className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
              {...register("name", {
                required: "Dieses Feld ist erforderlich",
              })}
            />

            {!!formErrors.name && (
              <p className="mt-8 text-14 text-danger">
                {formErrors.name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-10">Ist [Person] alleinerziehend?</h3>

          <InfoText
            question="Was bedeutet alleinerziehend?"
            answer="Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten."
          />

          <CustomRadioGroup
            className="mt-16"
            legend=""
            errors={formErrors}
            register={register}
            name="istAlleinerziehend"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          {/* TODO: Abfrage ob Kind schon geboren */}
          <h3 className="mb-10">War [Person] im Mutterschutz?</h3>

          <InfoText
            question="Was ist Mutterschutz?"
            answer={
              <>
                <p>
                  Während des Mutterschutzes erhalten Sie
                  Mutterschaftsleistungen, zum Beispiel:
                </p>

                <ul className="list-inside list-disc">
                  <li>das Mutterschaftsgeld der gesetzlichen Krankenkassen</li>
                  <li>den Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
                  <li>die Bezüge für Beamtinnen während des Mutterschutzes</li>
                </ul>

                <p>
                  Diese werden – wenn ein Anspruch darauf besteht –
                  normalerweise in den ersten acht Wochen nach der Geburt
                  gezahlt.
                </p>
              </>
            }
          />

          <CustomRadioGroup
            className="mt-16"
            legend=""
            errors={formErrors}
            register={register}
            name="istImMutterschutz"
            options={[
              {
                value: "yes",
                label: "Ja",
              },
              {
                value: "no",
                label: "Nein",
              },
              {
                value: "unknown",
                label: "Ich weiß es noch nicht",
              },
            ]}
          />
        </div>

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
