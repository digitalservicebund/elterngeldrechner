import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilGemeinsamePlanungAbfrage,
  ElternteilGemeinsamePlanungAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";

export function ElternteilGemeinsamePlanungAbfragePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilGemeinsamePlanungAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilGemeinsamePlanungAbfrageSchema),
    shouldUnregister: true,
    defaultValues: encodeSafely(
      ElternteilGemeinsamePlanungAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilGemeinsamePlanungAbfrage) => {
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

  const eventStream = filtereValideEventHistorie();
  const vorname = findeVornamen(eventStream, 0);

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <CustomRadioGroup
          className="mt-16"
          legend={
            <h3 className="mb-10">
              Sollen beide Elternteile Elterngeld bekommen?
            </h3>
          }
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
        >
          <InfoText
            question="Warum fragen wir das?"
            answer="Planen Sie Ihr Elterngeld gemeinsam – wenn das für Sie möglich ist. So sehen Sie direkt, wie sich die Monate auf beide verteilen."
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
