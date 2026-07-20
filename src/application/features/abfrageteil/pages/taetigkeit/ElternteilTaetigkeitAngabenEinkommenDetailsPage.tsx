import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import { useId, useMemo } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitUnleichesEinkommenAngaben,
  TaetigkeitUnleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { AusklammerungsZeitraumBox } from "@/application/features/abfrageteil/pages/taetigkeit/AusklammerungsZeitraumBox";
import { BemessungszeitraumKurzuebersicht } from "@/application/features/abfrageteil/components/BemessungszeitraumKurzuebersicht";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
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
import {
  Ausklammerung,
  gruppiereBemessungszeitraum,
} from "@/bemessungszeitraumrechner";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function ElternteilTaetigkeitAngabenEinkommenDetailsPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenEinkommenDetails;
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
      dependentValues: {
        istMischeinkunft,
      },
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

  function istGruppierterZeitabschnittAusklammerung(
    zeitabschnitt: Temporal.PlainYearMonth[] | Ausklammerung[],
  ): zeitabschnitt is Ausklammerung[] {
    const ersterZeitabschnitt = zeitabschnitt[0];
    return (
      !!ersterZeitabschnitt &&
      !Array.isArray(ersterZeitabschnitt) &&
      "grund" in ersterZeitabschnitt
    );
  }

  const zeitabschnitte = gruppiereBemessungszeitraum({
    bemessungszeitraum,
    ausklammerungen,
  });

  const { gruppierteZeitabschnitte, alleEinkommensMonate } = useMemo(() => {
    const initialAcc = {
      gruppierteZeitabschnitte: [] as Array<
        Temporal.PlainYearMonth[] | Ausklammerung[]
      >,
      alleEinkommensMonate: [] as Temporal.PlainYearMonth[],
    };

    const result = zeitabschnitte.reduce((acc, curr) => {
      const lastGroup =
        acc.gruppierteZeitabschnitte[acc.gruppierteZeitabschnitte.length - 1];

      if (Array.isArray(curr)) {
        acc.gruppierteZeitabschnitte.push(curr);
        acc.alleEinkommensMonate.push(...curr);
      } else {
        if (lastGroup && istGruppierterZeitabschnittAusklammerung(lastGroup)) {
          lastGroup.push(curr);
        } else {
          acc.gruppierteZeitabschnitte.push([curr]);
        }
      }

      return acc;
    }, initialAcc);

    return {
      gruppierteZeitabschnitte: result.gruppierteZeitabschnitte,
      alleEinkommensMonate: result.alleEinkommensMonate,
    };
  }, [zeitabschnitte]);

  const berechneMonatsindex = (
    aktuellerMonat: Temporal.PlainYearMonth,
    alleMonate: Temporal.PlainYearMonth[],
  ): number => {
    return alleMonate.findIndex((monat) => monat.equals(aktuellerMonat));
  };

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="text-container">
          <h3>Details zur Tätigkeit als Angestellte oder Angestellter</h3>

          <BemessungszeitraumKurzuebersicht
            bemessungszeitraum={bemessungszeitraum}
            taetigkeitenFlow={taetigkeitenFlow}
          />

          <p>
            Je genauer Ihre Angaben sind, desto besser kann der Rechner das
            Elterngeld für Sie ausrechnen.
          </p>
        </div>

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

          {gruppierteZeitabschnitte.map((zeitabschnitt, index) => {
            if (istGruppierterZeitabschnittAusklammerung(zeitabschnitt)) {
              return (
                <div key={index}>
                  <AusklammerungsZeitraumBox ausklammerungen={zeitabschnitt} />
                </div>
              );
            }

            return (
              <div key={index} className="bg-off-white p-40 pt-32">
                <div className="input-container pl-8">
                  {zeitabschnitt.map((month) => {
                    const monatsIndex = berechneMonatsindex(
                      month,
                      alleEinkommensMonate,
                    );
                    const label = `${month.toPlainDate({ day: 1 }).toLocaleString("de-DE", { month: "long", year: "numeric" })} Brutto-Einkommen`;

                    return (
                      <CurrencyInput
                        control={control}
                        name={`monatsbrutto.${monatsIndex}`}
                        key={month.toString()}
                        label={label}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
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
