import SuccessIcon from "~icons/material-symbols/check-circle-outline";
import { Temporal } from "@js-temporal/polyfill";
import { useNavigate } from "react-router";
import { Button } from "@/application/features/components";
import { Page } from "@/application/features/components/Page";
import { findeAlleinerziehend } from "@/application/features/abfrageteil/domain/findeAlleinerziehend";
import {
  AusklammerungMitGeschwisterindex,
  findeAusklammerungen,
} from "@/application/features/abfrageteil/domain/findeAusklammerungen";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil/domain/formatiereBemessungszeitraum";
import { mappeAusklammerungGrund } from "@/application/features/abfrageteil/domain/mappeAusklammerungGrund";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil/hooks/useBemessungszeitraumrechner";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import {
  Ausklammerung,
  gruppiereBemessungszeitraum,
} from "@/bemessungszeitraumrechner";

export function ElternteilBMZUebersichtPage() {
  const { dispatch, filtereValideEventHistorie } = useEventContext();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenBMZUebersicht;
  const routeParams = useRouteParams(currentRoute);

  const eventStream = filtereValideEventHistorie();

  const istPersonAlleinerziehend = findeAlleinerziehend(eventStream);
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );

  const navigateNextPage = async () => {
    const event: FormEvent = {
      route: currentRoute,
      params: routeParams,
      dependentValues: {
        istPersonAlleinerziehend,
        taetigkeiten,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);
  const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);

  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );
  const relevanteZeitraeume = gruppiereBemessungszeitraum({
    bemessungszeitraum,
    ausklammerungen,
  });
  const beruecksichtigteAusklammerungen =
    trenneAusklammerungsZeitraeume(relevanteZeitraeume).abDemBMZ;
  const nichtBeruecksichtigteAusklammerungen =
    trenneAusklammerungsZeitraeume(relevanteZeitraeume).vorDemBMZ;

  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatumGeschwisterkind = (index?: number) => {
    if (index === undefined) return undefined;

    const geburtsdatum = geschwisterkinder[index]?.geburtsdatum;

    if (geburtsdatum) {
      return geburtsdatum.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    return undefined;
  };

  const bemessungszeitraumUeberschrift = () => {
    if (taetigkeitenFlow === "Selbstaendig") {
      return `Kalenderjahr ${bemessungszeitraum[0]?.von.year}`;
    }
    return (
      <ul>
        {formatiereBemessungszeitraum(bemessungszeitraum).map(
          (zeitraum, index) => (
            <li key={index} className="list ml-40 list-disc pt-8">
              {zeitraum}
            </li>
          ),
        )}
      </ul>
    );
  };

  const uebersprungeneJahreSelbststaendig = (): string | undefined => {
    const currentYear = Temporal.Now.plainDateISO().year;
    const bmzYear = bemessungszeitraum[0]?.von.year;

    if (!bmzYear) return undefined;

    const jahreZwischenHeuteUndBMZ = currentYear - bmzYear;

    if (jahreZwischenHeuteUndBMZ === 2) {
      return `das Jahr ${currentYear - 1}`;
    }
    if (jahreZwischenHeuteUndBMZ === 3) {
      return `die Jahre ${currentYear - 2} und ${currentYear - 1}`;
    }
    if (jahreZwischenHeuteUndBMZ > 3) {
      const startLuecke = bmzYear + 1;
      const endeLuecke = currentYear - 1;
      return `die Jahre ${startLuecke} bis ${endeLuecke}`;
    }

    return undefined;
  };

  const uebersprungeneJahreNichtSelbststaendig = (): string | undefined => {
    if (beruecksichtigteAusklammerungen.length === 0) return undefined;

    const jahre = [
      ...new Set(
        beruecksichtigteAusklammerungen.flatMap((a) => [
          a.von.year,
          a.bis.year,
        ]),
      ),
    ].sort((a, b) => a - b);
    const anzahlJahre = jahre.length;

    if (anzahlJahre === 1) {
      return `Im Jahr ${jahre[0]} hatten Sie aber Schutzzeiten.`;
    }
    if (anzahlJahre === 2) {
      return `In den Jahren ${jahre[0]} und ${jahre[1]} hatten Sie aber Schutzzeiten.`;
    }
    if (anzahlJahre > 2) {
      return `In den Jahren ${jahre[0]} bis ${jahre[jahre.length - 1]} hatten Sie aber Schutzzeiten.`;
    }

    return undefined;
  };

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <div className="mt-40 flex flex-col gap-40">
        <div className="rounded border-solid border-success">
          <div className="flex rounded bg-success-background p-20 font-bold">
            <SuccessIcon className="mr-10 mt-8 shrink-0 text-success" />

            <h3>Ihr Bemessungszeitraum: {bemessungszeitraumUeberschrift()}</h3>
          </div>

          <div className="p-20 pb-32">
            <div>
              {taetigkeitenFlow === "Selbstaendig" ? (
                <>
                  {uebersprungeneJahreSelbststaendig() ? (
                    <>
                      <p>
                        Sie arbeiten{" "}
                        {(taetigkeiten.istNichtSelbststaendig ||
                          taetigkeiten.istVerbeamtet) &&
                          "angestellt und"}{" "}
                        selbstständig. Deshalb wird normalerweise das letzte
                        Kalenderjahr vor der Geburt für die Berechnung von
                        Elterngeld berücksichtigt.
                      </p>
                      <p>
                        Wir haben Ihre Daten geprüft: Wir überspringen{" "}
                        {uebersprungeneJahreSelbststaendig()}. Wir berechnen Ihr
                        Elterngeld stattdessen mit dem Einkommen aus{" "}
                        {bemessungszeitraum[0]?.von.year}. So fällt Ihr
                        Elterngeld höher aus.
                      </p>
                    </>
                  ) : (
                    <p>
                      Sie arbeiten{" "}
                      {(taetigkeiten.istNichtSelbststaendig ||
                        taetigkeiten.istVerbeamtet) &&
                        "angestellt und"}{" "}
                      selbstständig. Deshalb wird das letzte Kalenderjahr vor
                      der Geburt für die Berechnung von Elterngeld
                      berücksichtigt.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    Sie arbeiten angestellt. Deshalb werden normalerweise die
                    letzten 12 Monate vor der Geburt für die Berechnung von
                    Elterngeld berücksichtigt.
                  </p>
                  {uebersprungeneJahreNichtSelbststaendig() && (
                    <p>
                      {uebersprungeneJahreNichtSelbststaendig()} In dieser Zeit
                      haben Sie wahrscheinlich weniger Geld verdient. Damit Sie
                      mehr Elterngeld bekommen, werden die Zeiträume
                      übersprungen. Deshalb wird Ihr Einkommen aus dem
                      Berechnungszeitraum{" "}
                      {formatiereBemessungszeitraum(bemessungszeitraum).join(
                        " und ",
                      )}{" "}
                      als Grundlage für die Berechnung betrachtet. Das ist Ihr
                      sogenannter Bemessungszeitraum.
                    </p>
                  )}
                </>
              )}
            </div>

            {beruecksichtigteAusklammerungen.length > 0 && (
              <div className="mt-32">
                <p>
                  <strong>Berücksichtigte Schutzzeiten (Ausklammerung)</strong>
                </p>
                <p className="mb-0">
                  Folgende{" "}
                  {beruecksichtigteAusklammerungen.length === 1
                    ? "Zeit"
                    : "Zeiten"}{" "}
                  haben wir übersprungen, damit Ihr Elterngeld nicht durch
                  geringeres Einkommen gemindert wird:
                </p>
                <ul className="ml-32 list-disc">
                  {beruecksichtigteAusklammerungen.map(
                    (ausklammerung, index) => (
                      <li key={index}>
                        {mappeAusklammerungGrund(
                          ausklammerung.grund,
                          geburtsdatumGeschwisterkind(
                            ausklammerung.geschwisterIndex,
                          ),
                        )}
                        :{" "}
                        {ausklammerung.von.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        bis{" "}
                        {ausklammerung.bis.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                        {ausklammerung.grund ===
                          "elterngeldGeschwisterkind" && (
                          <p className="italic">
                            Beachten Sie, dass Elterngeld bis maximal zum 14.
                            Lebensmonat berücksichtigt werden kann. Sollten Sie
                            einen längeren Zeitraum eingetragen haben,
                            korrigieren Sie Ihr Enddatum bitte manuell.
                          </p>
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {nichtBeruecksichtigteAusklammerungen.length > 0 && (
              <div className="mt-32">
                <p>
                  <strong>Was wurde nicht berücksichtigt?</strong>
                </p>
                <p>
                  Diese Angaben haben keinen Einfluss auf den gewählten
                  Zeitraum:
                </p>
                <ul className="ml-32 list-disc">
                  {nichtBeruecksichtigteAusklammerungen.map(
                    (ausklammerung, index) => (
                      <li key={index}>
                        {mappeAusklammerungGrund(
                          ausklammerung.grund,
                          geburtsdatumGeschwisterkind(
                            ausklammerung.geschwisterIndex,
                          ),
                        )}
                        :{" "}
                        {ausklammerung.von.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        bis{" "}
                        {ausklammerung.bis.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-40 flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button
            type="button"
            buttonStyle="primary"
            onClick={navigateNextPage}
          >
            Verstanden und weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}

const trenneAusklammerungsZeitraeume = (
  relevanteZeitraeume: Array<
    Temporal.PlainYearMonth[] | AusklammerungMitGeschwisterindex
  >,
): {
  vorDemBMZ: AusklammerungMitGeschwisterindex[];
  abDemBMZ: AusklammerungMitGeschwisterindex[];
} => {
  const ersterArrayIndex = relevanteZeitraeume.findIndex((item) =>
    Array.isArray(item),
  );

  const istAusklammerung = (
    zeitraum: Temporal.PlainYearMonth[] | Ausklammerung,
  ): zeitraum is Ausklammerung => !Array.isArray(zeitraum);

  if (ersterArrayIndex === -1) {
    return {
      vorDemBMZ: relevanteZeitraeume.filter(istAusklammerung),
      abDemBMZ: [],
    };
  }

  const vorDemBMZ = relevanteZeitraeume
    .slice(0, ersterArrayIndex)
    .filter(istAusklammerung);
  const abDemBMZ = relevanteZeitraeume
    .slice(ersterArrayIndex)
    .filter(istAusklammerung);

  return { vorDemBMZ, abDemBMZ };
};
