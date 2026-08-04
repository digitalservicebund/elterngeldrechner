import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  WeitereTaetigkeitAbfrage,
  WeitereTaetigkeitAbfrageSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
import { kannDurchschnittAngegebenWerden } from "@/application/features/abfrageteil/domain/kannDurchschnittAngegebenWerden";
// import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { sindBeideElternteile } from "@/application/features/abfrageteil/domain/sindBeideElternteile";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
// import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "@/application/features/abfrageteil/hooks/useFormWithValidationTracking";
import {
  formatiereKardinalzahlAlsWort,
  formatiereOrdnungszahlAlsWortMaskulinAkkusativ,
} from "@/application/features/abfrageteil/pages/taetigkeit/formatiereZahlwoerter";

export function ElternteilTaetigkeitenAngestelltWeiterePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAngestelltWeitere;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const istMinijobVorhanden = taetigkeiten.hatMinijob === true;
  const istSelbststaendigeTaetigkeitVorhanden = taetigkeiten.istSelbststaendig;
  const wirdZweitePersonBeruecksichtigt = sindBeideElternteile(eventStream);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(WeitereTaetigkeitAbfrageSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: WeitereTaetigkeitAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        istMinijobVorhanden,
        istSelbststaendigeTaetigkeitVorhanden,
        kannDurchschnittAngegebenWerden:
          kannDurchschnittAngegebenWerden(taetigkeiten),
        wirdZweitePersonBeruecksichtigt,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  // const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  // const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
  //   routeParams.elternteilIndex,
  // );
  // const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const jaLabel =
    routeParams.angestelltIndex > 0
      ? `Ja, ${vorname} hatte noch einen ${formatiereOrdnungszahlAlsWortMaskulinAkkusativ(routeParams.angestelltIndex + 1)} Nebenjob`
      : `Ja, ${vorname} hatte noch zusätzlich einen Nebenjob`;
  const neinLabel =
    routeParams.angestelltIndex > 0
      ? `Nein, ${vorname} hatte nur ${formatiereKardinalzahlAlsWort(routeParams.angestelltIndex + 1)} angestellte Tätigkeiten`
      : `Nein, ${vorname} hatte nur eine einzige angestellte Tätigkeit`;

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <CustomRadioGroup
          legend={`Hatte ${vorname} noch ${routeParams.angestelltIndex === 0 ? "zusätzlich einen" : "einen weiteren"} Nebenjob?`}
          errors={formErrors}
          register={register}
          name="istWeitereTaetigkeitVorhanden"
          options={[
            {
              value: "yes",
              label: jaLabel,
            },
            {
              value: "no",
              label: neinLabel,
            },
          ]}
        >
          <>
            <p className="mt-0">
              Falls Sie neben Ihrem Hauptjob noch einen weiteren
              steuerpflichtigen Job hatten, tragen Sie ihn hier ein.
            </p>
            {istMinijobVorhanden && (
              <p>
                Minijobs sind hier nicht gemeint, diese Angaben fragen wir
                später ab.
              </p>
            )}
          </>
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
