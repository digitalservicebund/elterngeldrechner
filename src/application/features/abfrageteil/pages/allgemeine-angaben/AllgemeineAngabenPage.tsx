import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  AllgemeineAngaben,
  AllgemeineAngabenSchema,
  bundeslaender,
} from "./AllgemeineAngabenSchema";
import { Button, InfoText } from "@/application/features/components";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/CustomSelect";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { posthog } from "@/application/user-tracking";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function AllgemeineAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.AllgemeineAngaben;

  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(AllgemeineAngabenSchema),
    defaultValues: encodeSafely(AllgemeineAngabenSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (name) => ({ value: name, label: name }),
  );

  const onSubmit = async (values: AllgemeineAngaben) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    posthog.register({ bundesland: event.payload.bundesland });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  return (
    <Page id="allgemeine-angaben-page" heading="Allgemeine Angaben">
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>In welchem Bundesland wollen Sie Elterngeld beantragen?</h3>

          <CustomSelect
            autoWidth
            label="Bundesland"
            errors={formErrors}
            register={register}
            options={bundeslandOptions}
            {...register("bundesland")}
          />
        </div>

        <CustomRadioGroup
          legend=<h3 className="mb-10">
            Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von
            mehr als 175.000 Euro?
          </h3>
          errors={formErrors}
          register={register}
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
          name="gesamteinkommenGrenzeUeberschritten"
        >
          <InfoText
            question="Was bedeutet Gesamteinkommen?"
            answer={
              <>
                <p>
                  Wenn Sie besonders viel Einkommen haben, können Sie kein
                  Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu
                  versteuernden Jahreseinkommen von mehr als 175.000 Euro bei
                  Alleinerziehenden, Paaren und getrennt Erziehenden.
                </p>
                <p className="mb-0">
                  Diese Angabe finden Sie beispielsweise auf Ihrem
                  Steuerbescheid.
                </p>
                <p>
                  Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes
                  Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen
                  Sie das Einkommen beider Elternteile zusammen.
                </p>
              </>
            }
          ></InfoText>
        </CustomRadioGroup>

        <div className="button-group">
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
