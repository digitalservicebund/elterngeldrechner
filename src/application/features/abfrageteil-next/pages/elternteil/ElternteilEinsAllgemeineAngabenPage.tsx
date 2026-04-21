import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilEinsAllgemeineAngaben,
  ElternteilEinsAllgemeineAngabenSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/components";
import { CustomRadioGroup } from "@/application/features/abfrageteil-next/components/CustomRadioGroup";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeGeburtsdatum } from "@/application/features/abfrageteil-next/domain/findeGeburtsdatum";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilEinsAllgemeineAngabenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilEinsAllgemeineAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(ElternteilEinsAllgemeineAngabenSchema),
    defaultValues: encodeSafely(
      ElternteilEinsAllgemeineAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilEinsAllgemeineAngaben) => {
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

  const nameInForm = watch("name");
  const vorname = nameInForm?.trim() || "Person 1";

  const eventStream = filtereValideEventHistorie();
  const geburtstdatum = findeGeburtsdatum(eventStream);
  const heute = Temporal.Now.plainDateISO();
  const geburtIstErfolgt = Temporal.PlainDate.compare(heute, geburtstdatum) > 0;

  const personNameInputIdentifier = useId();

  return (
    <Page id="elternteil-eins-page" heading="Angaben Person 1">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <p className="-mt-20">
          Auf den folgenden Seiten fragen wir alle Informationen zu Person 1 ab.
          Sollte es eine weitere Person geben, können hierzu Angaben im
          Anschluss gemacht werden.
        </p>

        <div>
          <h3 className="mb-10">
            Wie heißt Person 1, die Elterngeld erhalten soll?
          </h3>

          <InfoText
            question="Warum soll ich einen Vornamen angeben?"
            answer="Wir fragen nach einem Vornamen, damit Sie bei der Planung einen guten Überblick haben. Falls Sie sich entscheiden, Ihre Daten in den Antrag zu übertragen, können wir Sie dort eindeutig zuordnen."
          />

          <div className="mt-16">
            <label
              className={classNames("mb-4 block text-16", {
                "!text-danger": formErrors.name,
              })}
              htmlFor={personNameInputIdentifier}
            >
              Vorname Person 1
            </label>

            <input
              id={personNameInputIdentifier}
              className={classNames(
                "border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary",
                {
                  "!border-danger focus-within:outline-danger": formErrors.name,
                },
              )}
              {...register("name")}
            />

            {!!formErrors.name && (
              <p className="mt-8 text-14 text-danger">
                {formErrors.name.message}
              </p>
            )}
          </div>
        </div>

        <CustomRadioGroup
          className="mt-16"
          legend=<h3 className="mb-10">Ist {vorname} alleinerziehend?</h3>
          errors={formErrors}
          register={register}
          name="istAlleinerziehend"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Was bedeutet alleinerziehend?"
            answer="Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten."
          />
        </CustomRadioGroup>

        <CustomRadioGroup
          className="mt-16"
          legend=<h3 className="mb-10">
            {geburtIstErfolgt
              ? `War ${vorname} im Mutterschutz?`
              : `Wird ${vorname} im Mutterschutz sein?`}
          </h3>
          errors={formErrors}
          register={register}
          name="istImMutterschutz"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Was ist Mutterschutz?"
            answer={
              <>
                <p>
                  Jede angestellte oder verbeamtete Schwangere hat in
                  Deutschland gesetzlichen Anspruch auf Mutterschutz. Nach dem
                  Mutterschutzgesetz gelten insbesondere Mutterschutzfristen,
                  die 6 Wochen vor der dem errechneten Geburtstermin beginnen
                  und in der Regel 8 Wochen danach enden. Während der
                  Schutzfristen erhalten Sie Mutterschaftsleistungen, zum
                  Beispiel:
                </p>

                <ul>
                  <li>das Mutterschaftsgeld der gesetzlichen Krankenkassen</li>
                  <li>den Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
                  <li>die Bezüge für Beamtinnen während des Mutterschutzes</li>
                </ul>

                <p className="mt-20 font-bold">
                  Sie sind noch ganz am Anfang Ihrer Schwangerschaft?
                </p>
                <p>
                  Auch wenn der Termin noch weit weg ist: Wählen Sie “Ja”, wenn
                  Sie zum Zeitpunkt der Geburt angestellt oder verbeamtet sind.
                  Dann steht Ihnen der Mutterschutz gesetzlich zu.
                </p>
              </>
            }
          />
        </CustomRadioGroup>

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
