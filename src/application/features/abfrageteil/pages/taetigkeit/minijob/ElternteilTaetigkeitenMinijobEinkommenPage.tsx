import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitGleichesEinkommenAngabenSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button } from "@/application/features/components";
// import { BemessungszeitraumKurzuebersicht } from "@/application/features/abfrageteil/components/BemessungszeitraumKurzuebersicht";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
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
import { InfoTextMinijobEinkommen } from "./InfoTextMinijobEinkommen";

export function ElternteilTaetigkeitenMinijobEinkommenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenMinijobEinkommen;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  // const taetigkeiten = findeTaetigkeiten(
  //   eventStream,
  //   routeParams.elternteilIndex,
  // );

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

  // const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  // const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
  //   routeParams.elternteilIndex,
  // );
  // const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>Wie viel hat {vorname} im Minijob im Monat brutto verdient?</h3>

          <InfoTextMinijobEinkommen question="Wo finde ich die Angabe zum Bruttogehalt meines Minijobs?" />

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
