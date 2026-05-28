import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  WahrscheinlichGeborenesKind,
  WahrscheinlichGeborenesKindSchema,
} from "./KindSchema";
import { Button, InfoText } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { useValidierungsfehlerTracking } from "@/application/user-tracking";

export function WahrscheinlichGeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.WahrscheinlichGeborenesKindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(WahrscheinlichGeborenesKindSchema),
    defaultValues: encodeSafely(
      WahrscheinlichGeborenesKindSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = (values: WahrscheinlichGeborenesKind) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute));
  };

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
            aria-describedby={geburtsdatumInputIdentifier}
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
