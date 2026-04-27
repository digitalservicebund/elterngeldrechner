import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitGleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { BemessungszeitraumKurzuebersicht } from "@/application/features/abfrageteil/components/BemessungszeitraumKurzuebersicht";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
import { Page } from "@/application/features/components/Page";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
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

export function ElternteilTaetigkeitAngabenEinkommenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenEinkommen;
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
  const istMischeinkunft =
    taetigkeiten.istSelbststaendig && taetigkeiten.istNichtSelbststaendig;

  const { handleSubmit, control, subscribe } = useForm({
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
      dependentValues: {
        istMischeinkunft,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  useValidierungsfehlerTracking(subscribe);

  const taetigkeitenFlow = taetigkeiten.istSelbststaendig
    ? "Selbstaendig"
    : "Nicht-Selbstaendig";
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <p className="-mt-40 mb-20 font-bold text-text-light">
            Details zur Tätigkeit als Angestellte oder Angestellter
          </p>

          <BemessungszeitraumKurzuebersicht
            bemessungszeitraum={bemessungszeitraum}
            taetigkeitenFlow={taetigkeitenFlow}
          />

          <p className="mt-20">
            Je genauer Ihre Angaben sind, desto besser kann der Rechner das
            Elterngeld für Sie ausrechnen.
          </p>
        </div>

        <div>
          <h5 className="mb-10">
            Wie viel hat {vorname} im Bemessungszeitraum pro Monat brutto
            verdient?
          </h5>

          <InfoText
            className="mb-16"
            question="Wo finde ich diese Information?"
            answer={
              <>
                <p className="mb-16">
                  Am genauesten finden Sie Ihr monatliches Bruttogehalt auf
                  Ihrer Gehaltsabrechnung (meist als „Brutto” oder
                  „Gesamtbrutto” bezeichnet). Achten Sie darauf, einen Monat
                  ohne Einmal- oder Sonderzahlungen zu wählen, um Ihr reguläres
                  Gehalt zu bestimmen.
                </p>
                <p>
                  Auf Ihrer Lohnsteuerbescheinigung steht das Jahresbrutto. Wenn
                  Sie das ganze Jahr gleich viel verdient haben, können Sie
                  diesen Betrag durch 12 teilen, um einen durchschnittlichen
                  Monatswert zu berechnen.
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
