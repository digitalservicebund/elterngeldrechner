import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { GeborenesKind, GeborenesKindSchema } from "./KindSchema";
import { Button } from "@/application/components";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function GeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeborenesKindAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeborenesKindSchema),
    defaultValues: encodeSafely(GeborenesKindSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: GeborenesKind) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute));
  };

  const entbindungsterminInputIdentifier = useId();
  const geburtsdatumInputIdentifier = useId();
  const anzahlKinderInputIdentifier = useId();

  return (
    <Page heading="Angaben zum Kind">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3>Herzlichen Glückwunsch!</h3>
          <h3 className="mb-10">
            Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
          </h3>

          <label
            className="block text-16"
            htmlFor={entbindungsterminInputIdentifier}
          >
            Errechneter Entbindungstermin (TT.MM.JJJJ)
          </label>

          <CustomDate
            id={entbindungsterminInputIdentifier}
            error={formErrors.errechneterEntbindungstermin?.message}
            {...register("errechneterEntbindungstermin")}
          />
        </div>

        <div>
          <h3 className="mb-10">
            Wann war das tatsächliche Geburtsdatum Ihres Kindes?
          </h3>

          {/* <InfoZuGeburtsdatum /> */}

          <label
            className="mb-4 mt-20 block text-16"
            htmlFor={geburtsdatumInputIdentifier}
          >
            Geburtsdatum (TT.MM.JJJJ)
          </label>

          <CustomDate
            id={geburtsdatumInputIdentifier}
            error={formErrors.geburtsdatum?.message}
            aria-describedby={anzahlKinderInputIdentifier}
            {...register("geburtsdatum")}
          />
        </div>

        <div className="mt-20">
          <h3 id={anzahlKinderInputIdentifier}>
            Wie viele Kinder wurden geboren?
          </h3>

          <p className="mt-10 pb-20">
            Bei der Geburt von mehreren Kindern geben Sie bitte die Anzahl der
            Kinder an (zum Beispiel 2 bei Zwillingen).
          </p>
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
