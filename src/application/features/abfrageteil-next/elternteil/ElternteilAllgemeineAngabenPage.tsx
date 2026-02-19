import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAllgemeineAngaben,
  ElternteilAllgemeineAngabenSchema,
} from "./ElternteilSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { InfoZuAlleinerziehenden } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoFuerAlleinerziehenden";
import { InfoZuVornamen } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuVornamen";
import { InfoZumMutterschutz } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZumMutterschutz";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useElternteilIndex } from "@/application/features/abfrageteil-next/hooks/usePageIndex";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilAllgemeineAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAllgemeineAngaben;
  const elternteilIndex = useElternteilIndex();
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute, {
    elternteilIndex,
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilAllgemeineAngabenSchema),
    defaultValues: encodeSafely(
      ElternteilAllgemeineAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAllgemeineAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: { elternteilIndex },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, { elternteilIndex }));
  };

  const personNameInputIdentifier = useId();

  return (
    <Page heading="Angaben Person 1">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p>
          Auf den folgenden Seiten fragen wir alle Informationen zu Person 1 ab.
          Sollte es eine weitere Person geben, können hierzu Angaben im
          Anschluss gemacht werden.
        </p>

        <div>
          <h3 className="mb-10">
            Wie heißt Person 1 die Elterngeld erhalten soll?
          </h3>

          <InfoZuVornamen />

          <div className="mt-20">
            <label
              className="mb-4 block text-16"
              htmlFor={personNameInputIdentifier}
            >
              Vorname Person 1
            </label>

            <input
              id={personNameInputIdentifier}
              className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
              {...register("name", {
                required: "Dieses Feld ist erforderlich",
              })}
            />

            {!!formErrors.name && (
              <p className="mt-8 text-14 text-danger">
                {formErrors.name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-10">Sind Sie alleinerziehend?</h3>

          <InfoZuAlleinerziehenden />

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istAlleinerziehend"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div className="mt-32">
          <h3 className="mb-10">Sind oder werden Sie im Mutterschutz sein?</h3>

          <InfoZumMutterschutz />

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istImMutterschutz"
            options={[
              {
                value: "yes",
                label: "Ja",
              },
              {
                value: "no",
                label: "Nein",
              },
              {
                value: "unknown",
                label: "Ich weiß es noch nicht",
              },
            ]}
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
