import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitUnleichesEinkommenAngaben,
  TaetigkeitUnleichesEinkommenAngabenSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { MonatsgenauEinkommensAbfrage } from "@/application/features/abfrageteil/pages/taetigkeit/MonatsgenauEinkommensAbfrage";
import { Page } from "@/application/features/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil/domain/findeAusklammerungen";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
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
import { useFormWithValidationTracking } from "@/application/features/abfrageteil/hooks/useFormWithValidationTracking";

export function ElternteilTaetigkeitenAngestelltEinkommenDetailliertPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute =
    Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert;
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

  const { handleSubmit, control } = useFormWithValidationTracking({
    resolver: zodResolver(TaetigkeitUnleichesEinkommenAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitUnleichesEinkommenAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const onSubmit = async (values: TaetigkeitUnleichesEinkommenAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <div className="text-container">
            <h3>Wie viel hat {vorname} pro Monat brutto verdient?</h3>
            <p>
              Wir errechnen aufgrund Ihrer Angaben ein monatliches
              Durchschnittsgehalt.
            </p>
            <p>
              Für die Monate, in denen Sie kein Einkommen, Sozialleistungen oder
              Einkommensersatzleistungen erhalten haben, geben Sie “0” ein.
            </p>
          </div>

          <InfoText
            question="Wo finde ich das monatliche Brutto?"
            answer={
              <>
                <p>
                  Sie finden Ihr monatliches Bruttogehalt auf Ihrer
                  Gehaltsabrechnung (meist als „Brutto“ oder „Gesamtbrutto“
                  bezeichnet).
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
                <p>
                  Da die Monate einzeln eingetragen werden, müssen Sie
                  Sonderzahlungen in den betroffenen Monaten selbst
                  herausrechnen. Tragen Sie nur das feste, monatliche Gehalt
                  ein.
                </p>
              </>
            }
          />

          <MonatsgenauEinkommensAbfrage
            bemessungszeitraum={bemessungszeitraum}
            ausklammerungen={ausklammerungen}
            control={control}
          />
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
