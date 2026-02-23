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
    <Page heading="Finanzielle Situation">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3>Treffen folgende Gründe auf Sie zu?</h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Wenn Sie hier etwas auswählen, kann für die Berechnung Ihres Elterngeldes ein anderer Monat genommen werden. Und zwar der Monat, in dem Sie mehr verdient haben. "
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatMutterschutzAelteresKind"
            label="Ich war für ein älteres Kind im Mutterschutz"
            errors={formErrors}
            onChange={(checked) => handleCheckboxChange(checked)}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatElterngeldAelteresKind"
            label="Ich habe für ein älteres Kind Elterngeld bekommen"
            errors={formErrors}
            onChange={(checked) => handleCheckboxChange(checked)}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatSchwangerschaftsbedingteErkrankung"
            label="Ich hatte eine Erkrankung wegen meiner Schwangerschaft und hatte weniger Einkommen"
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

        <Alert headline="Gut zu wissen für die spätere Antragstellung:">
          Wenn Sie vor der Geburt selbstständig waren und auf dieser Seite einen
          Grund auswählen, können Sie später im Elterngeldantrag beantragen, den
          Bemessungszeitraum aufgrund dieser Angaben um ein Jahr vorzuverlegen.
        </Alert>

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
