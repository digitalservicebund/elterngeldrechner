import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitUnleichesEinkommenAngaben,
  TaetigkeitUnleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button } from "@/application/components";
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
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

  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum("Nicht-Selbstaendig");
  const formatierterBemessungszeitraum =
    formatiereBemessungszeitraum(bemessungszeitraum);

  const eventStream = filtereValideEventHistorie();
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

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
      const von = vonMonat.toPlainDate({ day: 1 }).toLocaleString("de-DE");
      const bis = bisMonat
        .toPlainDate({ day: bisMonat.daysInMonth })
        .toLocaleString("de-DE");

      return `Zeitraum ${blockNummer}: ${von} – ${bis}`;
    }

    return `Zeitraum ${blockNummer}`;
  };

  return (
    <Page heading="Finanzielle Situation">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-20">
          <div className="rounded bg-grey-light py-10">
            <span className="text-18 px-20 font-bold">
              Bemessungszeitraum: {formatierterBemessungszeitraum}
            </span>
          </div>
          {ausklammerungen.length > 0 ? (
            <div className="rounded-b border-x border-b border-t-0 border-dashed border-grey p-20">
              <h5 className="text-14">Übersprungene Zeiträume:</h5>
              <ul className="ml-32 mt-4 list-disc text-14">
                {ausklammerungen
                  ? ausklammerungen.map((ausklammerung) => (
                      <li key={ausklammerung.von.toString()} className="m-0">
                        {ausklammerung.grund} {ausklammerung.von.toString()} bis{" "}
                        {ausklammerung.bis.toString()}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          ) : null}
        </div>

        <h3 className="mb-10">Details zur angestellten Tätigkeit</h3>

        <div>
          <h5 className="mb-20">
            Wie viel haben Sie von {formatierterBemessungszeitraum} im Monat
            brutto verdient?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          {zeitabschnitte.map((zeitabschnitt, index) => {
            if (!Array.isArray(zeitabschnitt)) {
              return (
                <div
                  key={index}
                  className="my-32 rounded border-dashed p-16"
                  aria-live="polite"
                >
                  <div className="pl-32">
                    <h4 className="italic">Übersprungener Zeitraum:</h4>
                    <p>
                      {zeitabschnitt.grund} {zeitabschnitt.von.toLocaleString()}{" "}
                      bis {zeitabschnitt.bis.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            }

            const einkommensBlockNummer = zeitabschnitte
              .slice(0, index + 1)
              .filter(Array.isArray).length;

            return (
              <div key={index} className="bg-off-white p-40 pt-32">
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

        <div className="flex gap-16">
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
