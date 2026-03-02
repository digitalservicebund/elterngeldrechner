import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilZweitePersonAngaben,
  ElternteilZweitePersonAngabenSchema,
} from "./ElternteilSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { InfoZuVornamen } from "@/application/features/abfrageteil/components/AllgemeineAngabenForm/InfoZuVornamen";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilZweitePersonAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilZweitePersonAngaben;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(ElternteilZweitePersonAngabenSchema),
    shouldUnregister: true,
    defaultValues: encodeSafely(
      ElternteilZweitePersonAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilZweitePersonAngaben) => {
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

  const wirdZweitePersonBeruecksichtigt = watch(
    "wirdZweitePersonBeruecksichtigt",
  );

  const personNameInputIdentifier = useId();

  return (
    <Page heading="Angaben Person 2">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">
            Sollen beide Elternteile Elterngeld bekommen?
          </h3>

          {/* <InfoZuVornamen /> */}

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="wirdZweitePersonBeruecksichtigt"
            options={[
              {
                value: "yes",
                label: "Ja, beide Elternteile sollen Elterngeld bekommen",
              },
              {
                value: "no",
                label:
                  "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen",
              },
              {
                value: "unknown",
                label: "Wir wissen es noch nicht: Ein Elternteil überlegt noch",
              },
            ]}
          />
        </div>

        {(wirdZweitePersonBeruecksichtigt === "yes" ||
          wirdZweitePersonBeruecksichtigt === "unknown") && (
          <div className="mt-20">
            <h3 className="mb-10">
              Wie heißt Person 2 die Elterngeld erhalten soll?
            </h3>

            <InfoZuVornamen />

            <label
              className="mb-4 mt-20 block text-16"
              htmlFor={personNameInputIdentifier}
            >
              Vorname Person 2
            </label>

            <input
              id={personNameInputIdentifier}
              className="border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
              {...register("name")}
            />

            {"name" in formErrors && (
              <p className="mt-8 text-14 text-danger">
                {formErrors.name?.message}
              </p>
            )}
          </div>
        )}

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
