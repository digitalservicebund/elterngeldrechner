import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { UngeborenesKind, UngeborenesKindSchema } from "./KindSchema";
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
import { trackNutzergruppe } from "@/application/user-tracking/metrics";

export function UngeborenesKindPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.UngeborenesKindAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(UngeborenesKindSchema),
    defaultValues: encodeSafely(UngeborenesKindSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: UngeborenesKind) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    trackNutzergruppe(
      new Date(
        values.errechneterEntbindungstermin.toZonedDateTime("UTC")
          .epochMilliseconds,
      ),
    );

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute));
  };

  const entbindungsterminInputIdentifier = useId();
  const anzahlKinderInputIdentifier = useId();

  return (
    <Page heading="Angaben zur Geburt">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 className="mb-10">
            Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
          </h3>

          <InfoText
            question="Was ist der errechnete Entbindungstermin?"
            answer='Den errechneten Entbindungstermin finden Sie in Ihrem Mutterpass unter dem Abschnitt "Voraussichtlicher Entbindungstermin" oder auf den Ultraschallberichten.'
          />

          <label
            className={classNames("mb-4 mt-20 block text-16", {
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

        <div className="mt-20">
          <h3 id={anzahlKinderInputIdentifier}>
            Wie viele Kinder werden geboren?
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
