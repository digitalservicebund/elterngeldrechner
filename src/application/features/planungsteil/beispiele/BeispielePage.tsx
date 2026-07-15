import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/application/features/components";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { generatePathFromEvent } from "@/application/routing";
import type { Beispiel } from "@/application/features/planungsteil/beispiele";
import {
  AuswahloptionenLegende as BeispielAuswahloptionenLegende,
  Beschreibung as BeispielBeschreibung,
  Radiobutton as BeispielRadiobutton,
  Visualisierung as BeispielVisualisierung,
  erstelleBeispiele,
} from "@/application/features/planungsteil/beispiele";
import {
  Anleitung,
  Erklaerung,
} from "@/application/features/planungsteil/planer";
import { Page } from "@/application/features/components/Page";
import {
  trackMetricsForDerPlanHatSichGeaendert,
  trackMetricsForErklaerungenWurdenGeoeffnet,
  trackMetricsForErklaerungenWurdenGeschlossen,
} from "@/application/features/planungsteil/planer/tracking";
import { useAusgangslage } from "@/application/features/planungsteil/planer/hooks/useAusgangslage";
import { useBerechneElterngeldbezuege } from "@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege";
import { useNavigateStateful } from "@/application/features/planungsteil/planer/hooks/useNavigateStateful";
import {
  createTrackedNavigationFunction,
  posthog,
  pushTrackingEvent,
  setTrackingVariable,
  trackReachedConversionGoal,
  trackUsageOfPlanungshilfen,
} from "@/application/user-tracking";
import type {
  Ausgangslage,
  AusgangslageFuerZweiElternteile,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";
import { sindLebensmonateGeplant } from "@/monatsplaner";
import AddIcon from "~icons/material-symbols/add";
import EditIcon from "~icons/material-symbols/edit-outline";

export function BeispielePage() {
  // TODO: Ensure consistent use of the term planungshilfen rather than beispiele

  const navigate = useNavigate();

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialerPlan, beispiel: initialesBeispiel } = navigationState;

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const ausgangslage = useAusgangslage();
  const eventContext = useEventContext();
  const [plan, setPlan] = useState<PlanMitBeliebigenElternteilen>();

  const navigiereZuEinkommen = createTrackedNavigationFunction(
    "/beispiele",
    async () => {
      const letztesEvent = eventContext.findeLetztesEvent();
      await navigate(generatePathFromEvent(letztesEvent!));
    },
  );

  const navigiereZuPlaner = async () => {
    const beispiel = beispiele.find((beispiel) => {
      return beispiel.identifier === aktivesBeispiel;
    });

    if (beispiel) {
      trackReachedConversionGoal();
      trackUsageOfPlanungshilfen();

      posthog.capture("beispiel_uebernommen", {
        identifier: beispiel.identifier,
      });
    }

    pushTrackingEvent("Planung-wurde-gestartet", { unique: true });

    await navigateStateful("/rechner-planer", {
      beispiel,
      plan,
    });
  };

  const navigiereZuPlanerMitInitialemPlan = async () => {
    await navigateStateful("/rechner-planer", {
      beispiel: undefined,
      plan: initialerPlan,
    });
  };

  const [isErklaerungOpen, setIsErklaerungOpen] = useState(false);

  const hatEigenePlanung = useMemo(
    () => initialerPlan && sindLebensmonateGeplant(initialerPlan),
    [initialerPlan],
  );

  // TODO: I tried to type state as BeispielIdentifier | "KeineAuswahl" | "EigenePlanung"
  // but all are strings, so typescript considers the literals redundant and the types clash.

  const KeineAuswahl = "Keine Auswahl";
  const EigenePlanung = "Eigene Planung";

  const [aktivesBeispiel, setAktivesBeispiel] = useState<string>(KeineAuswahl);

  const beispiele: Beispiel<Ausgangslage>[] = useMemo(
    () => erstelleBeispiele(ausgangslage, berechneElterngeldbezuege),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ausgangslage],
  );

  useEffect(() => {
    if (initialesBeispiel) {
      setPlan(initialesBeispiel.plan);
      setAktivesBeispiel(initialesBeispiel.identifier);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setIdentifierTrackingVariable = setTrackingVariable.bind(
    null,
    "Identifier-des-ausgewaehlten-Beispiels",
  );

  const aktiviereOption = (aktivierteOption: string) => {
    const neuesAktivesBeispiel = beispiele.find(
      (beispiel) => beispiel.identifier === aktivierteOption,
    );

    if (neuesAktivesBeispiel) {
      setPlan(neuesAktivesBeispiel.plan);
      trackMetricsForDerPlanHatSichGeaendert(neuesAktivesBeispiel.plan, true);

      setIdentifierTrackingVariable(neuesAktivesBeispiel.identifier);

      posthog.capture("beispiel_geklickt", {
        identifier: neuesAktivesBeispiel.identifier,
      });
    } else if (aktivierteOption === EigenePlanung) {
      setPlan(undefined);

      const elternStatus = () => {
        if (ausgangslage.istAlleinerziehend) {
          return "Alleinerziehend";
        }
        if (ausgangslage.anzahlElternteile === 2) {
          return "Gemeinsame Planung";
        }
        return "Allein planend";
      };

      setIdentifierTrackingVariable(`${elternStatus()} - Eigene Planung`);

      posthog.capture("beispiel_geklickt", {
        identifier: `${elternStatus()} - Eigene Planung`,
      });
    }

    pushTrackingEvent("Beispiel-wurde-ausgewählt");

    setAktivesBeispiel(aktivierteOption);
  };

  function showErklaerung(): void {
    setIsErklaerungOpen(true);
    trackMetricsForErklaerungenWurdenGeoeffnet();
    posthog.capture("erklaerung_geoeffnet");
  }

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
    trackMetricsForErklaerungenWurdenGeschlossen();
  }

  const [areAllBeispieleVisible, setAreAllBeispieleVisible] = useState(false);

  const sichtbareBeispiele = useMemo(
    () => (areAllBeispieleVisible ? beispiele : beispiele.slice(0, 2)),
    [areAllBeispieleVisible, beispiele],
  );

  useEffect(() => {
    sichtbareBeispiele.forEach((beispiel) => {
      posthog.capture("beispiel_angezeigt", {
        identifier: beispiel.identifier,
      });
    });
  }, [sichtbareBeispiele]);

  function showAllBeispiele(): void {
    posthog.capture("weitere_vorschlaege_angezeigt_geklickt");

    setAreAllBeispieleVisible(true);
  }

  return (
    <Page id="beispiele-page" heading="Planung starten">
      {isErklaerungOpen ? (
        <Erklaerung onClose={hideErklaerung} />
      ) : (
        <div className="flex flex-col gap-32">
          <h3>Wollen Sie einen Vorschlag für Ihre Planung?</h3>

          <div className="mb-20">
            <p>
              Wählen Sie einen Vorschlag aus und passen Sie ihn im Planer auf
              der nächsten Seite an. Alternativ können Sie auch eine eigene
              Planung ohne Vorschlag beginnen.
            </p>

            <Anleitung
              description="Erfahren Sie mehr über das Elterngeld"
              onOpenErklaerung={showErklaerung}
              className="-mt-10 mb-16"
            />

            <BeispielAuswahloptionenLegende beispiele={beispiele} />
          </div>

          <fieldset>
            <legend className="sr-only">Beispielauswahl</legend>

            <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 md:grid-cols-3">
              {sichtbareBeispiele.map((beispiel) => (
                <BeispielRadiobutton
                  titel={beispiel.titel}
                  key={beispiel.identifier}
                  inputName="Beispieloption"
                  beschreibung={beispiel.beschreibung}
                  checked={aktivesBeispiel === beispiel.identifier}
                  onChange={() => aktiviereOption(beispiel.identifier)}
                  body={
                    beispiel.identifier !== EigenePlanung && (
                      <BeispielBeschreibung beispiel={beispiel} />
                    )
                  }
                  footer={
                    beispiel.identifier !== EigenePlanung && (
                      <BeispielVisualisierung beispiel={beispiel} />
                    )
                  }
                />
              ))}

              <BeispielRadiobutton
                titel="Eigene Planung"
                beschreibung="Erstellen Sie Ihre eigene Planung und probieren Sie verschiedene Aufteilungen des Elterngelds aus."
                inputName="Beispieloption"
                checked={aktivesBeispiel === EigenePlanung}
                onChange={() => aktiviereOption(EigenePlanung)}
              />

              {beispiele.length > 3 && !areAllBeispieleVisible && (
                <Button
                  className="col-span-full mb-20"
                  type="button"
                  buttonStyle="link"
                  onClick={showAllBeispiele}
                >
                  <AddIcon className="mr-4" />
                  Noch mehr Vorschläge anzeigen
                </Button>
              )}
            </div>
          </fieldset>

          {!!hatEigenePlanung && (
            <div className="content-center">
              <EditIcon className="mr-4" />

              <Button
                type="button"
                buttonStyle="link"
                onClick={() => navigiereZuPlanerMitInitialemPlan()}
              >
                Planungs-Entwurf weiter bearbeiten
              </Button>
            </div>
          )}

          <div className="flex gap-16">
            <Button
              type="button"
              buttonStyle="secondary"
              onClick={() => navigiereZuEinkommen()}
            >
              Zurück
            </Button>

            <Button
              type="button"
              buttonStyle="primary"
              onClick={() => navigiereZuPlaner()}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}

if (import.meta.vitest) {
  const { beforeEach, vi, describe, it, expect } = import.meta.vitest;

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
    "@/application/features/planungsteil/planer/hooks/useNavigateStateful",
    () => ({
      useNavigateStateful: vi.fn(),
    }),
  );
  vi.mock("@/application/features/abfrageteil/events/EventContext", () => ({
    useEventContext: () => ({
      findeLetztesEvent: vi.fn(),
      findeLetztesGueltigesEvent: vi.fn(),
    }),
  }));
  vi.mock(import("@/application/user-tracking"));
  vi.mock(import("@/application/features/planungsteil/planer/tracking"));

  describe("Beispiele Page", async () => {
    const { useAusgangslage } =
      await import("@/application/features/planungsteil/planer/hooks/useAusgangslage");
    const { useBerechneElterngeldbezuege } =
      await import("@/application/features/planungsteil/planer/hooks/useBerechneElterngeldbezuege");
    const { useNavigateStateful } =
      await import("@/application/features/planungsteil/planer/hooks/useNavigateStateful");
    const { MemoryRouter } = await import("react-router");

    const { render, screen } = await import("@testing-library/react");
    const { Elternteil } = await import("@/monatsplaner");

    const renderPageWithMemoryRouter = () => {
      return render(<BeispielePage />, { wrapper: MemoryRouter });
    };

    const mockAusgangslage = {
      anzahlElternteile: 2 as const,
      geburtsdatumDesKindes: new Date(),
      namenDerElternteile: {
        [Elternteil.Eins]: "Jasper Darwin Artus",
        [Elternteil.Zwei]: "Salomé Loreley Zoe",
      },
    };

    type NavigateStatefulHook = ReturnType<typeof useNavigateStateful>;
    type NavigateStateful = NavigateStatefulHook["navigateStateful"];
    type NavigateState = Parameters<NavigateStateful>[1];

    const navigateSpy = vi.fn<NavigateStateful>();

    beforeEach(() => {
      vi.mocked(useAusgangslage).mockReturnValue(mockAusgangslage);
      vi.mocked(useBerechneElterngeldbezuege).mockReturnValue(
        vi.fn().mockReturnValue({}),
      );
      vi.mocked(useNavigateStateful).mockReturnValue({
        navigationState: {},
        navigateStateful: navigateSpy,
      });
    });

    describe("selection", async () => {
      const { Variante, erstelleInitialeLebensmonate } =
        await import("@/monatsplaner");

      const mockAusgangslageWithMutterschutz: AusgangslageFuerZweiElternteile =
        {
          ...mockAusgangslage,
          informationenZumMutterschutz: {
            empfaenger: Elternteil.Eins,
            letzterLebensmonatMitSchutz: 2,
          },
        };

      it("zeigt eine kachel pro beispiel und eine option für eigene planung", () => {
        renderPageWithMemoryRouter();

        expect(screen.getAllByRole("radio")).toHaveLength(3);
      });

      it("navigiert mit beispiel und plan nachdem eine beispiel selektiert wurde", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Weiter").click();

        const expectation = (argument: NavigateState) => {
          return (
            argument.plan != null &&
            argument.beispiel != null &&
            argument.beispiel.titel === "Vorschlag 1"
          );
        };

        expect(navigateSpy).toHaveBeenCalledWith(
          "/rechner-planer",
          expect.toSatisfy(expectation),
        );
      });

      it("eigene planung überschreibt ein vorher selektiertes beispiel", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Eigene Planung").click();

        screen.getByText("Weiter").click();

        const expectation = (argument: NavigateState) => {
          return argument.plan === undefined && argument.beispiel == null;
        };

        expect(navigateSpy).toHaveBeenCalledWith(
          "/rechner-planer",
          expect.toSatisfy(expectation),
        );
      });

      it("planungs-entwurf weiter bearbeiten ist nicht sichtbar bei leerem plan", () => {
        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: mockAusgangslage,
              lebensmonate: {},
            },
          },
          navigateStateful: navigateSpy,
        });

        renderPageWithMemoryRouter();

        expect(
          screen.queryByText("Planungs-Entwurf weiter bearbeiten"),
        ).toBeNull();
      });

      it("planungs-entwurf weiter bearbeiten ist sichtbar wenn ein plan erstellt wurde", () => {
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

        renderPageWithMemoryRouter();

        expect(
          screen.queryByText("Planungs-Entwurf weiter bearbeiten"),
        ).not.toBeNull();
      });

      it("planungs-entwurf weiter bearbeiten ist nicht sichtbar bei leerem plan mit mutterschutz", () => {
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

        renderPageWithMemoryRouter();

        expect(
          screen.queryByText("Planungs-Entwurf weiter bearbeiten"),
        ).toBeNull();
      });

      it("planungs-entwurf weiter bearbeiten übernimmt den initialen plan", () => {
        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: {
                anzahlElternteile: 1,
                geburtsdatumDesKindes: new Date(),
              },
              lebensmonate: {
                1: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Plus,
                    imMutterschutz: false as const,
                  },
                  [Elternteil.Zwei]: {
                    gewaehlteOption: Variante.Plus,
                    imMutterschutz: false as const,
                  },
                },
                2: {
                  [Elternteil.Eins]: {
                    gewaehlteOption: Variante.Plus,
                    imMutterschutz: false as const,
                  },
                  [Elternteil.Zwei]: {
                    gewaehlteOption: Variante.Plus,
                    imMutterschutz: false as const,
                  },
                },
              },
            },
          },
          navigateStateful: navigateSpy,
        });

        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Planungs-Entwurf weiter bearbeiten").click();

        const expectation = (argument: NavigateState) => {
          return !!argument.plan && argument.beispiel == null;
        };

        expect(navigateSpy).toHaveBeenCalledWith(
          "/rechner-planer",
          expect.toSatisfy(expectation),
        );
      });
    });

    describe("tracking", async () => {
      const trackingModule = await import("@/application/user-tracking");
      const plannerTrackingModule =
        await import("@/application/features/planungsteil/planer/tracking");
      const { act } = await import("@testing-library/react");
      const { erstelleBeispiele } =
        await import("@/application/features/planungsteil/beispiele");

      const {
        setTrackingVariable,
        pushTrackingEvent,
        trackReachedConversionGoal,
        trackUsageOfPlanungshilfen,
      } = trackingModule;
      const { trackMetricsForDerPlanHatSichGeaendert } = plannerTrackingModule;

      beforeEach(() => vi.clearAllMocks());

      it("schreibt nach einer auswahl die option in eine tracking variable", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        expect(setTrackingVariable).toHaveBeenCalledExactlyOnceWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Ein Jahr mit Begleitung",
        );
      });

      it("trackt die plan-metriken nach Auswahl eines Beispiels als gueltigen Plan", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        expect(
          trackMetricsForDerPlanHatSichGeaendert,
        ).toHaveBeenCalledExactlyOnceWith(expect.anything(), true);
      });

      it("schreibt bei eigener planung diese in die tracking variable", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Eigene Planung").click();

        expect(setTrackingVariable).toHaveBeenLastCalledWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Eigene Planung",
        );
      });

      it("trackt Beispiel-wurde-ausgewählt nach Auswahl eines Beispiels", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        expect(pushTrackingEvent).toHaveBeenLastCalledWith(
          "Beispiel-wurde-ausgewählt",
        );
      });

      it("trackt Beispiel-wurde-ausgewählt auch bei der Option Eigene Planung", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Eigene Planung").click();

        expect(pushTrackingEvent).toHaveBeenLastCalledWith(
          "Beispiel-wurde-ausgewählt",
        );
      });

      it("erreicht conversion goal wenn mit einem Beispiel weiter navigiert wird", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Weiter").click();

        expect(trackReachedConversionGoal).toHaveBeenCalledOnce();
      });

      it("erreicht conversion goal nicht wenn mit eigener Planung weiter navigiert wird", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Eigene Planung").click();

        screen.getByText("Weiter").click();

        expect(trackReachedConversionGoal).not.toHaveBeenCalled();
      });

      it("trackt zu dem conversion goal auch noch dass es durch die planungshilfen erreicht wurde", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Weiter").click();

        expect(trackUsageOfPlanungshilfen).toHaveBeenCalled();
      });

      it("trackt nicht die nutzung der planungshilfen wenn eigene planung verwendet wird", () => {
        renderPageWithMemoryRouter();

        screen.getByText("Eigene Planung").click();

        screen.getByText("Weiter").click();

        expect(trackUsageOfPlanungshilfen).not.toHaveBeenCalled();
      });

      it("feuert beispiel_angezeigt nicht erneut wenn die Seite neu rendert", () => {
        const captureSpy = vi
          .spyOn(trackingModule.posthog, "capture")
          .mockReturnValue(undefined);

        renderPageWithMemoryRouter();

        const angezeigtNachMount = captureSpy.mock.calls.filter(
          ([event]) => event === "beispiel_angezeigt",
        );

        act(() => screen.getByText("Vorschlag 1").click());

        const angezeigtNachAuswahl = captureSpy.mock.calls.filter(
          ([event]) => event === "beispiel_angezeigt",
        );

        expect(angezeigtNachAuswahl).toEqual(angezeigtNachMount);
      });

      it("feuert beispiel_angezeigt für ein Beispiel sobald es zusätzlich eingeblendet wird", () => {
        const [zusaetzlichesBeispiel] = erstelleBeispiele(
          mockAusgangslage,
          vi.fn().mockReturnValue({}),
        ).slice(2);

        const captureSpy = vi
          .spyOn(trackingModule.posthog, "capture")
          .mockReturnValue(undefined);

        renderPageWithMemoryRouter();

        expect(captureSpy).not.toHaveBeenCalledWith("beispiel_angezeigt", {
          identifier: zusaetzlichesBeispiel!.identifier,
        });

        act(() => screen.getByText("Noch mehr Vorschläge anzeigen").click());

        expect(captureSpy).toHaveBeenCalledWith("beispiel_angezeigt", {
          identifier: zusaetzlichesBeispiel!.identifier,
        });
      });
    });
  });
}
