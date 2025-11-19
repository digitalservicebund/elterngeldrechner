import AddIcon from "@digitalservicebund/icons/Add";
import EditIcon from "@digitalservicebund/icons/EditOutlined";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/application/components";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import type { Beispiel } from "@/application/features/beispiele";
import {
  AuswahloptionenLegende as BeispielAuswahloptionenLegende,
  Beschreibung as BeispielBeschreibung,
  Radiobutton as BeispielRadiobutton,
  Visualisierung as BeispielVisualisierung,
  erstelleBeispiele,
} from "@/application/features/beispiele";
import { Anleitung, Erklaerung } from "@/application/features/planer";
import { Page } from "@/application/pages/Page";
import {
  trackMetricsForErklaerungenWurdenGeoeffnet,
  trackMetricsForErklaerungenWurdenGeschlossen,
} from "@/application/pages/planungsteil/Planer/tracking";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateStateful } from "@/application/pages/planungsteil/useNavigateStateful";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import {
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

export function BeispielePage() {
  // TODO: Ensure consistent use of the term planungshilfen rather than beispiele

  const store = useAppStore();
  const navigate = useNavigate();

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialerPlan, beispiel: initialesBeispiel } = navigationState;

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const ausgangslage = composeAusgangslageFuerPlaner(store.getState());
  const [plan, setPlan] = useState<PlanMitBeliebigenElternteilen>();

  const navigiereZuEinkommen = async () => {
    await navigate(formSteps.einkommen.route);
  };

  const navigiereZuPlaner = async () => {
    const beispiel = beispiele.find((beispiel) => {
      return beispiel.identifier === aktivesBeispiel;
    });

    if (beispiel) {
      trackReachedConversionGoal();
      trackUsageOfPlanungshilfen();
    }

    pushTrackingEvent("Planung-wurde-gestartet", { unique: true });

    await navigateStateful(formSteps.rechnerUndPlaner.route, {
      beispiel,
      plan,
    });
  };

  const navigiereZuPlanerMitInitialemPlan = async () => {
    await navigateStateful(formSteps.rechnerUndPlaner.route, {
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

      setIdentifierTrackingVariable(neuesAktivesBeispiel.identifier);
    } else if (aktivierteOption === EigenePlanung) {
      setPlan(undefined);

      const elternStatus = ausgangslage.istAlleinerziehend
        ? "Alleinerziehend"
        : ausgangslage.anzahlElternteile === 2
          ? "Gemeinsame Planung"
          : "Allein planend";

      setIdentifierTrackingVariable(`${elternStatus} - Eigene Planung`);
    }

    pushTrackingEvent("Beispiel-wurde-ausgewählt");

    setAktivesBeispiel(aktivierteOption);
  };

  function showErklaerung(): void {
    setIsErklaerungOpen(true);
    trackMetricsForErklaerungenWurdenGeoeffnet();
  }

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
    trackMetricsForErklaerungenWurdenGeschlossen();
  }

  const [areAllBeispieleVisible, setAreAllBeispieleVisible] = useState(false);

  const listeMitBeispielen = areAllBeispieleVisible
    ? beispiele
    : beispiele.slice(0, 2);

  function showAllBeispiele(): void {
    setAreAllBeispieleVisible(true);
  }

  return (
    <Page step={formSteps.beispiele}>
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
              {listeMitBeispielen.map((beispiel) => (
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

  describe("Beispiele Page", async () => {
    const { useNavigateStateful } = await import(
      "@/application/pages/planungsteil/useNavigateStateful"
    );

    const { render, screen } = await import("@/application/test-utils");
    const { INITIAL_STATE } = await import("@/application/test-utils");

    type NavigateStatefulHook = ReturnType<typeof useNavigateStateful>;
    type NavigateStateful = NavigateStatefulHook["navigateStateful"];
    type NavigateState = Parameters<NavigateStateful>[1];

    const navigateSpy = vi.fn<NavigateStateful>();

    beforeEach(() => {
      vi.mock(import("react-router"), () => ({ useNavigate: vi.fn() }));

      vi.mock(
        import("@/application/pages/planungsteil/useNavigateStateful"),
        () => ({ useNavigateStateful: vi.fn() }),
      );

      vi.mocked(useNavigateStateful).mockReturnValue({
        navigationState: {},
        navigateStateful: navigateSpy,
      });
    });

    describe("selection", async () => {
      const { Elternteil, Variante, erstelleInitialeLebensmonate } =
        await import("@/monatsplaner");

      it("zeigt eine kachel pro beispiel und eine option für eigene planung", () => {
        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        expect(screen.getAllByRole("radio")).toHaveLength(3);
      });

      it("navigiert mit beispiel und plan nachdem eine beispiel selektiert wurde", () => {
        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

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
        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

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
        const ausgangslage: AusgangslageFuerZweiElternteile = {
          anzahlElternteile: 2 as const,
          geburtsdatumDesKindes: new Date(),
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
        };

        vi.mocked(useNavigateStateful).mockReturnValue({
          navigationState: {
            plan: {
              ausgangslage: ausgangslage,
              lebensmonate: {},
            },
          },
          navigateStateful: navigateSpy,
        });

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        expect(
          screen.queryByText("Planungs-Entwurf weiter bearbeiten"),
        ).toBeNull();
      });

      it("planungs-entwurf weiter bearbeiten ist sichtbar wenn ein plan erstellt wurde", () => {
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

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        expect(
          screen.queryByText("Planungs-Entwurf weiter bearbeiten"),
        ).not.toBeNull();
      });

      it("planungs-entwurf weiter bearbeiten ist nicht sichtbar bei leerem plan mit mutterschutz", () => {
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

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

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

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

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

      it("schreibt nach einer auswahl die option in eine tracking variable", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Vorschlag 1").click();

        expect(trackingFunction).toHaveBeenCalledExactlyOnceWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Partnerschaftliche Aufteilung",
        );
      });

      it("eigene planung setzt das tracking des ausgewaehlten beispiel zurueck", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Eigene Planung").click();

        expect(trackingFunction).toHaveBeenLastCalledWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          null,
        );
      });

      it("trackt Beispiel-wurde-ausgewählt nach Auswahl eines Beispiels", () => {
        const trackingFunction = vi.spyOn(trackingModule, "pushTrackingEvent");

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Vorschlag 1").click();

        expect(trackingFunction).toHaveBeenLastCalledWith(
          "Beispiel-wurde-ausgewählt",
        );
      });

      it("trackt Beispiel-wurde-ausgewählt nicht bei der Option Eigene Planung", () => {
        const trackingFunction = vi.spyOn(trackingModule, "pushTrackingEvent");

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Eigene Planung").click();

        expect(trackingFunction).not.toBeCalled();
      });

      it("erreicht conversion goal wenn mit einem Beispiel weiter navigiert wird", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "trackReachedConversionGoal",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Weiter").click();

        expect(trackingFunction).toHaveBeenCalledOnce();
      });

      it("erreicht conversion goal nicht wenn mit eigener Planung weiter navigiert wird", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "trackReachedConversionGoal",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Eigene Planung").click();

        screen.getByText("Weiter").click();

        expect(trackingFunction).not.toHaveBeenCalled();
      });

      it("trackt zu dem conversion goal auch noch dass es durch die planungshilfen erreicht wurde", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "trackUsageOfPlanungshilfen",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Vorschlag 1").click();

        screen.getByText("Weiter").click();

        expect(trackingFunction).toHaveBeenCalled();
      });

      it("trackt nicht die nutzung der planungshilfen wenn eigene planung verwendet wird", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "trackUsageOfPlanungshilfen",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Eigene Planung").click();

        screen.getByText("Weiter").click();

        expect(trackingFunction).not.toHaveBeenCalled();
      });
    });
  });
}
