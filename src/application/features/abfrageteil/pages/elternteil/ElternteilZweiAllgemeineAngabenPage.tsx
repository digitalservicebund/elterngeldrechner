import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  ElternteilZweiAllgemeineAngaben,
  ElternteilZweiAllgemeineAngabenSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeAnzahlKinder } from "@/application/features/abfrageteil/domain/findeAnzahlKinder";
import { findeAusklammerungen } from "@/application/features/abfrageteil/domain/findeAusklammerungen";
import { findeGeburtsdatum } from "@/application/features/abfrageteil/domain/findeGeburtsdatum";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { findeInformationenZumMutterschutz } from "@/application/features/abfrageteil/domain/findeInformationenZumMutterschutz";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";
import { Elternteil } from "@/monatsplaner";

export function ElternteilZweiAllgemeineAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilZweiAllgemeineAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, watch, subscribe } = useForm({
    resolver: zodResolver(ElternteilZweiAllgemeineAngabenSchema),
    defaultValues: encodeSafely(
      ElternteilZweiAllgemeineAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const eventStream = filtereValideEventHistorie();
  const istErsterElternteilImMutterschutz =
    findeInformationenZumMutterschutz(
      eventStream,
      findeAnzahlKinder(eventStream),
    )?.empfaenger === Elternteil.Eins;
  const warErsterElternteilSchwangerschaftsbedingtKrank = findeAusklammerungen(
    eventStream,
    0,
  ).some(
    (ausklammerung) => ausklammerung.grund === "erkrankungSchwangerschaft",
  );
  const istSchwangerschaftsbedingteErkrankungMoeglich =
    !istErsterElternteilImMutterschutz &&
    !warErsterElternteilSchwangerschaftsbedingtKrank;

  const geschwisterkinder = findeGeschwisterkinder(eventStream);

  const onSubmit = async (values: ElternteilZweiAllgemeineAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: {
        ...values,
        istImMutterschutz: istErsterElternteilImMutterschutz
          ? false
          : values.istImMutterschutz,
      },
      dependentValues: {
        istSchwangerschaftsbedingteErkrankungMoeglich,
        anzahlGeschwister: geschwisterkinder.length,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  const nameInForm = watch("name");
  const vorname = nameInForm?.trim() || "Person 2";

  const geburtstdatum = findeGeburtsdatum(eventStream);
  const heute = Temporal.Now.plainDateISO();
  const geburtIstErfolgt = Temporal.PlainDate.compare(heute, geburtstdatum) > 0;

  const personNameInputIdentifier = useId();

  return (
    <Page heading="Angaben Person 2">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mt-20">
          <h3 className="mb-10">
            Wie heißt Person 2, die Elterngeld erhalten soll?
          </h3>

          <InfoText
            question="Warum soll ich einen Vornamen angeben?"
            answer="Wir fragen nach einem Vornamen, damit Sie bei der Planung einen guten Überblick haben. Falls Sie sich entscheiden, Ihre Daten in den Antrag zu übertragen, können wir Sie dort eindeutig zuordnen."
          />

          <label
            className={classNames("mb-4 mt-20 block text-16", {
              "text-danger": formErrors.name,
            })}
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

        {!istErsterElternteilImMutterschutz ? (
          <CustomRadioGroup
            className="mt-16"
            legend={
              <h3 className="mb-10">
                {geburtIstErfolgt
                  ? `War ${vorname} im Mutterschutz?`
                  : `Wird ${vorname} im Mutterschutz sein?`}
              </h3>
            }
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
                    <li>
                      das Mutterschaftsgeld der gesetzlichen Krankenkassen
                    </li>
                    <li>den Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
                    <li>
                      die Bezüge für Beamtinnen während des Mutterschutzes
                    </li>
                  </ul>

                  <p className="mt-20 font-bold">
                    Sie sind noch ganz am Anfang Ihrer Schwangerschaft?
                  </p>
                  <p>
                    Auch wenn der Termin noch weit weg ist: Wählen Sie “Ja”,
                    wenn Sie zum Zeitpunkt der Geburt angestellt oder verbeamtet
                    sind. Dann steht Ihnen der Mutterschutz gesetzlich zu.
                  </p>
                </>
              }
            />
          </CustomRadioGroup>
        ) : (
          <input type="hidden" value="no" {...register("istImMutterschutz")} />
        )}

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
