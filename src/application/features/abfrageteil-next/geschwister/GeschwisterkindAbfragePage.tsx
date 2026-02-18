import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAbfrageSchema,
} from "./GeschwisterSchema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function GeschwisterkindAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeschwisterkindAbfrageSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: GeschwisterkindAbfrage) => {
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

  return (
    <Page heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">Gibt es ältere Geschwisterkinder?</h3>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istVorhanden"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
            slotBetweenLegendAndOptions={
              <InfoText
                question="Wann kann ich einen Geschwisterbonus erhalten?"
                answer={
                  <ul className="list-inside list-disc">
                    Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt
                    <li>
                      mindestens ein weiteres Kind unter 3 Jahren lebt oder
                    </li>
                    <li>
                      mindestens 2 weitere Kinder unter 6 Jahren leben oder
                    </li>
                    <li>
                      mindestens ein weiteres Kind mit Behinderung unter 14
                      Jahren lebt.
                    </li>
                  </ul>
                }
              />
            }
          />
        </div>

        <div className="flex gap-16">
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
