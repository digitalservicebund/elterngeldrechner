import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/application/components";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import {
  AuswahloptionenLegende as BeispielAuswahloptionenLegende,
  type Beispiel,
  Beschreibung as BeispielBeschreibung,
  Radiobutton as BeispielRadiobutton,
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
import { Ausgangslage, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

export function BeispielePage() {
  // TODO: Fix Eigene Planung layout for ein elternteil in the last layout row
  // TODO: Ensure consistent use of the term beispiele rather than planungshilfen

  const store = useAppStore();
  const navigate = useNavigate();

  const { navigationState, navigateStateful } = useNavigateStateful();
  const { plan: initialerPlan, beispiel: initialesBeispiel } = navigationState;

  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  const navigateToEinkommenPage = async () => {
    await navigate(formSteps.einkommen.route);
  };

  const ausgangslage = composeAusgangslageFuerPlaner(store.getState());
  const [plan, setPlan] = useState<PlanMitBeliebigenElternteilen>();

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
    } else if (initialerPlan) {
      setPlan(initialerPlan);
      setAktivesBeispiel(EigenePlanung);
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
      if (initialerPlan) {
        setPlan(initialerPlan);
      } else {
        setPlan(undefined);
      }

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

  const navigateToRechnerUndPlanerPage = async () => {
    const beispiel = beispiele.find((beispiel) => {
      return beispiel.identifier === aktivesBeispiel;
    });

    await navigateStateful(formSteps.rechnerUndPlaner.route, {
      plan,
      beispiel,
    });
  };

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-32">
        <p>
          Sie können eine Planungshilfe auswählen und sie anschließend im Planer
          nach Ihren Bedürfnissen anpassen.
        </p>

        <BeispielAuswahloptionenLegende beispiele={beispiele} />

        <fieldset>
          <legend className="sr-only">Beispielauswahl</legend>

          <div className="grid grid-cols-1 gap-26 md:grid-cols-3">
            {beispiele.map((beispiel) => (
              <BeispielRadiobutton
                titel={beispiel.titel}
                key={beispiel.identifier}
                inputName="Beispieloption"
                checked={aktivesBeispiel === beispiel.identifier}
                onChange={() => aktiviereOption(beispiel.identifier)}
              >
                <BeispielBeschreibung beispiel={beispiel} />
              </BeispielRadiobutton>
            ))}

            <BeispielRadiobutton
              titel={
                initialerPlan
                  ? "Meine Planung fortsetzen"
                  : "Eigene Planung anlegen"
              }
              inputName="Beispieloption"
              checked={aktivesBeispiel === EigenePlanung}
              onChange={() => aktiviereOption(EigenePlanung)}
              className="md:col-span-3"
            />
          </div>
        </fieldset>

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToEinkommenPage}
          >
            Zurück
          </Button>

          <Button
            type="button"
            buttonStyle="primary"
            onClick={navigateToRechnerUndPlanerPage}
          >
            Weiter
          </Button>
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
      const { Elternteil, Variante } = await import("@/monatsplaner");

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

        screen.getByText("Partnerschaftliche Aufteilung").click();

        screen.getByText("Weiter").click();

        const expectation = (argument: NavigateState) => {
          return (
            argument.plan != null &&
            argument.beispiel != null &&
            argument.beispiel.titel === "Partnerschaftliche Aufteilung"
          );
        };

        expect(navigateSpy).toHaveBeenCalledWith(
          "/rechner-planer",
          expect.toSatisfy(expectation),
        );
      });

      it("im ersten durchlauf überschreibt eigene planung ein vorher selektiertes beispiel", () => {
        render(<BeispielePage />, {
          preloadedState: INITIAL_STATE,
        });

        screen.getByText("Partnerschaftliche Aufteilung").click();

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

      it("verwendet fuer eigene planung den plan aus dem navigation state wenn gesetzt", () => {
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

        screen.getByText("Partnerschaftliche Aufteilung").click();

        screen.getByText("Meine Planung fortsetzen").click();

        screen.getByText("Weiter").click();

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

        screen.getByText("Partnerschaftliche Aufteilung").click();

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

        screen.getByText("Partnerschaftliche Aufteilung").click();

        screen.getByText("Eigene Planung anlegen").click();

        expect(trackingFunction).toHaveBeenLastCalledWith(
          "Identifier-des-ausgewaehlten-Beispiels",
          "Gemeinsame Planung - Eigene Planung anlegen",
        );
      });
    });
  });
}
