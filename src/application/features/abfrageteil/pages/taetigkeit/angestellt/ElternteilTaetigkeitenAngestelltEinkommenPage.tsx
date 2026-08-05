import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitGleichesEinkommenAngabenSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
import { Page } from "@/application/features/components/Page";
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
import { ElternteilTaetigkeitenUebersichtsBox } from "../ElternteilTaetigkeitenUebersichtsBox";

export function ElternteilTaetigkeitenAngestelltEinkommenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAngestelltEinkommen;
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
    resolver: zodResolver(TaetigkeitGleichesEinkommenAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitGleichesEinkommenAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const onSubmit = async (values: TaetigkeitGleichesEinkommenAngaben) => {
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

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <ElternteilTaetigkeitenUebersichtsBox
          currentRoute={currentRoute}
          taetigkeitIndex={routeParams.angestelltIndex}
          taetigkeitenFlow={taetigkeitenFlow}
          bemessungszeitraum={bemessungszeitraum}
        />

        <div className="input-container">
          <h3>Wie viel hat {vorname} im Monat brutto verdient?</h3>

          <InfoText
            question="Wo finde ich die Angabe zu meinem Bruttogehalt?"
            answer={
              <>
                <p>
                  Am genauesten finden Sie Ihr monatliches Bruttogehalt auf
                  Ihrer Gehaltsabrechnung (meist als „Brutto“ oder
                  „Gesamtbrutto“ bezeichnet).
                </p>
                <p>
                  Auf Ihrer Lohnsteuerbescheinigung steht das Jahresbrutto. Wenn
                  Sie das ganze Jahr gleich viel verdient haben, können Sie
                  diesen Betrag durch 12 teilen, um einen durchschnittlichen
                  Monatswert zu berechnen.
                </p>
                <p className="font-bold">
                  Wichtig – Sonderzahlungen weglassen:
                </p>
                <p>
                  Bitte rechnen Sie Einmalzahlungen (wie Weihnachtsgeld,
                  Urlaubsgeld, ein 13./14. Monatsgehalt oder Boni) nicht in den
                  Betrag ein. Tragen Sie nur das reine, regelmäßige Grundgehalt
                  ein.
                </p>
              </>
            }
          />

          <CurrencyInput
            control={control}
            name="durchschnittlichesMonatsbrutto"
            label="Monatliches Brutto-Einkommen"
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
