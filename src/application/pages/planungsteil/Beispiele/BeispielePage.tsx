import ChevronRight from "@digitalservicebund/icons/ChevronRight";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/application/components";
import {
  composeAusgangslageFuerPlaner,
  YesNo,
} from "@/application/features/abfrageteil/state";
import type { Beispiel } from "@/application/features/beispiele";
import {
  AuswahloptionenLegende as BeispielAuswahloptionenLegende,
  Beschreibung as BeispielBeschreibung,
  Radiobutton as BeispielRadiobutton,
  Visualisierung as BeispielVisualisierung,
  erstelleBeispiele,
} from "@/application/features/beispiele";
import { Page } from "@/application/pages/Page";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateStateful } from "@/application/pages/planungsteil/useNavigateStateful";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import {
  pushTrackingEvent,
  setTrackingVariable,
} from "@/application/user-tracking";
import type {
  Ausgangslage,
  AusgangslageFuerZweiElternteile,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";
import { sindLebensmonateGeplant } from "@/monatsplaner";

export function BeispielePage() {
  // TODO: Ensure consistent use of the term beispiele rather than planungshilfen

  const store = useAppStore();

  console.log("store", store.getState());
  const navigate = useNavigate();

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialerPlan, beispiel: initialesBeispiel } = navigationState;

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const ausgangslage = composeAusgangslageFuerPlaner(store.getState());
  const [plan, setPlan] = useState<PlanMitBeliebigenElternteilen>();

  const navigiereZuEinkommen = async () => {
    const state = store.getState();
    const alleinerziehend = state.stepPrototyp.alleinerziehend;
    if (alleinerziehend === YesNo.YES) {
      await navigate(formSteps.person1.route);
    } else {
      await navigate(formSteps.person2.route);
    }
    // navigate(-1)
  };

  const navigiereZuPlaner = async () => {
    const beispiel = beispiele.find((beispiel) => {
      return beispiel.identifier === aktivesBeispiel;
    });

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

  function sindGemeinsamErziehend(ausgangslage: Ausgangslage): boolean {
    return ausgangslage.anzahlElternteile === 2;
  }

  function istAlleinePlanend(ausgangslage: Ausgangslage): boolean {
    return (
      ausgangslage.anzahlElternteile === 1 && !ausgangslage.istAlleinerziehend
    );
  }

  function istAlleinerziehend(ausgangslage: Ausgangslage): boolean {
    return (
      ausgangslage.anzahlElternteile === 1 && !!ausgangslage.istAlleinerziehend
    );
  }

  const aktiviereOption = (aktivierteOption: string) => {
    const neuesAktivesBeispiel = beispiele.find(
      (beispiel) => beispiel.identifier === aktivierteOption,
    );

    if (neuesAktivesBeispiel) {
      setPlan(neuesAktivesBeispiel.plan);

      setIdentifierTrackingVariable(neuesAktivesBeispiel.identifier);
    } else if (aktivierteOption === EigenePlanung) {
      setPlan(undefined);

      // All beispiele are prefixed with a description of the
      // ausgangslage. The same prefix is applied to eigene
      // planung to ensure its identifier remains consistent
      // with the other examples in Metabase.

      if (sindGemeinsamErziehend(ausgangslage)) {
        setIdentifierTrackingVariable(
          "Gemeinsame Planung - Eigene Planung anlegen",
        );
      } else if (istAlleinePlanend(ausgangslage)) {
        setIdentifierTrackingVariable(
          "Allein planend - Eigene Planung anlegen",
        );
      } else if (istAlleinerziehend(ausgangslage)) {
        setIdentifierTrackingVariable(
          "Alleinerziehend - Eigene Planung anlegen",
        );
      }
    }

    setAktivesBeispiel(aktivierteOption);

    pushTrackingEvent("Beispiel-wurde-ausgewählt");
  };

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-32">
        <p className="pb-40">
          Sie können eine Planungshilfe auswählen und sie anschließend im Planer
          nach Ihren Bedürfnissen anpassen.
        </p>

        <BeispielAuswahloptionenLegende beispiele={beispiele} />

        <fieldset>
          <legend className="sr-only">Beispielauswahl</legend>

          <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 md:grid-cols-3">
            {beispiele.map((beispiel) => (
              <BeispielRadiobutton
                titel={beispiel.titel}
                key={beispiel.identifier}
                inputName="Beispieloption"
                checked={aktivesBeispiel === beispiel.identifier}
                onChange={() => aktiviereOption(beispiel.identifier)}
                body={<BeispielBeschreibung beispiel={beispiel} />}
                footer={<BeispielVisualisierung beispiel={beispiel} />}
              />
            ))}

            <BeispielRadiobutton
              titel="Eigene Planung anlegen"
              inputName="Beispieloption"
              checked={aktivesBeispiel === EigenePlanung}
              onChange={() => aktiviereOption(EigenePlanung)}
              className="col-span-full"
            />
          </div>
        </fieldset>

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

          {!!hatEigenePlanung && (
            <div className="content-center pl-20">
              <Button
                type="button"
                buttonStyle="link"
                onClick={() => navigiereZuPlanerMitInitialemPlan()}
              >
                Meine Planung fortsetzen
              </Button>

              <ChevronRight />
            </div>
          )}
        </div>
      </div>
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

        expect(screen.getAllByRole("radio")).toHaveLength(7);
      });

      it("navigiert mit beispiel und plan nachdem eine beispiel selektiert wurde", () => {
        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Partnerschaftlich aufgeteilt").click();

        screen.getByText("Weiter").click();

        const expectation = (argument: NavigateState) => {
          return (
            argument.plan != null &&
            argument.beispiel != null &&
            argument.beispiel.titel === "Partnerschaftlich aufgeteilt"
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

        screen.getByText("Partnerschaftlich aufgeteilt").click();

        screen.getByText("Eigene Planung anlegen").click();

        screen.getByText("Weiter").click();

        const expectation = (argument: NavigateState) => {
          return argument.plan === undefined && argument.beispiel == null;
        };

        expect(navigateSpy).toHaveBeenCalledWith(
          "/rechner-planer",
          expect.toSatisfy(expectation),
        );
      });

      it("meine planung fortsetzen ist nicht sichtbar bei leerem plan", () => {
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

        expect(screen.queryByText("Meine Planung fortsetzen")).toBeNull();
      });

      it("meine planung fortsetzen ist sichtbar wenn ein plan erstellt wurde", () => {
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

        expect(screen.queryByText("Meine Planung fortsetzen")).not.toBeNull();
      });

      it("meine planung fortsetzen ist nicht sichtbar bei leerem plan mit mutterschutz", () => {
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

        expect(screen.queryByText("Meine Planung fortsetzen")).toBeNull();
      });

      it("meine planung fortsetzen übernimmt den initialen plan", () => {
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

        screen.getByText("Partnerschaftlich aufgeteilt").click();

        screen.getByText("Meine Planung fortsetzen").click();

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

        screen.getByText("Partnerschaftlich aufgeteilt").click();

        expect(trackingFunction).toHaveBeenCalledExactlyOnceWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Partnerschaftliche Aufteilung",
        );
      });

      it("trackt eigene planung anlegen im gleichen schema wie die optionen", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Partnerschaftlich aufgeteilt").click();

        screen.getByText("Eigene Planung anlegen").click();

        expect(trackingFunction).toHaveBeenLastCalledWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Eigene Planung anlegen",
        );
      });
    });
  });
}
