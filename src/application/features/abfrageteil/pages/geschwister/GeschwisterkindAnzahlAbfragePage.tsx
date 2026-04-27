import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAnzahlAbfrage,
  GeschwisterkindAnzahlAbfrageSchema,
} from "./GeschwisterSchema";
import { Button, InfoText } from "@/application/features/components";
import { NumberInput } from "@/application/features/abfrageteil/components";
import { Page } from "@/application/features/components";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";

export function GeschwisterkindAnzahlAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAnzahlAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeschwisterkindAnzahlAbfrageSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAnzahlAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: GeschwisterkindAnzahlAbfrage) => {
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

  const anzahlGeschwisterInputIdentifier = useId();

  return (
    <Page heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 id={anzahlGeschwisterInputIdentifier}>
            Wie viele ältere Geschwisterkinder leben in Ihrem Haushalt?
          </h3>

          <InfoText
            className="mt-10 pb-20"
            question="Was bedeutet „im Haushalt leben“?"
            answer={
              <>
                <p className="mb-0">Ein Kind lebt in Ihrem Haushalt, wenn:</p>
                <ul>
                  <li>es bei Ihnen gemeldet ist.</li>
                  <li>
                    es dauerhaft bei Ihnen wohnt und Sie das Kind versorgen.
                  </li>
                  <li>
                    es das Kind von Ihrem Partner oder Ihrer Partnerin ist.
                  </li>
                  <li>es Ihr Adoptiv-Kind ist.</li>
                </ul>
              </>
            }
          />

          <NumberInput
            {...register("anzahlGeschwister")}
            label="Anzahl Geschwister"
            errors={formErrors.anzahlGeschwister?.message}
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
