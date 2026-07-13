import { Temporal } from "@js-temporal/polyfill";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  WahrscheinlichGeborenesKind,
  WahrscheinlichGeborenesKindSchema,
} from "./KindSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";
import { posthog } from "@/application/user-tracking";
import { bestimmeNutzergruppe } from "./tracking";

export function WahrscheinlichGeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.WahrscheinlichGeborenesKindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(WahrscheinlichGeborenesKindSchema),
    defaultValues: encodeSafely(
      WahrscheinlichGeborenesKindSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: WahrscheinlichGeborenesKind) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    posthog.register({
      nutzergruppe: bestimmeNutzergruppe(
        Temporal.Now.plainDateISO(),
        values.geburtsdatum,
      ),
    });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  const geburtsdatumInputIdentifier = useId();

  return (
    <Page heading="Angaben zur Geburt">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h3>
          Der Entbindungstermin liegt mehr als 2 Wochen in der Vergangenheit.
          Wir gehen davon aus, dass Ihr Kind schon geboren wurde.
        </h3>
        <div>
          <h3 className="mb-10">
            Wann war das tatsächliche Geburtsdatum Ihres Kindes?
          </h3>

          <InfoText
            question="Was ist das tatsächliche Geburtsdatum?"
            answer="Das tatsächliche Geburtsdatum Ihres Kindes ist das Datum, das in die Geburtsurkunde eingetragen ist. "
          />

          <label
            className={classNames("mb-4 mt-20 block text-16", {
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
