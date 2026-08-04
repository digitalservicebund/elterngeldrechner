import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitEinkommenGleichVerteiltAbfrage,
  TaetigkeitEinkommenGleichVerteiltAbfrageSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
// import { BemessungszeitraumKurzuebersicht } from "@/application/features/abfrageteil/components/BemessungszeitraumKurzuebersicht";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
// import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
// import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
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

export function ElternteilTaetigkeitenAngestelltAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAngestelltAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(TaetigkeitEinkommenGleichVerteiltAbfrageSchema),
    defaultValues: encodeSafely(
      TaetigkeitEinkommenGleichVerteiltAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: TaetigkeitEinkommenGleichVerteiltAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const eventStream = filtereValideEventHistorie();
  // const taetigkeiten = findeTaetigkeiten(
  //   eventStream,
  //   routeParams.elternteilIndex,
  // );
  // const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  // const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
  //   routeParams.elternteilIndex,
  // );
  // const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <CustomRadioGroup
          legend={`Wie hat ${vorname} im Bemessungszeitraum pro Monat
              verdient?`}
          errors={formErrors}
          register={register}
          name="istEinkommenGleichVerteilt"
          options={[
            {
              value: "yes",
              label: `${vorname} hat jeden Monat gleich viel verdient`,
            },
            {
              value: "no",
              label: `${vorname} hat unterschiedlich viel verdient`,
            },
          ]}
        >
          <div className="input-container">
            <div className="text-container">
              <p className="mt-0">
                Einmalzahlungen (wie Weihnachtsgeld) zählen hier nicht als
                unterschiedlich. Es geht nur um das regelmäßige, laufende
                Gehalt.
              </p>
              <p>
                Beachten Sie: Je genauer Ihre Angaben sind, desto besser kann
                der Rechner das Elterngeld für Sie berechnen.
              </p>
            </div>

            <InfoText
              question="Was bedeutet immer gleich viel verdient?"
              answer={
                <>
                  <p>
                    Wählen Sie gleich viel verdient, wenn Sie immer das gleiche
                    feste Bruttogehalt oder den gleichen Stundenlohn hatten.
                  </p>
                  <p>
                    Wählen Sie unterschiedlich viel verdient, wenn sich das
                    monatliche Gehalt verändert hat (zum Beispiel durch eine
                    Gehaltserhöhung oder einen Jobwechsel).
                  </p>
                  <p className="font-bold">
                    Wichtig – Sonderzahlungen zählen nicht mit.
                  </p>
                  <p>
                    Für die Berechnung des Elterngeldes werden keine
                    Einmalzahlungen berücksichtigt. Bitte lassen Sie folgende
                    Zahlungen außer Acht, zum Beispiel:
                  </p>
                  <ul>
                    <li>
                      Weihnachtsgeld, Urlaubsgeld oder ein 13. oder 14.
                      Monatsgehalt
                    </li>
                    <li>
                      Einmalige Boni, Provisionen, Tantiemen oder Abfindungen
                    </li>
                  </ul>
                </>
              }
            />
          </div>
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
