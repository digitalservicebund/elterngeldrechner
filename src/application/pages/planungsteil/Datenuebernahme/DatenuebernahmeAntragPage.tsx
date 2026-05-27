import FileDownloadIcon from "@digitalservicebund/icons/FileDownload";
import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import elterngeldantragPreview from "@/assets/images/elterngeldantrag.png";
import planungsseitePreview from "@/assets/images/planungsseite.png";
import { type ReactNode, useState } from "react";
import { Button } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { BundeslandAntragSupport } from "@/application/features/pdfAntrag";
import {
  prepareGanzerAntrag,
  preparePlanungsseite,
} from "@/application/features/pdfAntrag/pdf-erstellen";
import { Page } from "@/application/pages/Page";
import { useAntragInformationen } from "@/application/pages/planungsteil/useAntragInformationen";
import { useNavigateStateful } from "@/application/pages/planungsteil/useNavigateStateful";
import { formSteps } from "@/application/routing/formSteps";
import { pushTrackingEvent } from "@/application/user-tracking";
import { Elternteil } from "@/monatsplaner";
import posthog from "posthog-js";

function download(data: Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: mimeType });

  const url = URL.createObjectURL(blob);

  const anchorElement = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });

  anchorElement.click();

  URL.revokeObjectURL(url);
}

function trackedDownloadOfAnlagen(
  event: React.MouseEvent<HTMLAnchorElement>,
  bundeslandAntragSupport: BundeslandAntragSupport,
) {
  event.preventDefault();
  pushTrackingEvent("Anlagen-zu-Antrag-wurden-heruntergeladen");
  posthog.capture("datenuebernahme_anlagen_zu_antrag_heruntergeladen");
  window.open(bundeslandAntragSupport.link, "_blank", "noreferrer");
}

function trackReferenzAufOnlinetool() {
  pushTrackingEvent("Referenz-auf-Onlinetool-wurde-geklickt");
  posthog.capture("datenuebernahme_referenz_auf_onlinetool_geklickt");
}

