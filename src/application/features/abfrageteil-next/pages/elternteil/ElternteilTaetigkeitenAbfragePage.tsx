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
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
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

  const form = useForm<ElternteilTaetigkeitenAbfrage>({
    resolver: zodResolver(ElternteilTaetigkeitenAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilTaetigkeitenAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });
  const { register, handleSubmit, formState } = form;
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

  const { berechneBetrachtungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const betrachtungszeitraum = berechneBetrachtungszeitraum();
  const geburtsdatumString = betrachtungszeitraum.bis.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Page heading="Finanzielle Situation [Person]">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">
            Bitte wählen Sie alles aus, was auf [Person] vom Kalenderjahr{" "}
            {betrachtungszeitraum.von.year} bis zum Geburtsdatum{" "}
            {geburtsdatumString} zutrifft:
          </h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld festzulegen. Das ist die Zeit vor der Geburt Ihres Kindes, aus der Ihr Einkommen für die Berechnung des Elterngeldes verwendet wird. Welche Zeit genau berücksichtigt wird, hängt von Ihrer persönlichen Situation ab."
          />

          {/* TODO-Abfrage: Erklärung unter Label und Label bold */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istNichtSelbststaendig"
            label="[Person] war oder ist angestellt"
            errors={formErrors}
          />

          {/* TODO-Abfrage: Erklärung unter Label und Label bold */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istSelbststaendig"
            label="[Person] war oder ist selbstständig"
            errors={formErrors}
          />

          {/* TODO-Abfrage: Erklärung unter Label und Label bold */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="istVerbeamtet"
            label="[Person] war oder ist Beamtin"
            errors={formErrors}
          />

          {/* TODO-Abfrage: Erklärung unter Label und Label bold */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatAndereLeistungen"
            label="[Person] erhielt oder erhält Sozialleistungen oder Lohnersatzleistungen"
            errors={formErrors}
          />

          {/* TODO-Abfrage: Erklärung unter Label und Label bold */}
          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatKeinEinkommen"
            label="[Person] hatte oder hat kein Einkommen"
            errors={formErrors}
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
