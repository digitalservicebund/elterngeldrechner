import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilTaetigkeitenAbfrage,
  ElternteilTaetigkeitenAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/components";
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

export function ElternteilTaetigkeitenAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilTaetigkeitenAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilTaetigkeitenAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilTaetigkeitenAbfrage) => {
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

  return (
    <Page heading="">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3>Treffen folgende Gründe auf Sie zu?</h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld festzulegen. Der Bemessungszeitraum ist die Zeit vor der Geburt, in der Ihr Einkommen geprüft wird. Daraus wird die Höhe Ihres Elterngeldes berechnet."
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istNichtSelbststaendig"
            label="Ich war oder bin angestellt"
            errors={formErrors}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istSelbststaendig"
            label="Ich war oder bin selbstständig"
            errors={formErrors}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istVerbeamtet"
            label="Ich war oder bin Beamtin "
            errors={formErrors}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatAndereLeistungen"
            label="Ich erhielt oder erhalte Sozialleistungen oder Lohnersatzleistungen  "
            errors={formErrors}
          />

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatKeinEinkommen"
            label="Ich hatte oder habe kein Einkommen"
            errors={formErrors}
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
