import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { trackMetricsForEinBeispielWurdeAusgewaehlt } from "./tracking";
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
import { useNavigateWithPlan } from "@/application/pages/planungsteil/useNavigateWithPlan";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import {
  Ausgangslage,
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";

export function BeispielePage() {
  // TODO: Implement keyboard navigation and test accessibility tree
  // TODO: Implement active option after navigating back from planer

  // TODO: Align features (abrageteil, ...) with pages (abfrageteil, planungsteil)
  // TODO: Add architecture decision record about split in planungsteil, abfrageteil (to be removed after refactoring)
  // TODO: Add readme with hint to source of infoirmation (git hygiene, adr, readme in packages, comments)
  // TODO: What to do with new utiltities package? How to share type safe records? adr? new package? keep duplicated?

  const store = useAppStore();
  const navigate = useNavigate();

  const { navigateWithPlanState } = useNavigateWithPlan();

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

  const handleBeispielChange = (aktivierteOption: string) => {
    const neuesAktivesBeispiel = beispiele.find(
      (beispiel) => beispiel.identifier === aktivierteOption,
    );

    if (neuesAktivesBeispiel) {
      setPlan(neuesAktivesBeispiel.plan);

      trackMetricsForEinBeispielWurdeAusgewaehlt({
        identifier: neuesAktivesBeispiel.identifier,
      });
    } else if (aktivierteOption === EigenePlanung) {
      setPlan({
        ausgangslage: ausgangslage,
        lebensmonate: {},
      });
    }

    setAktivesBeispiel(aktivierteOption);
  };

  const navigateToRechnerUndPlanerPage = async () => {
    await navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);
  };

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-56">
        <BeispielAuswahloptionenLegende beispiele={beispiele} />

        <div
          className="grid grid-cols-1 gap-26 md:grid-cols-2"
          role="radiogroup"
          aria-label="Beispielauswahl"
        >
          {beispiele.map((beispiel) => (
            <BeispielRadiobutton
              titel={beispiel.titel}
              key={beispiel.identifier}
              beschreibung={beispiel.beschreibung}
              checked={aktivesBeispiel === beispiel.identifier}
              onChange={() => handleBeispielChange(beispiel.identifier)}
            >
              <BeispielBeschreibung beispiel={beispiel} />
            </BeispielRadiobutton>
          ))}

          <BeispielRadiobutton
            titel="Eigene Planung anlegen"
            beschreibung="Sie probieren selbst aus, wie Sie Ihr Elterngeld aufteilen und
            erstellen Sie eine Planung ohne Planungshilfe."
            checked={aktivesBeispiel === EigenePlanung}
            onChange={() => handleBeispielChange(EigenePlanung)}
            className="md:col-span-2"
          />
        </div>

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

  describe("Beispiele", async () => {
    const { useNavigateWithPlan } = await import(
      "@/application/pages/planungsteil/useNavigateWithPlan"
    );

    const { INITIAL_STATE, render, screen } = await import(
      "@/application/test-utils"
    );

    const { isLebensmonatszahl, KeinElterngeld, Variante } = await import(
      "@/monatsplaner"
    );

    const { getRecordEntriesWithIntegerKeys } = await import(
      "@/application/utilities"
    );

    beforeEach(() => {
      vi.mock(
        import("@/application/pages/planungsteil/useNavigateWithPlan"),
        () => ({
          useNavigateWithPlan: vi.fn(),
        }),
      );

      vi.mock(import("react-router"), () => ({
        useNavigate: vi.fn(),
      }));

      vi.mock(
        import("@/application/pages/planungsteil/useBerechneElterngeldbezuege"),
      );

      vi.mocked(useNavigateWithPlan).mockReturnValue({
        plan: ANY_PLAN,
        navigateWithPlanState: () => undefined,
      });

      vi.mocked(useBerechneElterngeldbezuege).mockImplementation(
        () => staticElterngeldbezuege,
      );
    });

    it("zeigt eine sektion pro beispiel an", () => {
      render(<BeispielePage />, {
        preloadedState: INITIAL_STATE,
      });

      const ausgangslage = composeAusgangslageFuerPlaner(INITIAL_STATE);

      erstelleBeispiele(ausgangslage, staticElterngeldbezuege)
        .map((beispiel) => beispiel.titel)
        .forEach((text) => expect(screen.getByText(text)).toBeVisible());
    });

    it("zeigt eine weitere sektion zur eigenen planung an", () => {
      render(<BeispielePage />, {
        preloadedState: INITIAL_STATE,
      });

      expect(screen.getByText("Eigene Planung anlegen")).toBeVisible();
    });

    const staticElterngeldbezuege: BerechneElterngeldbezuegeCallback = (
      _,
      monate,
    ) => {
      const mockBetraege: Record<Auswahloption, number> = {
        [Variante.Basis]: 200,
        [Variante.Plus]: 100,
        [Variante.Bonus]: 50,
        [KeinElterngeld]: 0,
      };

      return Object.fromEntries(
        getRecordEntriesWithIntegerKeys(monate, isLebensmonatszahl)
          .filter(([_, monat]) => monat.gewaehlteOption !== undefined)
          .map(([lebensmonatszahl, monat]) => [
            lebensmonatszahl,
            mockBetraege[monat.gewaehlteOption!],
          ]),
      );
    };

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };
  });
}
