import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitUnleichesEinkommenAngaben,
  TaetigkeitUnleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { CurrencyInput } from "@/application/features/abfrageteil-next/components/CurrencyInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
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
import {
  Ausklammerung,
  gruppiereBemessungszeitraum,
} from "@/bemessungszeitraumrechner";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil-next/hooks/useValidierungsfehlerTracking";

export function ElternteilTaetigkeitAngabenEinkommenDetailsPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

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

  const { handleSubmit, control, subscribe } = useForm({
    resolver: zodResolver(TaetigkeitUnleichesEinkommenAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitUnleichesEinkommenAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const onSubmit = (values: TaetigkeitUnleichesEinkommenAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        istMischeinkunft,
      },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const taetigkeitenFlow = taetigkeiten.istSelbststaendig
    ? "Selbstaendig"
    : "Nicht-Selbstaendig";
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  useValidierungsfehlerTracking(subscribe);

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
    <Page heading="Details zur Tätigkeit als Angestellte oder Angestellter">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h5 className="mb-10">
            Wie viel hat {vorname} im Bemessungszeitraum pro Monat brutto
            verdient?
          </h5>

          <div className="mb-20">
            <p>
              Wir errechnen aufgrund Ihrer Angaben ein monatliches
              Durchschnittsgehalt.
            </p>
            <p>
              Für die Monate in denen Sie kein Einkommen, Sozialleistungen oder
              Einkommensersatzleistungen erhalten haben geben Sie “0” ein.
            </p>
          </div>

          <InfoText
            className="mb-16"
            question="Wo finde ich diese Information?"
            answer={
              <>
                <p className="mb-16">
                  Am genauesten finden Sie Ihr monatliches Bruttogehalt auf
                  Ihrer Gehaltsabrechnung (meist als „Brutto” oder
                  „Gesamtbrutto” bezeichnet).
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

          {gruppierteZeitabschnitte.map((zeitabschnitt, index) => {
            if (istGruppierterZeitabschnittAusklammerung(zeitabschnitt)) {
              return (
                <div key={index}>
                  <BemessungszeitraumBox
                    bemessungszeitraum={[]}
                    ausklammerungen={zeitabschnitt}
                    taetigkeitenFlow={taetigkeitenFlow}
                  />
                </div>
              );
            }

            return (
              <div key={index} className="mt-20 bg-off-white p-40 pt-32">
                <div className="flex flex-col gap-16 pl-8">
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
