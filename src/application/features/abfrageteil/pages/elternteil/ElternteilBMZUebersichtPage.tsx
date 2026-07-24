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
import { findeGeburtsdatum } from "../../domain/findeGeburtsdatum";
import { BMZZusammensetzungSelbststaendig } from "./BMZZusammensetzungSelbststaendig";
import { BMZUeberschrift } from "./BMZUeberschrift";
import { BMZZusammensetzungNichtSelbststaendig } from "./BMZZusammensetzungNichtSelbststaendig";

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

  const {
    berechneBemessungszeitraum,
    berechneBemessungszeitraumOhneAusklammerungen,
  } = useBemessungszeitraumrechner(routeParams.elternteilIndex);
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const bemessungszeitraumNichtselbstaendigOhneAusklammerungen =
    berechneBemessungszeitraumOhneAusklammerungen("Nicht-Selbstaendig");
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );
  const relevanteZeitraeume = gruppiereBemessungszeitraum({
    bemessungszeitraum,
    ausklammerungen,
  });
  const {
    abDemBMZ: beruecksichtigteAusklammerungen,
    vorDemBMZ: nichtBeruecksichtigteAusklammerungen,
  } = trenneAusklammerungsZeitraeume(relevanteZeitraeume);

  const geburtsdatum = findeGeburtsdatum(eventStream);
  const berechnungsjahr =
    bemessungszeitraum[0]?.bis.year ?? geburtsdatum.year - 1;

  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const vornameGeschwisterkind = (
    geschwisterIndex?: number,
  ): string | undefined => {
    if (geschwisterIndex === undefined) return undefined;

    return geschwisterkinder[geschwisterIndex]?.name;
  };

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <div className="content-container">
        <div className="rounded border-solid border-success">
          <div className="flex rounded bg-success-background p-20 font-bold">
            <SuccessIcon className="mr-10 mt-6 shrink-0 text-success" />

            <BMZUeberschrift
              taetigkeitenFlow={taetigkeitenFlow}
              vorname={vorname}
              bemessungszeitraum={bemessungszeitraum}
              anzahlBeruecksichtigteAusklammerungen={
                beruecksichtigteAusklammerungen.length
              }
            />
          </div>

          <div className="px-20 pb-32">
            <p className="font-bold">
              Der hier angezeigte Zeitraum ist die Grundlage für die Berechnung
              Ihres Elterngeldes.
            </p>

            <div>
              <p className="font-bold">Wie setzt sich der Zeitraum zusammen?</p>
              {taetigkeitenFlow === "Selbstaendig" ? (
                <BMZZusammensetzungSelbststaendig
                  istMischeinkunft={
                    taetigkeiten.istNichtSelbststaendig ||
                    taetigkeiten.istVerbeamtet
                  }
                  vorname={vorname}
                  bemessungszeitraum={bemessungszeitraum}
                  geburtsdatum={geburtsdatum}
                />
              ) : (
                <BMZZusammensetzungNichtSelbststaendig
                  vorname={vorname}
                  bemessungszeitraum={bemessungszeitraum}
                  bemessungszeitraumOhneAusklammerungen={
                    bemessungszeitraumNichtselbstaendigOhneAusklammerungen
                  }
                  beruecksichtigteAusklammerungen={
                    beruecksichtigteAusklammerungen
                  }
                  geburtsdatum={geburtsdatum}
                />
              )}
            </div>

            {beruecksichtigteAusklammerungen.length > 0 && (
              <div>
                <p className="font-bold">
                  Übersprungene Zeiten (Ausklammerung)
                </p>
                <p>
                  {beruecksichtigteAusklammerungen.length === 1
                    ? "Folgender Zeitraum wurde"
                    : "Folgende Zeiträume wurden"}{" "}
                  übersprungen, damit das Elterngeld höher ausfällt:
                </p>
                <ul>
                  {beruecksichtigteAusklammerungen.map(
                    (ausklammerung, index) => (
                      <li key={index}>
                        <strong>
                          {mappeAusklammerungGrund(
                            ausklammerung.grund,
                            vornameGeschwisterkind(
                              ausklammerung.geschwisterIndex,
                            ),
                          )}
                          :{" "}
                        </strong>
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
                        {ausklammerung.grund === "mutterschutz" && (
                          <span>
                            {" "}
                            (in der Regel 6 Wochen vor und 8 Wochen nach dem
                            Geburtstermin)
                          </span>
                        )}
                        {ausklammerung.grund ===
                          "elterngeldGeschwisterkind" && (
                          <p className="mt-0 italic">
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
              <div>
                <p className="font-bold">Was wurde nicht berücksichtigt?</p>
                {beruecksichtigteAusklammerungen.length === 0 && (
                  <p>
                    Wenn in diesem Zeitraum bestimmte Gründe für ein
                    Überspringen (sogenannte Ausklammerungen) vorliegen, werden{" "}
                    {taetigkeitenFlow === "Selbstaendig"
                      ? "betroffene Jahre"
                      : "bestimmte Monate"}{" "}
                    nicht mitgezählt. Die Überprüfung hat jedoch ergeben, dass
                    für {vorname} keine Gründe für ein Überspringen vorliegen.{" "}
                    {taetigkeitenFlow === "Selbstaendig" ? (
                      <span>
                        Daher bleibt es bei dem regulären Zeitraum: dem Jahr
                        direkt vor der Geburt ({berechnungsjahr}).
                      </span>
                    ) : (
                      <span>
                        Daher bleibt es bei dem regulären Zeitraum direkt vor
                        der Geburt.
                      </span>
                    )}
                  </p>
                )}
                {nichtBeruecksichtigteAusklammerungen.length === 1 ? (
                  <p>
                    Folgende Angabe hat keinen Einfluss auf den gewählten
                    Zeitraum, da sie zu weit in der Vergangenheit liegt oder
                    rechtlich nicht zu einer weiteren Verschiebung führt:
                  </p>
                ) : (
                  <p>
                    Folgende Angaben haben keinen Einfluss auf den gewählten
                    Zeitraum, da sie zu weit in der Vergangenheit liegen oder
                    rechtlich nicht zu einer weiteren Verschiebung führen:
                  </p>
                )}
                <ul>
                  {nichtBeruecksichtigteAusklammerungen.map(
                    (ausklammerung, index) => (
                      <li key={index}>
                        {mappeAusklammerungGrund(
                          ausklammerung.grund,
                          vornameGeschwisterkind(
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

            <p className="font-bold">
              Was bedeutet das für den weiteren Verlauf?
            </p>
            <p>
              Bitte halten Sie für die nächsten Schritte die{" "}
              {taetigkeitenFlow === "Selbstaendig"
                ? `Einkommensnachweise (zum Beispiel den Steuerbescheid) aus dem Jahr ${berechnungsjahr}`
                : "monatlichen Gehaltsabrechnungen aus dem oben genannten 12-Monats-Zeitraum"}{" "}
              bereit.
            </p>
          </div>
        </div>

        <div className="button-group">
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
