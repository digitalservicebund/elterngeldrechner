import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  ElternteilTaetigkeitenAbfrage,
  ElternteilTaetigkeitenAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/CustomCheckbox";
import { Page } from "@/application/features/components/Page";
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
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";
import { bestimmeEinkommensarten } from "./tracking";
import { posthog } from "@/application/user-tracking";

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

  const form = useForm<ElternteilTaetigkeitenAbfrage>({
    resolver: zodResolver(ElternteilTaetigkeitenAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilTaetigkeitenAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });
  const { register, handleSubmit, formState } = form;
  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(form.subscribe);

  const onSubmit = async (values: ElternteilTaetigkeitenAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
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

  const eventStream = filtereValideEventHistorie();
  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const showGeneralErrorMessage =
    !!formErrors.hatPeriodenOhneEinkommen?.message;
  const generalErrorId = "keine-auswahl-fehler";

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 className="mb-10">
            Wählen Sie alles aus, was vom Kalenderjahr{" "}
            {betrachtungszeitraum.von.year} bis zum Geburtsdatum{" "}
            {geburtsdatumString} auf {vorname} zutrifft:
          </h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld festzulegen. Der Bemessungszeitraum ist die Zeit vor der Geburt, in der Ihr Einkommen geprüft wird. Daraus wird die Höhe Ihres Elterngeldes berechnet."
          />

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istNichtSelbststaendig"
            label={`${vorname} war oder ist angestellt`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel in Vollzeit, Teilzeit, als Minijob, in Ausbildung,
              Freiwilligendienst.
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istSelbststaendig"
            label={`${vorname} war oder ist selbstständig`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel Gewerbe (Online-Shop, Handwerk, Handel), Land- oder
              Forstbetrieb, Freiberuflichkeit, Selbstständig (GbR, GmbH,
              Beteiligung).
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="istVerbeamtet"
            label={`${vorname} war oder ist verbeamtet`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel als Lehrer oder Lehrerin, im Polizeidienst, in der
              Stadtverwaltung oder während des Referendariats.
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            registerOptions={{ deps: ["hatPeriodenOhneEinkommen"] }}
            name="hatAndereLeistungen"
            label={`${vorname} erhielt oder erhält Sozialleistungen oder Lohnersatzleistungen`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel BAföG, Bürgergeld, Arbeitslosengeld, Krankengeld oder
              Elterngeld.
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            name="hatPeriodenOhneEinkommen"
            label={`${vorname} hatte oder hat kein Einkommen`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel während eines Studiums, unbezahlter Urlaub oder als
              Hausfrau oder Hausmann.
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
