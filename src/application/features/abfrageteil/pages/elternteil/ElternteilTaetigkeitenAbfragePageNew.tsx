import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  ElternteilTaetigkeitenAbfrageNew as ElternteilTaetigkeitenAbfrage,
  ElternteilTaetigkeitenAbfrageSchemaNew as ElternteilTaetigkeitenAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/CustomCheckbox";
import { Page } from "@/application/features/components/Page";
import { findeAlleinerziehend } from "@/application/features/abfrageteil/domain/findeAlleinerziehend";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { bestimmeEinkommensarten } from "./tracking";
import { posthog } from "@/application/user-tracking";
import { sindBeideElternteile } from "../../domain/sindBeideElternteile";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function ElternteilTaetigkeitenAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const istPersonAlleinerziehend = findeAlleinerziehend(eventStream);
  const wirdZweitePersonBeruecksichtigt = sindBeideElternteile(eventStream);

  const form = useFormWithValidationTracking<ElternteilTaetigkeitenAbfrage>({
    resolver: zodResolver(ElternteilTaetigkeitenAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilTaetigkeitenAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });
  const { register, handleSubmit, formState } = form;
  const { errors: formErrors } = formState;

  const onSubmit = async (values: ElternteilTaetigkeitenAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        istPersonAlleinerziehend,
        wirdZweitePersonBeruecksichtigt,
      },
    };

    dispatch(event);

    const superProperty = `einkommensarten_elternteil_${routeParams.elternteilIndex + 1}`;

    posthog.register({ [superProperty]: bestimmeEinkommensarten(values) });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const { berechneBetrachtungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const betrachtungszeitraum = berechneBetrachtungszeitraum();
  const geburtsdatumString = betrachtungszeitraum.bis.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const showGeneralErrorMessage =
    !!formErrors.hatPeriodenOhneEinkommen?.message;
  const generalErrorId = "keine-auswahl-fehler";

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>
            Bitte wählen Sie alles aus, was auf {vorname} vom Kalenderjahr{" "}
            {betrachtungszeitraum.von.year} bis zum Geburtsdatum des Kindes am{" "}
            {geburtsdatumString} zutrifft:
          </h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld festzulegen. Das ist die Zeit vor der Geburt Ihres Kindes, aus der Ihr Einkommen für die Berechnung des Elterngeldes verwendet wird. Welche Zeit genau berücksichtigt wird, hängt von Ihrer persönlichen Situation ab."
          />

          <CustomCheckbox
            className="font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istNichtSelbststaendig"
            label={`${vorname} war angestellt`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="mt-0 font-regular">
              (sozialversicherungspflichtig mit Steuerklasse) zum Beispiel in
              Vollzeit, Teilzeit, Nebenjob oder in Ausbildung
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="hatMinijob"
            label={`${vorname} hatte einen Minijob`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="mt-0 font-regular">
              (ohne Steuerklasse) zum Beispiel als Aushilfe im Einzelhandel,
              Gastronomie oder Babysitten
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istSelbststaendig"
            label={`${vorname} war selbstständig`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="mt-0 font-regular">
              zum Beispiel mit eigenem Gewerbe, als Freiberufler oder in der
              Land- und Forstwirtschaft
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istVerbeamtet"
            label={`${vorname} war Beamtin`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          />

          <CustomCheckbox
            className="font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="hatAndereLeistungen"
            label={`${vorname} erhielt Sozialleistungen oder Lohnersatzleistungen`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="mt-0 font-regular">
              zum Beispiel Bürgergeld, Arbeitslosengeld, Krankengeld oder
              Elterngeld für ein älteres Kind
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="font-bold"
            register={register}
            name="hatPeriodenOhneEinkommen"
            label={`${vorname} hatte kein Einkommen`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="mt-0 font-regular">
              zum Beispiel als Hausfrau oder Hausmann
            </p>
          </CustomCheckbox>

          {!!showGeneralErrorMessage && (
            <p
              id={generalErrorId}
              className="text-red-500 font-medium mt-4 text-danger"
              role="alert"
              aria-live="assertive"
              aria-atomic
            >
              {formErrors.hatPeriodenOhneEinkommen?.message}
            </p>
          )}
        </div>

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
