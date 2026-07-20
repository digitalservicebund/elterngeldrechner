import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  AllgemeineAngaben,
  AllgemeineAngabenSchema,
  bundeslaender,
} from "./AllgemeineAngabenSchema";
import { Button, InfoText } from "@/application/features/components";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/CustomSelect";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { posthog } from "@/application/user-tracking";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function AllgemeineAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.AllgemeineAngaben;

  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(AllgemeineAngabenSchema),
    defaultValues: encodeSafely(AllgemeineAngabenSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (name) => ({ value: name, label: name }),
  );

  const onSubmit = async (values: AllgemeineAngaben) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    posthog.register({ bundesland: event.payload.bundesland });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  return (
    <Page id="allgemeine-angaben-page" heading="Allgemeine Angaben">
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>In welchem Bundesland wollen Sie Elterngeld beantragen?</h3>

          <CustomSelect
            autoWidth
            label="Bundesland"
            errors={formErrors}
            register={register}
            options={bundeslandOptions}
            {...register("bundesland")}
          />
        </div>

        <CustomRadioGroup
          legend="Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von
            mehr als 175.000 Euro?"
          errors={formErrors}
          register={register}
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
          name="gesamteinkommenGrenzeUeberschritten"
        >
          <InfoText
            question="Was bedeutet zu versteuerndes Gesamteinkommen?"
            answer={
              <>
                <p>
                  Wenn Ihr Einkommen zu hoch ist, haben Sie keinen Anspruch auf
                  Elterngeld.
                </p>
                <ul>
                  <li>Die Grenze beträgt 175.000 Euro.</li>
                  <li>
                    Sie gilt einheitlich für Paare (gemeinsames Einkommen) und
                    für Alleinerziehende.
                  </li>
                  <li>
                    Entscheidend ist das Einkommen aus dem Kalenderjahr direkt
                    vor der Geburt.
                  </li>
                </ul>

                <p className="font-bold">Welches Einkommen zählt?</p>
                <p>
                  Es zählt nicht das Brutto-Einkommen, sondern das sogenannte zu
                  versteuernde Einkommen. Dieser Wert ist fast immer deutlich
                  niedriger als Ihr eigentliches Gehalt, da viele Beträge
                  abgezogen werden.
                </p>

                <p className="font-bold">Wo finde ich diesen Wert?</p>
                <p>
                  Schauen Sie auf Ihren Einkommensteuerbescheid nach dem Begriff
                  „Zu versteuerndes Einkommen“. Wenn dieser noch nicht vorliegt,
                  können Sie den Wert anhand Ihrer letzten
                  Dezember-Gehaltsabrechnung oder Lohnsteuerbescheinigung
                  schätzen.
                </p>

                <p className="font-bold">
                  Was wird vom Brutto-Einkommen abgezogen?
                </p>
                <p>
                  Ihr zu versteuerndes Einkommen verringert sich vor allem
                  durch:
                </p>
                <ul>
                  <li>
                    Werbungskosten: Automatisch mindestens 1.230 Euro für
                    berufliche Ausgaben (oder mehr, wenn Sie höhere Kosten
                    nachweisen, zum Beispiel Fahrtkosten).
                  </li>
                  <li>
                    Vorsorgeaufwendungen: Ihre Beiträge zur Renten-, Kranken-
                    und Pflegeversicherung.
                  </li>
                  <li>
                    Kinderfreibeträge / Betreuungskosten: Falls Sie bereits
                    Kinder haben.
                  </li>
                </ul>
              </>
            }
          ></InfoText>
        </CustomRadioGroup>

        <div className="button-group">
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
