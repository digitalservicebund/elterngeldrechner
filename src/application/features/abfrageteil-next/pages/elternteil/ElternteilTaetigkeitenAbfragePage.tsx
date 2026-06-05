import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilTaetigkeitenAbfrage,
  ElternteilTaetigkeitenAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/components";
import { CustomCheckbox } from "@/application/components/CustomCheckbox";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAlleinerziehend } from "@/application/features/abfrageteil-next/domain/findeAlleinerziehend";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil-next/hooks/useValidierungsfehlerTracking";

export function ElternteilTaetigkeitenAbfragePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

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
      dependentValues: {
        istPersonAlleinerziehend,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = async () => {
    await navigate(findeVorherigenPfad(currentRoute, routeParams));
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
            Bitte wählen Sie alles aus, was auf {vorname} vom Kalenderjahr{" "}
            {betrachtungszeitraum.von.year} bis zum Geburtsdatum{" "}
            {geburtsdatumString} zutrifft:
          </h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Ihre Angaben helfen uns, den Bemessungszeitraum für Ihr Elterngeld festzulegen. Das ist die Zeit vor der Geburt Ihres Kindes, aus der Ihr Einkommen für die Berechnung des Elterngeldes verwendet wird. Welche Zeit genau berücksichtigt wird, hängt von Ihrer persönlichen Situation ab."
          />

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
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
            name="istSelbststaendig"
            label={`${vorname} war oder ist selbstständig`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel Gewerbe (Online-Shop, Handwerk, Handel), Land- oder
              Forstwirtschaft, Freiberuflichkeit, Selbstständig (GbR, GmbH,
              Beteiligung).
            </p>
          </CustomCheckbox>

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            name="istVerbeamtet"
            label={`${vorname} war oder ist verbeamtet`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          />

          <CustomCheckbox
            className="mt-20 font-bold"
            register={register}
            name="hatAndereLeistungen"
            label={`${vorname} erhielt oder erhält Sozialleistungen oder Lohnersatzleistungen`}
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
          >
            <p className="font-regular">
              zum Beispiel Bürgergeld, Arbeitslosengeld, Krankengeld oder
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
              zum Beispiel während eines Studiums, als Hausfrau oder Hausmann.
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
