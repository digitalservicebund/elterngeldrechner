import { Temporal } from "@js-temporal/polyfill";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import { UngeborenesKind, UngeborenesKindSchema } from "./KindSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { NumberInput } from "@/application/features/abfrageteil/components/NumberInput";
import { Page } from "@/application/features/components/Page";
import { istGeburtWahrscheinlich } from "@/application/features/abfrageteil/domain/istGeburtWahrscheinlich";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { bestimmeNutzergruppe, sindMehrlinge } from "./tracking";
import { posthog } from "@/application/user-tracking";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function UngeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.UngeborenesKindAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(UngeborenesKindSchema),
    defaultValues: encodeSafely(UngeborenesKindSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: UngeborenesKind) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      dependentValues: {
        istGeburtWahrscheinlich: istGeburtWahrscheinlich(
          values.errechneterEntbindungstermin,
          Temporal.Now.plainDateISO(),
        ),
      },
    };

    dispatch(event);

    posthog.register({
      nutzergruppe: bestimmeNutzergruppe(
        Temporal.Now.plainDateISO(),
        values.errechneterEntbindungstermin,
      ),
      mehrlinge: sindMehrlinge(values.anzahl),
    });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  const entbindungsterminInputIdentifier = useId();
  const anzahlKinderInputIdentifier = useId();

  return (
    <Page heading="Angaben zur Geburt">
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>
            Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
          </h3>

          <InfoText
            question="Was ist der errechnete Entbindungstermin?"
            answer="Diesen Termin finden Sie in Ihrem Mutterpass unter „Voraussichtlicher Entbindungstermin“ oder auf Ihren Ultraschall-Berichten."
          />

          <label
            className={classNames("mb-4 block text-16", {
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

        <div className="input-container">
          <div className="text-container">
            <h3 id={anzahlKinderInputIdentifier}>
              Wie viele Kinder werden geboren?
            </h3>

            <p>
              Bei der Geburt von mehreren Kindern geben Sie bitte die Anzahl der
              Kinder an (zum Beispiel 2 bei Zwillingen).
            </p>
          </div>

          <InfoText
            question="Was bedeutet es wenn mehr als ein Kind geboren wird?"
            answer={
              <>
                <p>
                  Wenn Sie mehr als ein Kind bekommen (zum Beispiel Zwillinge
                  oder Drillinge), gibt es Besonderheiten beim Elterngeld:
                </p>
                <ul>
                  <li>
                    Sie bekommen für ein Kind ganz normal Elterngeld. Für jedes
                    weitere Kind erhalten Sie einen Zuschlag.
                  </li>
                  <li>
                    Beim Basiselterngeld sind das 300 € extra pro Monat und
                    Kind.
                  </li>
                  <li>
                    Beim ElterngeldPlus sind das 150 € extra pro Monat und Kind.
                  </li>
                  <li>
                    Sie bekommen das Geld nicht länger ausgezahlt, aber der
                    monatliche Betrag ist höher.
                  </li>
                  <li>
                    Mutterschutz: Nach der Geburt von Mehrlingen haben Sie 12
                    Wochen Mutterschutz (statt 8 Wochen).
                  </li>
                </ul>
              </>
            }
          />

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
