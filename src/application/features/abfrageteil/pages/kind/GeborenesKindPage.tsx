import { Temporal } from "@js-temporal/polyfill";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import { GeborenesKind, GeborenesKindSchema } from "./KindSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { NumberInput } from "@/application/features/abfrageteil/components/NumberInput";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { istFruehgeburt } from "@/application/features/abfrageteil/domain/istFruehgeburt";
import { bestimmeNutzergruppe, sindMehrlinge } from "./tracking";
import { posthog } from "@/application/user-tracking";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function GeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeborenesKindAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(GeborenesKindSchema),
    defaultValues: encodeSafely(GeborenesKindSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: GeborenesKind) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    posthog.register({
      nutzergruppe: bestimmeNutzergruppe(
        Temporal.Now.plainDateISO(),
        values.geburtsdatum,
      ),
      fruehgeburt: istFruehgeburt(
        values.geburtsdatum,
        values.errechneterEntbindungstermin,
      ),
      mehrlinge: sindMehrlinge(values.anzahl),
    });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  const entbindungsterminInputIdentifier = useId();
  const geburtsdatumInputIdentifier = useId();
  const anzahlKinderInputIdentifier = useId();

  return (
    <Page heading="Angaben zur Geburt">
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Herzlichen Glückwunsch!</h3>
        <div className="input-container">
          <h3>
            Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
          </h3>

          <InfoText
            question="Was ist der errechnete Entbindungstermin?"
            answer='Den errechneten Entbindungstermin finden Sie in Ihrem Mutterpass unter dem Abschnitt "Voraussichtlicher Entbindungstermin" oder auf den Ultraschallberichten.'
          />

          <div>
            <label
              className={classNames("label-small", {
                "text-danger": formErrors.errechneterEntbindungstermin,
              })}
              htmlFor={entbindungsterminInputIdentifier}
            >
              Errechneter Entbindungstermin (TT.MM.JJJJ)
            </label>

            <DateInput
              id={entbindungsterminInputIdentifier}
              error={formErrors.errechneterEntbindungstermin?.message}
              {...register("errechneterEntbindungstermin")}
            />
          </div>
        </div>

        <div className="input-container">
          <h3>Wann war das tatsächliche Geburtsdatum Ihres Kindes?</h3>

          <InfoText
            question="Was ist das tatsächliche Geburtsdatum?"
            answer="Das tatsächliche Geburtsdatum Ihres Kindes ist das Datum, das in die Geburtsurkunde eingetragen ist. Wenn Ihr Kind besonders früh, das heißt mindestens sechs Wochen vor dem errechneten Termin geboren wurde, können Sie länger Elterngeld bekommen."
          />

          <div>
            <label
              className={classNames("label-small", {
                "text-danger": formErrors.geburtsdatum,
              })}
              htmlFor={geburtsdatumInputIdentifier}
            >
              Geburtsdatum (TT.MM.JJJJ)
            </label>

            <DateInput
              id={geburtsdatumInputIdentifier}
              error={formErrors.geburtsdatum?.message}
              {...register("geburtsdatum")}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="text-container">
            <h3 id={anzahlKinderInputIdentifier}>
              Wie viele Kinder wurden geboren?
            </h3>

            <p>
              Bei der Geburt von mehreren Kindern geben Sie bitte die Anzahl der
              Kinder an (zum Beispiel 2 bei Zwillingen).
            </p>
          </div>

          <NumberInput
            {...register("anzahl")}
            label="Anzahl der Kinder"
            errors={formErrors.anzahl?.message}
          />
        </div>

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
