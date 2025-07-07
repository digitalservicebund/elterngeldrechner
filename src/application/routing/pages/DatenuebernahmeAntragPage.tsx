import ArrowOutward from "@digitalservicebund/icons/ArrowOutward";
import AntragIcon from "@digitalservicebund/icons/ContentCopyOutlined";
import SeiteIcon from "@digitalservicebund/icons/DescriptionOutlined";
import download from "downloadjs";
import { type ReactNode, useState } from "react";
import { Page } from "./Page";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { Button } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { stepAllgemeineAngabenSelectors } from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import {
  supportedBundeslaender,
  unsupportedBundeslaenderRessources,
} from "@/pdfAntrag";
import antragImg from "@/pdfAntrag/assets/antrag.png";
import seiteImg from "@/pdfAntrag/assets/seite.png";
import { preparePDF } from "@/pdfAntrag/pdf-erstellen";

export function DatenuebernahmeAntragPage(): ReactNode {
  const store = useAppStore();

  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const navigateToRechnerUndPlanerPage = () =>
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);

  const [downloading, setDownloading] = useState(false);
  const [seiteDownloading, setSeiteDownloading] = useState(false);

  const bundesland =
    useAppSelector(stepAllgemeineAngabenSelectors.getBundesland) || "";
  const bundeslandString =
    bundesland.toString() as keyof typeof unsupportedBundeslaenderRessources;

  const isSupported = (
    supportedBundeslaender as ReadonlyArray<string>
  ).includes(bundeslandString);

  let nameET1 = "";
  let nameET2 = "";
  if (plan?.ausgangslage?.anzahlElternteile === 2) {
    nameET1 = store.getState().stepAllgemeineAngaben.pseudonym.ET1;
    nameET2 = store.getState().stepAllgemeineAngaben.pseudonym.ET2;
  }

  async function downloadPdf() {
    setDownloading(true);

    const informationForPdfAntrag = {
      nameET1:
        plan?.ausgangslage?.anzahlElternteile === 2
          ? store.getState().stepAllgemeineAngaben.pseudonym.ET1
          : "",
      nameET2:
        plan?.ausgangslage?.anzahlElternteile === 2
          ? store.getState().stepAllgemeineAngaben.pseudonym.ET2
          : "",
      anzahlKinder: store.getState().stepNachwuchs.anzahlKuenftigerKinder,
      geburtsdatum: store.getState().stepNachwuchs.wahrscheinlichesGeburtsDatum,
    };

    const pdfBytes = await preparePDF(true, informationForPdfAntrag, plan);

    download(pdfBytes, "Antrag_auf_Elterngeld.pdf", "application/pdf");

    setDownloading(false);
  }

  async function downloadSeite() {
    setSeiteDownloading(true);

    const informationForPdfAntrag = {
      nameET1:
        plan?.ausgangslage?.anzahlElternteile === 2
          ? store.getState().stepAllgemeineAngaben.pseudonym.ET1
          : "",
      nameET2:
        plan?.ausgangslage?.anzahlElternteile === 2
          ? store.getState().stepAllgemeineAngaben.pseudonym.ET2
          : "",
    };

    const pdfBytes = await preparePDF(false, informationForPdfAntrag, plan);

    download(pdfBytes, "Seite18_Antrag_Elterngeld.pdf", "application/pdf");

    setSeiteDownloading(false);
  }

  return (
    <Page step={formSteps.datenuebernahmeAntrag}>
      <div className="flex flex-col gap-56">
        {isSupported ? (
          <div>
            <div className="mb-32 bg-off-white p-24">
              <div className="flex flex-wrap gap-24 sm:flex-nowrap">
                <div>
                  <img src={antragImg} alt="" className="max-w-[200px]" />
                </div>
                <div>
                  <strong>Gesamter Antrag:</strong>
                  <p className="mb-24">
                    Sie können die PDF des gesamten Antrags auf Elterngeld nun
                    herunterladen und ausfüllen.
                  </p>
                  <p>Wir haben in den Antrag übernommen:</p>
                  <ul className="mb-24 list-disc pl-24">
                    {plan?.ausgangslage?.anzahlElternteile === 2 ? (
                      <li>Vornamen der Eltern</li>
                    ) : (
                      ""
                    )}
                    <li>Geburtsdatum des Kindes</li>
                    <li>Anzahl der Kinder</li>
                    <li>Ihre Planung von Elterngeld</li>
                  </ul>
                  {downloading ? (
                    "Bitte warten..."
                  ) : (
                    <Button
                      type="button"
                      buttonStyle="link"
                      className="!text-base font-bold !text-black"
                      onClick={downloadPdf}
                    >
                      <AntragIcon /> Antrag_auf_Elterngeld.pdf
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-off-white p-24">
              <div className="flex flex-wrap gap-24 sm:flex-nowrap">
                <div>
                  <img src={seiteImg} alt="" className="max-w-[200px]" />
                </div>
                <div>
                  <strong>Einzelne Seite:</strong>
                  <p className="mb-24">
                    Sie haben schon angefangen den Antrag auszufüllen? Dann
                    finden Sie hier die einzelne Seite Ihrer Planung als
                    Download. Ersetzen Sie diese mit der aktuellen Seite 18 im
                    Antrag.
                  </p>
                  {seiteDownloading ? (
                    "Bitte warten..."
                  ) : (
                    <Button
                      type="button"
                      buttonStyle="link"
                      className="!text-base font-bold !text-black"
                      onClick={downloadSeite}
                    >
                      <SeiteIcon /> Seite18_Antrag_Elterngeld.pdf
                    </Button>
                  )}
                </div>
              </div>

              {plan?.ausgangslage?.anzahlElternteile === 2 ? (
                <Alert headline="Hinweis" className="mt-32">
                  Bei der Übernahme Ihrer Planung in den Antrag berücksichtigen
                  wir {nameET1} immer auf der linken Seite und {nameET2} auf der
                  rechten Seite. Behalten Sie diese Anordnung bei, da die
                  Planung sonst nicht der richtigen Person zugeordnet werden
                  kann.
                </Alert>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="my-16 text-24 font-bold">
              Tut uns leid. {bundesland} verwendet eine eigene Version des
              Antrags auf Elterngeld.
            </p>
            <p>
              Die automatische Übernahme Ihrer Elterngeld-Planung ist nur im
              bundeseinheitlichen Antrag möglich.
            </p>
            <p className="mb-32">
              Wenn Sie in {bundesland} Elterngeld beantragen möchten, müssen Sie
              Ihre Planung manuell übertragen.
            </p>
            <p>
              Den PDF-Antrag für {bundesland} sowie den Zugang zum Online-Antrag
              finden Sie auf folgender Seite:
            </p>
            <a
              className="font-bold underline"
              href={unsupportedBundeslaenderRessources[bundeslandString]}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowOutward /> Zum Antrag auf Elterngeld in {bundesland}
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
