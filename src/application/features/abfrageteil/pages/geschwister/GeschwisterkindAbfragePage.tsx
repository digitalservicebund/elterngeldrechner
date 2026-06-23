import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAbfrageSchema,
} from "./GeschwisterSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";
import { posthog } from "@/application/user-tracking";

export function GeschwisterkindAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(GeschwisterkindAbfrageSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = async (values: GeschwisterkindAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
    };

    dispatch(event);

    posthog.register({
      // Reset the accumulated flag so re-answering the question starts a fresh
      // count; GeschwisterkindAngabenPage re-accumulates it per sibling.
      hat_geschwister: values.istVorhanden,
    });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = async () => {
    await navigate(findeVorherigenPfad(currentRoute));
  };

  return (
    <Page id="geschwister-page" heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <CustomRadioGroup
          legend=<h3 className="mb-10">Gibt es ältere Geschwisterkinder?</h3>
          errors={formErrors}
          register={register}
          name="istVorhanden"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Wann kann ich einen Geschwisterbonus erhalten?"
            answer={
              <>
                <p>Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt</p>
                <ul>
                  <li>mindestens ein weiteres Kind unter 3 Jahren lebt oder</li>
                  <li>mindestens 2 weitere Kinder unter 6 Jahren leben oder</li>
                  <li>
                    mindestens ein weiteres Kind mit Behinderung unter 14 Jahren
                    lebt.
                  </li>
                </ul>
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
