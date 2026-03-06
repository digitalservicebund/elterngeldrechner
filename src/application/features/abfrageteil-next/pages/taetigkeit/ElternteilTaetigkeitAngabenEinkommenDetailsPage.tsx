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
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil-next/domain/formatiereBemessungszeitraum";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { gruppiereBemessungszeitraum } from "@/bemessungszeitraumrechner";

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

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(TaetigkeitUnleichesEinkommenAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitUnleichesEinkommenAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: TaetigkeitUnleichesEinkommenAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const taetigkeitenFlow =
    taetigkeiten.hatKeinEinkommen === false &&
    taetigkeiten.istSelbststaendig === true
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
  const formatierterBemessungszeitraum = formatiereBemessungszeitraum(
    bemessungszeitraum,
    true,
  );

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const zeitabschnitte = gruppiereBemessungszeitraum({
    bemessungszeitraum,
    ausklammerungen,
  });
  const alleEinkommensMonate = useMemo(() => {
    return zeitabschnitte
      .filter((zeitabschnitt): zeitabschnitt is Temporal.PlainYearMonth[] =>
        Array.isArray(zeitabschnitt),
      )
      .flat();
  }, [zeitabschnitte]);

  const berechneMonatsindex = (
    aktuellerMonat: Temporal.PlainYearMonth,
    alleMonate: Temporal.PlainYearMonth[],
  ): number => {
    return alleMonate.findIndex((monat) => monat.equals(aktuellerMonat));
  };

  const erstelleZeitabschnittUeberschrift = (
    zeitabschnitt: Temporal.PlainYearMonth[],
    blockNummer: number,
  ): string => {
    if (zeitabschnitt.length === 0) return `Zeitraum ${blockNummer}`;

    const vonMonat = zeitabschnitt[0];
    const bisMonat = zeitabschnitt.at(-1);

    if (vonMonat && bisMonat) {
      const von = vonMonat
        .toPlainDate({ day: 1 })
        .toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      const bis = bisMonat
        .toPlainDate({ day: bisMonat.daysInMonth })
        .toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

      return `Zeitraum ${blockNummer}: ${von} – ${bis}`;
    }

    return `Zeitraum ${blockNummer}`;
  };

  return (
    <Page heading="Details zur Tätigkeit als Angestellte oder Angestellter">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow={taetigkeitenFlow}
        />

        <div>
          <h5 className="mb-20">
            Wie viel hat {vorname} von {formatierterBemessungszeitraum} im Monat
            brutto verdient?
          </h5>

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

          {zeitabschnitte.map((zeitabschnitt, index) => {
            if (!Array.isArray(zeitabschnitt)) {
              return (
                <div key={index}>
                  <BemessungszeitraumBox
                    bemessungszeitraum={[]}
                    ausklammerungen={[zeitabschnitt]}
                    taetigkeitenFlow={taetigkeitenFlow}
                  />
                </div>
              );
            }

            const einkommensBlockNummer = zeitabschnitte
              .slice(0, index + 1)
              .filter(Array.isArray).length;

            return (
              <div key={index} className="mt-20 bg-off-white p-40 pt-32">
                <div className="flex flex-col gap-16 pl-8">
                  <h5>
                    {erstelleZeitabschnittUeberschrift(
                      zeitabschnitt,
                      einkommensBlockNummer,
                    )}
                  </h5>
                  {zeitabschnitt.map((month) => {
                    const monatsIndex = berechneMonatsindex(
                      month,
                      alleEinkommensMonate,
                    );
                    const label = `${month.toPlainDate({ day: 1 }).toLocaleString("de-DE", { month: "long", year: "numeric" })} Brutto-Einkommen`;

                    return (
                      <NumberInput
                        key={month.toString()}
                        {...register(`monatsbrutto.${monatsIndex}`, {
                          valueAsNumber: true,
                          max: {
                            value: 15000,
                            message: "Maximaleinkommen überschritten",
                          },
                          min: {
                            value: 0,
                            message: "Bitte geben Sie ein Einkommen an",
                          },
                        })}
                        label={label}
                        errors={formErrors.monatsbrutto?.[monatsIndex]?.message}
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
