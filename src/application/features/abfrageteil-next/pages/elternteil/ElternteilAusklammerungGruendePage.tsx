import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungGruendeSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilAusklammerungGruendePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungGruendeAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const form = useForm<ElternteilAusklammerungGruende>({
    resolver: zodResolver(ElternteilAusklammerungGruendeSchema),
    defaultValues: encodeSafely(
      ElternteilAusklammerungGruendeSchema,
      letztesGueltigesEvent,
    ),
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAusklammerungGruende) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setValue("hatKeineAusklammerungsgruende", false);
    }
  };

  return (
    <Page heading="Angaben [Person]">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3>Treffen folgende Gründe auf [Person] zu?</h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Wenn Sie hier etwas auswählen, können Monate, in denen Sie weniger verdient haben, übersprungen werden. Für die Berechnung des Elterngeldes werden dann Monate verwendet, in denen Sie mehr verdient haben."
          />

          {/* TODO-Abfrage: InfoText zu Komponente hinzufügen */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatMutterschutzAelteresKind"
            label="[Person] war für ein älteres Kind im Mutterschutz"
            errors={formErrors}
            onChange={(checked) => handleCheckboxChange(checked)}
          />

          {/* TODO-Abfrage: InfoText zu Komponente hinzufügen */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatElterngeldAelteresKind"
            label="[Person] hat für ein älteres Kind Elterngeld bekommen"
            errors={formErrors}
            onChange={(checked) => handleCheckboxChange(checked)}
          />

          {/* TODO-Abfrage: InfoText zu Komponente hinzufügen */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatSchwangerschaftsbedingteErkrankung"
            label="[Person] hatte eine Erkrankung wegen der Schwangerschaft und hatte weniger Einkommen"
            errors={formErrors}
            onChange={(checked) => handleCheckboxChange(checked)}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatKeineAusklammerungsgruende"
            label="Keiner der genannten Gründe"
            errors={formErrors}
            onChange={(checked) => {
              if (checked) {
                setValue("hatMutterschutzAelteresKind", false);
                setValue("hatElterngeldAelteresKind", false);
                setValue("hatSchwangerschaftsbedingteErkrankung", false);
              }
            }}
          />
        </div>

        {/* TODO-Abfrage: Icon bei Alert ändern */}
        <Alert headline="Gut zu wissen für die spätere Antragstellung:">
          Wenn Sie vor der Geburt selbstständig waren und Gründe vorliegen, den
          Bemessungszeitraum zu verschieben (wie auf dieser Seite angegeben),
          können Sie später im Elterngeldantrag beantragen, den
          Bemessungszeitraum um ein Jahr vorzuverlegen.
        </Alert>

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
