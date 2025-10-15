import { ChevronLeft, RestartAlt } from "@digitalservicebund/icons/index";
import { useEffect, useId, useRef, useState } from "react";
import {
  trackMetricsForDerPlanHatSichGeaendert,
  trackMetricsForEineOptionWurdeGewaehlt,
  trackMetricsForErklaerungenWurdenGeoeffnet,
  trackMetricsForErklaerungenWurdenGeschlossen,
  trackMetricsForLebensmonatWurdeGeoeffnet,
  trackMetricsForPlanWurdeZurueckgesetzt,
  trackMetricsForPlanungDrucken,
} from "./tracking";
import { Button } from "@/application/components";
import {
  YesNo,
  composeAusgangslageFuerPlaner,
} from "@/application/features/abfrageteil/state";
import {
  Anleitung,
  Erklaerung,
  Planer,
  PlanerHandle,
  Zusammenfassung,
} from "@/application/features/planer";
import {
  UserFeedbackForm,
  useUserFeedback,
} from "@/application/features/user-feedback";
import { Page } from "@/application/pages/Page";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateStateful } from "@/application/pages/planungsteil/useNavigateStateful";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
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

export function PlanerPage() {
  const store = useAppStore();
  const mainElement = useRef<HTMLDivElement>(null);
  const dialogElement = useRef<HTMLDialogElement>(null);

  function openDialogWhenEinkommenLimitUebeschritten() {
    const isEinkommenLimitUeberschritten =
      store.getState().stepEinkommen.limitEinkommenUeberschritten === YesNo.YES;

    if (isEinkommenLimitUeberschritten) dialogElement.current?.showModal();
  }

  function closeDialog() {
    dialogElement.current?.close();
    mainElement.current?.focus();
  }

  useEffect(openDialogWhenEinkommenLimitUebeschritten, [store]);

  const planerRef = useRef<PlanerHandle>(null);

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialPlan, beispiel } = navigationState;

  const [initialPlanerInformation, setInitialPlanerInformation] = useState(
    initialPlan !== undefined
      ? { plan: initialPlan, beispiel: beispiel }
      : {
          ausgangslage: composeAusgangslageFuerPlaner(store.getState()),
          beispiel: beispiel,
        },
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
  const { isFeebackSubmitted, submitFeedback } = useUserFeedback();
  const rememberSubmit = useRef(false);
  const showFeedbackForm =
    (hasChanges || !!beispiel) && !isFeebackSubmitted && trackingConsent;

  useEffect(() => {
    void (async () => {
      setTrackingConsent(await isTrackingAllowedByUser());
    })();
  }, []);

  const [isErklaerungOpen, setIsErklaerungOpen] = useState(false);

  function showErklaerung(): void {
    setIsErklaerungOpen(true);
    trackMetricsForErklaerungenWurdenGeoeffnet();
  }

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
    trackMetricsForErklaerungenWurdenGeschlossen();
  }

  function handlePlanChanges(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    updateStateForChangedPlan(nextPlan);

    trackReachedConversionGoal();
    trackMetricsForDerPlanHatSichGeaendert(nextPlan, istPlanGueltig);
  }

  const navigateToBeispielePage = () => {
    if (rememberSubmit.current) submitFeedback();

    if (hasChanges) {
      void navigateStateful(formSteps.beispiele.route, { plan });
    } else {
      void navigateStateful(formSteps.beispiele.route, { beispiel });
    }
  };

  function navigateToDatenuebernahmeAntragPage(): void {
    if (rememberSubmit.current) submitFeedback();

    void navigateStateful(formSteps.datenuebernahmeAntrag.route, { plan });
  }

  // TODO: Consider implementing erklaerung as a new layer that
  // covers the planer and not replaces it in the dom.

  const mindestensEinLebensmonatGeplant = plan && sindLebensmonateGeplant(plan);

  const headingIdentifier = useId();

  return (
    <Page step={formSteps.rechnerUndPlaner}>
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

              <Anleitung className="mb-40" onOpenErklaerung={showErklaerung}>
                {initialPlanerInformation.beispiel ? (
                  <p>
                    Sie finden hier einen Vorschlag für eine Planung und die
                    Höhe Ihres Elterngeldes. Zusätzlich können Sie angeben, ob
                    und wie viel Einkommen Sie pro Monat haben werden. So
                    erhalten Sie einen Überblick über Ihr voraussichtliches
                    Haushaltseinkommen. Im nächsten Schritt können Sie Ihre
                    Planung in den Antrag übernehmen.
                  </p>
                ) : (
                  <p>
                    Mit dem Rechner und Planer können Sie Ihr Elterngeld für
                    jeden Monat planen. Zusätzlich können Sie angeben, ob und
                    wie viel Einkommen Sie pro Monat haben werden. So erhalten
                    Sie einen Überblick über Ihr voraussichtliches
                    Haushaltseinkommen. Im nächsten Schritt können Sie Ihre
                    Planung in den Antrag übernehmen.
                  </p>
                )}
              </Anleitung>

              <Button
                type="button"
                buttonStyle="link"
                className="mr-20 justify-self-start print:hidden"
                onClick={navigateToBeispielePage}
              >
                <ChevronLeft /> Zurück zur Auswahl
              </Button>

              <Button
                className="mb-8 justify-self-start print:hidden"
                type="button"
                buttonStyle="link"
                onClick={() => planerRef.current?.setzePlanZurueck()}
                disabled={!mindestensEinLebensmonatGeplant}
              >
                <RestartAlt /> Neue leere Planung erstellen
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
              className="mt-16 justify-self-start print:hidden"
              onClick={navigateToBeispielePage}
            >
              <ChevronLeft /> Zurück zur Auswahl
            </Button>

            <p className="my-16 max-w-[70ch]">
              Hinweis: Mutterschaftsleistungen werden nicht in der Summe
              berücksichtigt.
              <br />
              Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass
              etwas abgezogen wird. Auf das angezeigte Einkommen müssen noch
              Steuern entrichtet werden.
            </p>

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

  describe("Planer Page", async () => {
    const { Elternteil, Variante, berechneGesamtsumme } = await import(
      "@/monatsplaner"
    );

    const { useNavigateStateful } = await import(
      "@/application/pages/planungsteil/useNavigateStateful"
    );

    const { render, screen } = await import("@/application/test-utils");
    const { INITIAL_STATE } = await import("@/application/test-utils");

    type NavigateStatefulHook = ReturnType<typeof useNavigateStateful>;
    type NavigateStateful = NavigateStatefulHook["navigateStateful"];

    const navigateSpy = vi.fn<NavigateStateful>();

    beforeEach(() => {
      vi.mock(import("react-router"), () => ({ useNavigate: vi.fn() }));

      vi.mock(
        import("@/application/pages/planungsteil/useNavigateStateful"),
        () => ({ useNavigateStateful: vi.fn() }),
      );

      vi.mocked(berechneGesamtsumme).mockReturnValue({
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

      vi.mocked(useNavigateStateful).mockReturnValue({
        navigationState: {},
        navigateStateful: navigateSpy,
      });
    });

    describe("Neue leere Planung erstellen", async () => {
      const { erstelleInitialeLebensmonate } = await import("@/monatsplaner");

      it("ist interaktiv wenn eine Änderung am Plan gemacht wurde", () => {
        const ausgangslage: AusgangslageFuerZweiElternteile = {
          anzahlElternteile: 2 as const,
          geburtsdatumDesKindes: new Date(),
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          informationenZumMutterschutz: {
            empfaenger: Elternteil.Eins,
            letzterLebensmonatMitSchutz: 2,
          },
        };

        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: ausgangslage,
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

        render(<PlanerPage />, {
          preloadedState: INITIAL_STATE,
        });

        const resetPlanButton = screen.queryByText(
          "Neue leere Planung erstellen",
        );

        expect(resetPlanButton).not.toBeDisabled();
      });

      it("ist deaktiviert bei leerem Plan mit Mutterschutz", () => {
        const ausgangslage: AusgangslageFuerZweiElternteile = {
          anzahlElternteile: 2 as const,
          geburtsdatumDesKindes: new Date(),
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          informationenZumMutterschutz: {
            empfaenger: Elternteil.Eins,
            letzterLebensmonatMitSchutz: 2,
          },
        };

        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: ausgangslage,
              lebensmonate: erstelleInitialeLebensmonate(ausgangslage),
            },
          },
          navigateStateful: navigateSpy,
        });

        render(<PlanerPage />, {
          preloadedState: INITIAL_STATE,
        });

        const resetPlanButton = screen.queryByText(
          "Neue leere Planung erstellen",
        );

        expect(resetPlanButton).toBeDisabled();
      });
    });
  });
}
