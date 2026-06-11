import { useEffect, useId, useRef, useState } from "react";
import {
  trackMetricsForDerPlanHatSichGeaendert,
  trackMetricsForEineOptionWurdeGewaehlt,
  trackMetricsForLebensmonatWurdeGeoeffnet,
  trackMetricsForPlanWurdeZurueckgesetzt,
  trackMetricsForPlanungDrucken,
} from "./tracking";
import { Button } from "@/application/features/components";
import {
  Anleitung,
  Erklaerung,
  Planer,
  PlanerHandle,
  Zusammenfassung,
} from "@/application/features/planungsteil/planer";
import {
  UserFeedbackForm,
  useUserFeedback,
} from "@/application/features/user-feedback";
import { Page } from "@/application/features/components/Page";
import { useAusgangslage } from "@/application/features/planungsteil/planer/hooks/useAusgangslage";
import { useBerechneElterngeldbezuege } from "@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege";
import { useEinkommenInformationen } from "@/application/features/planungsteil/planer/hooks/useEinkommenInformationen";
import { useNavigateStateful } from "@/application/features/planungsteil/planer/hooks/useNavigateStateful";
import {
  getTrackedEase,
  getTrackedObstacle,
  isTrackingAllowedByUser,
  trackEase,
  trackObstacle,
  trackReachedConversionGoal,
} from "@/application/user-tracking";
import { MAX_EINKOMMEN } from "@/elterngeldrechner";
import type {
  AusgangslageFuerZweiElternteile,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";
import { sindLebensmonateGeplant } from "@/monatsplaner";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left";
import RestartAltIcon from "~icons/material-symbols/restart-alt";

export function PlanerPage() {
  const mainElement = useRef<HTMLDivElement>(null);
  const dialogElement = useRef<HTMLDialogElement>(null);

  const { gesamteinkommenGrenzeUeberschritten } = useEinkommenInformationen();

  function openDialogWhenEinkommenLimitUebeschritten() {
    if (gesamteinkommenGrenzeUeberschritten) dialogElement.current?.showModal();
  }

  function closeDialog() {
    dialogElement.current?.close();
    mainElement.current?.focus();
  }

  useEffect(openDialogWhenEinkommenLimitUebeschritten, [
    gesamteinkommenGrenzeUeberschritten,
  ]);

  const planerRef = useRef<PlanerHandle>(null);

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialPlan, beispiel } = navigationState;

  const ausgangslage = useAusgangslage();

  const [initialPlanerInformation, setInitialPlanerInformation] = useState(
    initialPlan !== undefined
      ? { plan: initialPlan, beispiel: beispiel }
      : { ausgangslage, beispiel: beispiel },
  );

  const [plan, setPlan] = useState(() => initialPlan);
  const [hasChanges, setHasChanges] = useState(initialPlan && !beispiel);

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  function resetBeispiel() {
    setInitialPlanerInformation({
      ...initialPlanerInformation,
      beispiel: undefined,
    });
  }

  function updateStateForChangedPlan(
    plan: PlanMitBeliebigenElternteilen,
  ): void {
    setHasChanges(true);
    resetBeispiel();
    setPlan(plan);
  }

  const [trackingConsent, setTrackingConsent] = useState(false);
  const { isFeedbackSubmitted, submitFeedback } = useUserFeedback();
  const rememberSubmit = useRef(false);
  const showFeedbackForm =
    (hasChanges || !!beispiel) && !isFeedbackSubmitted && trackingConsent;

  useEffect(() => {
    void (async () => {
      setTrackingConsent(await isTrackingAllowedByUser());
    })();
  }, []);

  const [isErklaerungOpen, setIsErklaerungOpen] = useState(false);

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
  }

  function handlePlanChanges(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    updateStateForChangedPlan(nextPlan);

    trackReachedConversionGoal();
    trackMetricsForDerPlanHatSichGeaendert(nextPlan, istPlanGueltig);
  }

  const navigateToBeispielePage = async () => {
    if (rememberSubmit.current) submitFeedback();

    if (hasChanges) {
      await navigateStateful("/beispiele", { plan });
    } else {
      await navigateStateful("/beispiele", { beispiel });
    }
  };

  async function navigateToDatenuebernahmeAntragPage(
    plan: PlanMitBeliebigenElternteilen,
  ): Promise<void> {
    if (rememberSubmit.current) submitFeedback();

    await navigateStateful("/datenuebernahme-antrag", { plan });
  }

  // TODO: Consider implementing erklaerung as a new layer that
  // covers the planer and not replaces it in the dom.

  const mindestensEinLebensmonatGeplant = plan && sindLebensmonateGeplant(plan);

  const headingIdentifier = useId();

  return (
    <Page id="planer-page" heading="Planen Sie Ihr Elterngeld">
      {!!plan && <Zusammenfassung plan={plan} className="hidden print:block" />}

      <div className="print:hidden">
        {isErklaerungOpen ? (
          <Erklaerung onClose={hideErklaerung} />
        ) : (
          <div ref={mainElement} className="grid" tabIndex={-1}>
            <section
              className="print:hidden"
              aria-labelledby={headingIdentifier}
            >
              <h3 id={headingIdentifier} className="sr-only">
                Planer Anwendung
              </h3>

              <Anleitung
                className="mb-40"
                onOpenErklaerung={() => setIsErklaerungOpen(true)}
              >
                <>
                  <p>
                    Planen Sie hier Ihr Elterngeld. Klicken Sie auf die
                    Lebensmonate, um etwas auszwählen oder zu ändern. So finden
                    Sie heraus, welche Planung für Sie am besten ist:
                  </p>
                  <ul className="ml-24 list-disc">
                    <li>
                      Die Beträge werden auf Basis Ihrer Angaben berechnet. Sie
                      sind rechtlich nicht verbindlich.
                    </li>
                    <li>
                      Mutterschaftsgeld ist in der Summe nicht eingerechnet.
                    </li>
                    <li>
                      Das eingegebene Einkommen aus Ihrer Arbeit ist ein
                      Brutto-Wert. Darauf müssen Sie noch Steuern zahlen.
                    </li>
                  </ul>
                </>
              </Anleitung>

              <p className="mb-40">
                <strong>Tipp für Ihre Planung: </strong>
                Sie können Elterngeld bekommen und dabei bis zu 32 Stunden pro
                Woche arbeiten. Geben Sie in dem Fall Ihr Einkommen während des
                Elterngeldes an. Das Einkommen wird mit dem Elterngeld
                verrechnet. So sehen Sie, wie viel Geld Sie jeden Monat
                insgesamt haben.
              </p>

              <Button
                type="button"
                buttonStyle="link"
                className="mr-20 justify-self-start print:hidden"
                onClick={navigateToBeispielePage}
              >
                <ChevronLeftIcon /> Zurück zur Auswahl
              </Button>

              <Button
                className="mb-8 justify-self-start print:hidden"
                type="button"
                buttonStyle="link"
                onClick={() => planerRef.current?.setzePlanZurueck()}
                disabled={!mindestensEinLebensmonatGeplant}
              >
                <RestartAltIcon /> Neue leere Planung erstellen
              </Button>

              <Planer
                ref={planerRef}
                initialInformation={initialPlanerInformation}
                berechneElterngeldbezuege={berechneElterngeldbezuege}
                planInAntragUebernehmen={navigateToDatenuebernahmeAntragPage}
                callbacks={{
                  onChange: handlePlanChanges,
                  onWaehleOption: trackMetricsForEineOptionWurdeGewaehlt,
                  onSetzePlanZurueck: trackMetricsForPlanWurdeZurueckgesetzt,
                  onOpenLebensmonat: trackMetricsForLebensmonatWurdeGeoeffnet,
                  onPlanungDrucken: trackMetricsForPlanungDrucken,
                }}
              />
            </section>

            <Button
              type="button"
              buttonStyle="secondary"
              className="my-16 justify-self-start print:hidden"
              onClick={navigateToBeispielePage}
            >
              <ChevronLeftIcon /> Zurück zur Auswahl
            </Button>

            {!!showFeedbackForm && (
              <UserFeedbackForm
                ease={getTrackedEase()}
                obstacle={getTrackedObstacle()}
                onChangeEase={trackEase}
                onChangeObstacle={trackObstacle}
                onSubmit={() => (rememberSubmit.current = true)}
              />
            )}
          </div>
        )}
      </div>

      <dialog
        ref={dialogElement}
        className="flex-col items-center gap-10 bg-primary-light open:flex"
      >
        <p>
          Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld
          bekommen. Falls noch nicht feststeht, ob Sie die Grenze von{" "}
          {MAX_EINKOMMEN.toLocaleString("de-DE")} Euro überschreiten, können Sie
          trotzdem einen Antrag stellen.
        </p>

        <Button type="button" onClick={closeDialog}>
          Dialog schließen
        </Button>
      </dialog>
    </Page>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  vi.mock("@/application/features/components/Page", () => ({
    Page: ({ children }: { readonly children: React.ReactNode }) => (
      <>{children}</>
    ),
  }));
  vi.mock(
    "@/application/features/planungsteil/planer/hooks/useAusgangslage",
    () => ({
      useAusgangslage: vi.fn(),
    }),
  );
  vi.mock(
    "@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege",
    () => ({
      useBerechneElterngeldbezuege: vi.fn(),
    }),
  );
  vi.mock(
    "@/application/features/planungsteil/planer/hooks/useEinkommenInformationen",
    () => ({
      useEinkommenInformationen: vi.fn(),
    }),
  );
  vi.mock(
    "@/application/features/planungsteil/planer/hooks/useNavigateStateful",
    () => ({
      useNavigateStateful: vi.fn(),
    }),
  );
  vi.mock(
    "@/application/features/planungsteil/planer/hooks/useAntragInformationen",
    () => ({
      useAntragInformationen: vi.fn(),
    }),
  );
  vi.mock("@/application/features/user-feedback", async (importOriginal) => ({
    ...(await importOriginal<
      typeof import("@/application/features/user-feedback")
    >()),
    useUserFeedback: () => ({
      isFeedbackSubmitted: false,
      submitFeedback: vi.fn(),
    }),
  }));

  describe("Planer Page", async () => {
    const monatsplanerModule = await import("@/monatsplaner");
    const { Elternteil, Variante } = monatsplanerModule;
    const { useNavigateStateful } =
      await import("@/application/features/planungsteil/planer/hooks/useNavigateStateful");
    const { useAusgangslage } =
      await import("@/application/features/planungsteil/planer/hooks/useAusgangslage");
    const { useBerechneElterngeldbezuege } =
      await import("@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege");
    const { useEinkommenInformationen } =
      await import("@/application/features/planungsteil/planer/hooks/useEinkommenInformationen");
    const { useAntragInformationen } =
      await import("@/application/features/planungsteil/planer/hooks/useAntragInformationen");
    const { getBundeslandAntragSupportByName } =
      await import("@/application/features/datenuebernahme/pdfAntrag");

    const { render, screen } = await import("@testing-library/react");

    const mockAusgangslage = {
      anzahlElternteile: 2 as const,
      geburtsdatumDesKindes: new Date(),
      namenDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
    };

    type NavigateStatefulHook = ReturnType<typeof useNavigateStateful>;
    type NavigateStateful = NavigateStatefulHook["navigateStateful"];

    const navigateSpy = vi.fn<NavigateStateful>();

    beforeEach(() => {
      vi.mocked(useAusgangslage).mockReturnValue(mockAusgangslage);
      vi.mocked(useBerechneElterngeldbezuege).mockReturnValue(
        vi.fn().mockReturnValue({}),
      );
      vi.mocked(useEinkommenInformationen).mockReturnValue({
        gesamteinkommenGrenzeUeberschritten: false,
      });
      vi.mocked(useNavigateStateful).mockReturnValue({
        navigationState: {},
        navigateStateful: navigateSpy,
      });
      vi.mocked(useAntragInformationen).mockReturnValue(
        getBundeslandAntragSupportByName("Berlin"),
      );
      vi.spyOn(monatsplanerModule, "berechneGesamtsumme").mockReturnValue({
        elterngeldbezug: 400,
        proElternteil: {
          [Elternteil.Eins]: {
            anzahlMonateMitBezug: 2,
            elterngeldbezug: 200,
            bruttoeinkommen: 0,
          },
          [Elternteil.Zwei]: {
            anzahlMonateMitBezug: 2,
            elterngeldbezug: 200,
            bruttoeinkommen: 0,
          },
        },
      });
    });

    describe("Neue leere Planung erstellen", async () => {
      const { erstelleInitialeLebensmonate } = await import("@/monatsplaner");

      const mockAusgangslageWithMutterschutz: AusgangslageFuerZweiElternteile =
        {
          ...mockAusgangslage,
          informationenZumMutterschutz: {
            empfaenger: Elternteil.Eins,
            letzterLebensmonatMitSchutz: 2,
          },
        };

      it("ist interaktiv wenn eine Änderung am Plan gemacht wurde", () => {
        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: mockAusgangslageWithMutterschutz,
              lebensmonate: {
                1: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Basis,
                    imMutterschutz: true as const,
                    elterngeldbezug: null,
                    bruttoeinkommen: null,
                  },
                  [Elternteil.Zwei]: {
                    gewaehlteOption: Variante.Basis,
                    imMutterschutz: false as const,
                  },
                },
                2: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Basis,
                    imMutterschutz: true as const,
                    elterngeldbezug: null,
                    bruttoeinkommen: null,
                  },
                  [Elternteil.Zwei]: {
                    imMutterschutz: false as const,
                  },
                },
              },
            },
          },
          navigateStateful: navigateSpy,
        });

        render(<PlanerPage />);

        const resetPlanButton = screen.queryByText(
          "Neue leere Planung erstellen",
        );

        expect(resetPlanButton).not.toBeDisabled();
      });

      it("ist deaktiviert bei leerem Plan mit Mutterschutz", () => {
        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: mockAusgangslageWithMutterschutz,
              lebensmonate: erstelleInitialeLebensmonate(
                mockAusgangslageWithMutterschutz,
              ),
            },
          },
          navigateStateful: navigateSpy,
        });

        render(<PlanerPage />);

        const resetPlanButton = screen.queryByText(
          "Neue leere Planung erstellen",
        );

        expect(resetPlanButton).toBeDisabled();
      });
    });
  });
}
