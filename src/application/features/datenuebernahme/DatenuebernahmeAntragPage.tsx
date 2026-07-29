import elterngeldantragPreview from "@/application/assets/images/elterngeldantrag.png";
import planungsseitePreview from "@/application/assets/images/planungsseite.png";
import { type ReactNode, useState } from "react";
import { Button } from "@/application/features/components";
import { Alert } from "@/application/features/components/Alert";
import { BundeslandAntragSupport } from "@/application/features/datenuebernahme/pdfAntrag";
import {
  prepareGanzerAntrag,
  preparePlanungsseite,
} from "@/application/features/datenuebernahme/pdfAntrag/pdf-erstellen";
import { Page } from "@/application/features/components/Page";
import { useAntragInformationen } from "@/application/features/planungsteil/planer/hooks/useAntragInformationen";
import { useNavigateStateful } from "@/application/features/planungsteil/planer/hooks/useNavigateStateful";
import {
  createTrackedNavigationFunction,
  posthog,
  pushTrackingEvent,
} from "@/application/user-tracking";
import { Elternteil } from "@/monatsplaner";
import FileDownloadIcon from "~icons/material-symbols/file-download";
import OpenInNewIcon from "~icons/material-symbols/open-in-new";

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

  const navigateToRechnerUndPlanerPage = createTrackedNavigationFunction(
    "/datenuebernahme-antrag",
    async () => {
      await navigateStateful("/rechner-planer", navigationState);
    },
  );

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
    <Page
      id="datenuebernahme-page"
      heading="Übernahme Planung in den Papierantrag auf Elterngeld"
    >
      <div className="content-container max-w-[70ch]">
        <div className="bg-off-white p-24">
          <div className="flex flex-wrap gap-24 sm:flex-nowrap">
            <div>
              <img
                src={elterngeldantragPreview}
                alt=""
                className="max-w-[150px]"
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
                  className="mx-4"
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
                className="max-w-[150px]"
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

        <p>
          Ihre Daten können nicht direkt in den digitalen Antrag übertragen
          werden. Wenn Sie den Antrag digital einreichen möchten, können Sie
          Ihre Planungsdaten manuell in{" "}
          <a
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
    const pageModule = await import("@/application/features/components/Page");
    const useNavigateStatefulModule =
      await import("@/application/features/planungsteil/planer/hooks/useNavigateStateful");
    const useAntragInformationenModule =
      await import("@/application/features/planungsteil/planer/hooks/useAntragInformationen");
    const { getBundeslandAntragSupportByName } =
      await import("@/application/features/datenuebernahme/pdfAntrag");

    const { render, screen } = await import("@testing-library/react");

    const navigateSpy = vi.fn();

    beforeEach(() => {
      navigateSpy.mockClear();
      vi.spyOn(pageModule, "Page").mockImplementation(
        ({
          children,
          heading,
          id,
        }: {
          readonly children: React.ReactNode;
          readonly heading: string;
          readonly id?: string;
        }) => (
          <div id={id}>
            <section aria-label={heading}>{children}</section>
          </div>
        ),
      );
      vi.spyOn(
        useAntragInformationenModule,
        "useAntragInformationen",
      ).mockReturnValue(getBundeslandAntragSupportByName("Berlin"));
      vi.spyOn(
        useNavigateStatefulModule,
        "useNavigateStateful",
      ).mockReturnValue({
        navigationState: { plan: ANY_PLAN },
        navigateStateful: navigateSpy,
      });
    });

    it("shows a section for the Datenuebernahme Antrag with option to download pdf if a Plan was provided and Bundesland is supported", () => {
      render(<DatenuebernahmeAntragPage />);

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
      render(<DatenuebernahmeAntragPage />);

      expect(
        screen.getByRole("link", { name: /das offizielle Tool/i }),
      ).toBeVisible();
    });

    it("uses the existing Plan when navigating back to the Rechner", () => {
      render(<DatenuebernahmeAntragPage />);

      screen.getByRole("button", { name: "Zurück" }).click();

      expect(navigateSpy).toHaveBeenCalledOnce();

      expect(navigateSpy).toHaveBeenLastCalledWith("/rechner-planer", {
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
  });
}
