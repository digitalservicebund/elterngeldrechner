import ArrowOutward from "@digitalservicebund/icons/ArrowOutward";
import FileDownloadIcon from "@digitalservicebund/icons/FileDownload";
import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import download from "downloadjs";
import { type ReactNode, useState } from "react";
import { Page } from "./Page";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { Button } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import {
  parseGermanDateString,
  stepAllgemeineAngabenSelectors,
} from "@/application/features/abfrageteil/state";
import { Bundesland, bundeslaender } from "@/application/features/pdfAntrag";
import {
  prepareGanzerAntrag,
  preparePlanungsseite,
} from "@/application/features/pdfAntrag/pdf-erstellen";
import {
  imageAntrag,
  imageSeite,
} from "@/application/features/pdfAntrag/pdf-images";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { pushTrackingEvent } from "@/application/user-tracking";

export function DatenuebernahmeAntragPage(): ReactNode {
  const store = useAppStore();

  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const navigateToRechnerUndPlanerPage = () =>
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);

  const [antragDownloading, setAntragDownloading] = useState(false);
  const [seiteDownloading, setSeiteDownloading] = useState(false);

  const bundeslandString = useAppSelector(
    stepAllgemeineAngabenSelectors.getBundesland,
  );

  const bundesland = bundeslaender.find(
    (bundesland) => bundesland.name === bundeslandString,
  );
  if (bundesland === undefined) {
    throw Error("bundesland should not be undefined");
  }

  const informationForPdfAntrag = {
    nameET1: store.getState().stepAllgemeineAngaben.pseudonym.ET1,
    nameET2: store.getState().stepAllgemeineAngaben.pseudonym.ET2,
    geburtsdatum: parseGermanDateString(
      store.getState().stepNachwuchs.wahrscheinlichesGeburtsDatum,
    ),
  };

  function trackedDownloadOfAnlagen(
    event: React.MouseEvent<HTMLAnchorElement>,
    bundesland: Bundesland,
  ) {
    event.preventDefault();
    pushTrackingEvent("Anlagen-zu-Antrag-wurden-heruntergeladen");
    window.open(bundesland.link, "_blank", "noreferrer");
  }

  async function downloadGanzerAntrag() {
    setAntragDownloading(true);

    try {
      const pdfBytes = await prepareGanzerAntrag({
        informationForPdfAntrag,
        plan,
      });

      download(pdfBytes, "Antrag_auf_Elterngeld.pdf", "application/pdf");

      pushTrackingEvent("Ganzer-Antrag-wurde-heruntergeladen");
    } catch {
      setAntragDownloading(false);
    }

    setAntragDownloading(false);
  }

  async function downloadPlanungsseite() {
    setSeiteDownloading(true);

    try {
      const pdfBytes = await preparePlanungsseite({
        informationForPdfAntrag,
        plan,
      });

      download(pdfBytes, "Seite_Planung_Elterngeld.pdf", "application/pdf");

      pushTrackingEvent("Planungsseite-wurde-heruntergeladen");
    } catch {
      setSeiteDownloading(false);
    }

    setSeiteDownloading(false);
  }

  return (
    <Page step={formSteps.datenuebernahmeAntrag}>
      <div className="flex flex-col gap-56">
        {bundesland.isSupported ? (
          <div>
            <div className="mb-32 bg-off-white p-24">
              <div className="flex flex-wrap gap-24 sm:flex-nowrap">
                <div>
                  <img src={imageAntrag} alt="" className="max-w-[200px]" />
                </div>
                <div>
                  <strong>Gesamter Antrag:</strong>
                  <p>
                    Sie können die PDF des gesamten Antrags auf Elterngeld
                    herunterladen und ausfüllen.
                  </p>
                  {plan?.ausgangslage?.anzahlElternteile === 2 ? (
                    <p>
                      Wir haben die Planung für{" "}
                      {informationForPdfAntrag.nameET1} und{" "}
                      {informationForPdfAntrag.nameET2} in den Antrag
                      übernommen.
                    </p>
                  ) : (
                    <p>Wir haben die Planung in den Antrag übernommen.</p>
                  )}
                  <div className="mb-32 mt-24">
                    {antragDownloading ? (
                      "Bitte warten..."
                    ) : (
                      <Button
                        type="button"
                        buttonStyle="link"
                        className="!text-base font-bold !text-black"
                        onClick={downloadGanzerAntrag}
                      >
                        <FileDownloadIcon className="mr-6" />
                        Antrag_auf_Elterngeld.pdf
                      </Button>
                    )}
                  </div>
                  <p>
                    Hier finden Sie eine
                    <a
                      className="mx-4 font-bold underline"
                      href={bundesland.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) =>
                        trackedDownloadOfAnlagen(event, bundesland)
                      }
                    >
                      <OpenInNewIcon /> Übersicht der Anlagen
                    </a>
                    zu Ihrem Antrag.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-off-white p-24">
              <div className="flex flex-wrap gap-24 sm:flex-nowrap">
                <div>
                  <img src={imageSeite} alt="" className="max-w-[200px]" />
                </div>
                <div>
                  <strong>Einzelne Seite:</strong>
                  <p className="mb-24">
                    Sie haben schon angefangen den Antrag auszufüllen? Dann
                    finden Sie hier die einzelne Seite Ihrer Planung als
                    Download. Ersetzen Sie diese mit der aktuellen Seite 18 im
                    Antrag auf Elterngeld.
                  </p>
                  {seiteDownloading ? (
                    "Bitte warten..."
                  ) : (
                    <Button
                      type="button"
                      buttonStyle="link"
                      className="!text-base font-bold !text-black"
                      onClick={downloadPlanungsseite}
                    >
                      <FileDownloadIcon className="mr-6" />
                      Seite_Planung_Elterngeld.pdf
                    </Button>
                  )}
                </div>
              </div>

              {plan?.ausgangslage?.anzahlElternteile === 2 ? (
                <Alert headline="Hinweis" className="mt-32">
                  Bei der Übernahme Ihrer Planung in den Antrag berücksichtigen
                  wir {informationForPdfAntrag.nameET1} immer auf der linken
                  Seite und {informationForPdfAntrag.nameET2} auf der rechten
                  Seite. Behalten Sie diese Anordnung bei, da die Planung sonst
                  nicht der richtigen Person zugeordnet werden kann.
                </Alert>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="my-16 text-24 font-bold">
              Tut uns leid. {bundesland.name} verwendet eine eigene Version des
              Antrags auf Elterngeld.
            </p>
            <p>
              Die automatische Übernahme Ihrer Elterngeld-Planung ist nur im
              bundeseinheitlichen Antrag möglich.
            </p>
            <p className="mb-32">
              Wenn Sie in {bundesland.name} Elterngeld beantragen möchten,
              müssen Sie Ihre Planung manuell übertragen.
            </p>
            <p>
              Den PDF-Antrag für {bundesland.name} sowie den Zugang zum
              Online-Antrag finden Sie auf folgender Seite:
            </p>
            <a
              className="font-bold underline"
              href={bundesland.link}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => trackedDownloadOfAnlagen(event, bundesland)}
            >
              <ArrowOutward /> Zum Antrag auf Elterngeld in {bundesland.name}
            </a>
          </div>
        )}

        <div>
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToRechnerUndPlanerPage}
          >
            Zurück
          </Button>
        </div>
      </div>
    </Page>
  );
}