export function DatenuebernahmeAntragPage(): ReactNode {
  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan } = navigationState;

  const navigateToRechnerUndPlanerPage = () => {
    void navigateStateful(formSteps.rechnerUndPlaner.route, navigationState);
  };

  const [antragDownloading, setAntragDownloading] = useState(false);
  const [seiteDownloading, setSeiteDownloading] = useState(false);

  const bundesland = useAntragInformationen();
  if (bundesland === null) {
    throw new Error("bundesland should not be null");
  }

  const informationForPdfAntrag = {
    nameET1: plan!.ausgangslage.namenDerElternteile?.[Elternteil.Eins] ?? "",
    nameET2: plan!.ausgangslage.namenDerElternteile?.[Elternteil.Zwei] ?? "",
    geburtsdatum: plan!.ausgangslage.geburtsdatumDesKindes,
  };

  async function downloadGanzerAntrag() {
    setAntragDownloading(true);

    try {
      const pdfBytes = await prepareGanzerAntrag({
        informationForPdfAntrag,
        plan,
      });

      download(pdfBytes, "Antrag_auf_Elterngeld.pdf", "application/pdf");

      pushTrackingEvent("Ganzer-Antrag-wurde-heruntergeladen");

      posthog.capture("datenuebernahme_ganzer_antrag_heruntergeladen");
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

      posthog.capture("datenuebernahme_planung_seite_heruntergeladen");
    } catch {
      setSeiteDownloading(false);
    }

    setSeiteDownloading(false);
  }

  return (
    <Page id="datenuebernahme-page" step={formSteps.datenuebernahmeAntrag}>
      <div className="flex flex-col">
        <div className="mb-32 bg-off-white p-24">
          <div className="flex flex-wrap gap-24 sm:flex-nowrap">
            <div>
              <img
                src={elterngeldantragPreview}
                alt=""
                className="max-w-[200px]"
              />
            </div>
            <div>
              <strong>Gesamter Antrag:</strong>
              <p>
                Sie können die PDF des gesamten Antrags auf Elterngeld
                herunterladen und ausfüllen.
              </p>
              {plan?.ausgangslage?.anzahlElternteile === 2 ? (
                <p>
                  Wir haben die Planung für {informationForPdfAntrag.nameET1}{" "}
                  und {informationForPdfAntrag.nameET2} in den Antrag
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
                    className="font-bold !text-black"
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
                  className="mx-4 text-primary underline"
                  href={bundesland.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) =>
                    trackedDownloadOfAnlagen(event, bundesland)
                  }
                >
                  <OpenInNewIcon aria-hidden="true" /> Übersicht der Anlagen
                  <span className="sr-only">(öffnet in neuem Fenster)</span>
                </a>
                zu Ihrem Antrag.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-off-white p-24">
          <div className="flex flex-wrap gap-24 sm:flex-nowrap">
            <div>
              <img
                src={planungsseitePreview}
                alt=""
                className="max-w-[200px]"
              />
            </div>
            <div>
              <strong>Einzelne Seite:</strong>
              <p className="mb-24">
                Sie haben schon angefangen den Antrag auszufüllen? Dann finden
                Sie hier die einzelne Seite Ihrer Planung als Download. Ersetzen
                Sie diese mit der aktuellen Seite 18 im Antrag auf Elterngeld.
              </p>
              {seiteDownloading ? (
                "Bitte warten..."
              ) : (
                <Button
                  type="button"
                  buttonStyle="link"
                  className="font-bold !text-black"
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
              Bei der Übernahme Ihrer Planung in den Antrag berücksichtigen wir{" "}
              {informationForPdfAntrag.nameET1} immer auf der linken Seite und{" "}
              {informationForPdfAntrag.nameET2} auf der rechten Seite. Behalten
              Sie diese Anordnung bei, da die Planung sonst nicht der richtigen
              Person zugeordnet werden kann.
            </Alert>
          ) : (
            ""
          )}
        </div>

        <p className="my-40">
          Ihre Daten können nicht direkt in den digitalen Antrag übertragen
          werden. Wenn Sie den Antrag digital einreichen möchten, können Sie
          Ihre Planungsdaten manuell in{" "}
          <a
            className="text-primary underline"
            href={bundesland.linkOnlinetool}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackReferenzAufOnlinetool()}
          >
            das offizielle Tool{" "}
            <span className="sr-only">(öffnet in neuem Fenster)</span>
          </a>{" "}
          übertragen.
        </p>

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

if (import.meta.vitest) {
  const { beforeEach, vi, describe, it, expect } = import.meta.vitest;

  describe("Datenuebernahme Antrag Page", async () => {
    const { useNavigateStateful: useStatefulNavigate } =
      await import("@/application/pages/planungsteil/useNavigateStateful");

    const { INITIAL_STATE, render, screen } =
      await import("@/application/test-utils");

    const { produce } = await import("immer");

    beforeEach(() => {
      vi.mock(
        import("@/application/pages/planungsteil/useNavigateStateful"),
        () => ({
          useNavigateStateful: vi.fn(),
        }),
      );
    });

    it("shows a section for the Datenuebernahme Antrag with option to download pdf if a Plan was provided and Bundesland is supported", () => {
      vi.mocked(useStatefulNavigate).mockReturnValue({
        navigationState: { plan: ANY_PLAN },
        navigateStateful: () => undefined,
      });

      render(<DatenuebernahmeAntragPage />, {
        preloadedState: initialTestState,
      });

      expect(
        screen.getByLabelText(
          "Übernahme Planung in den Papierantrag auf Elterngeld",
        ),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Antrag_auf_Elterngeld.pdf" }),
      ).toBeVisible();
    });

    it("shows a section for the Datenuebernahme Antrag with option to use the online tool instead", () => {
      vi.mocked(useStatefulNavigate).mockReturnValue({
        navigationState: { plan: ANY_PLAN },
        navigateStateful: () => undefined,
      });

      render(<DatenuebernahmeAntragPage />, {
        preloadedState: initialTestState,
      });

      expect(
        screen.getByRole("link", { name: /das offizielle Tool/i }),
      ).toBeVisible();
    });

    it("uses the existing Plan when navigating back to the Rechner", () => {
      const navigateStateful = vi.fn();

      vi.mocked(useStatefulNavigate).mockReturnValue({
        navigationState: { plan: ANY_PLAN },
        navigateStateful,
      });

      render(<DatenuebernahmeAntragPage />, {
        preloadedState: initialTestState,
      });

      screen.getByRole("button", { name: "Zurück" }).click();

      expect(navigateStateful).toHaveBeenCalledOnce();

      expect(navigateStateful).toHaveBeenLastCalledWith("/rechner-planer", {
        plan: ANY_PLAN,
      });
    });

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };

    const initialTestState = produce(INITIAL_STATE, (draft) => {
      draft.stepAllgemeineAngaben.bundesland = "Berlin";
    });
  });
}
