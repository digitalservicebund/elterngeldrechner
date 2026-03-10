import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { GeborenesKind, GeborenesKindSchema } from "./KindSchema";
import { Button, InfoText } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
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
    <Page heading="Angaben zur Geburt">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h3>Herzlichen Glückwunsch!</h3>
        <div>
          <h3 className="mb-10">
            Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
          </h3>

          <InfoText
            question="Was ist der errechnete Entbindungstermin?"
            answer='Den errechneten Entbindungstermin finden Sie in Ihrem Mutterpass unter dem Abschnitt "Voraussichtlicher Entbindungstermin" oder auf den Ultraschallberichten.'
          />

          <label
            className="mb-4 mt-20 block text-16"
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

        <div>
          <h3 className="mb-10">
            Wann war das tatsächliche Geburtsdatum Ihres Kindes?
          </h3>

          <InfoText
            question="Was ist das tatsächliche Geburtsdatum?"
            answer="Das tatsächliche Geburtsdatum Ihres Kindes ist das Datum, das in die Geburtsurkunde eingetragen ist. Wenn Ihr Kind besonders früh, das heißt mindestens sechs Wochen vor dem errechneten Termin geboren wurde, können Sie länger Elterngeld bekommen."
          />

          <label
            className="mb-4 mt-20 block text-16"
            htmlFor={geburtsdatumInputIdentifier}
          >
            Geburtsdatum (TT.MM.JJJJ)
          </label>

          <DateInput
            id={geburtsdatumInputIdentifier}
            error={formErrors.geburtsdatum?.message}
            aria-describedby={anzahlKinderInputIdentifier}
            {...register("geburtsdatum")}
          />
        </div>

        <div>
          <h3 id={anzahlKinderInputIdentifier}>
            Wie viele Kinder wurden geboren?
          </h3>

          <p className="mt-10 pb-20">
            Bei der Geburt von mehreren Kindern geben Sie bitte die Anzahl der
            Kinder an (zum Beispiel 2 bei Zwillingen).
          </p>

          <NumberInput
            {...register("anzahl")}
            label="Anzahl der Kinder"
            errors={formErrors.anzahl?.message}
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
