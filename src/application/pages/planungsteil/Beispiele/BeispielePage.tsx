import { useEffect, useMemo, useState } from "react";
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
import { findePassendesBeispiel } from "@/application/features/beispiele/operations/findePassendesBeispiel";
import { Page } from "@/application/pages/Page";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateWithPlan } from "@/application/pages/planungsteil/useNavigateWithPlan";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { Ausgangslage, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

export function BeispielePage() {
  // TODO: Implement keyboard navigation and test accessibility tree

  // TODO: Implement page test for state handling and navigation
  // TODO: Seite zeigt eine Kachel pro Beispiel
  // TODO: Seite selektiert vorher Beispiel nach Plan
  // TODO: Eigene Planung setzte den Plan auf leer wenn nur beispiel
  // TODO: Eigene Planung setzt den Plan auf eigene planung wnen initial Plan

  // TODO: Align features (abrageteil, ...) with pages (abfrageteil, planungsteil)
  // TODO: Add architecture decision record about split in planungsteil, abfrageteil (to be removed after refactoring)
  // TODO: Add readme with hint to source of infoirmation (git hygiene, adr, readme in packages, comments)
  // TODO: What to do with new utiltities package? How to share type safe records? adr? new package? keep duplicated?
  // TODO: Adr about typical structure of features (hooks, components, functions to calculate stuff)

  const store = useAppStore();
  const navigate = useNavigate();

  const { navigateWithPlanState, plan: initialerPlan } = useNavigateWithPlan();

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
    if (initialerPlan) {
      const passendesBeispiel = findePassendesBeispiel(
        initialerPlan,
        berechneElterngeldbezuege,
      );

      if (passendesBeispiel) {
        setPlan(passendesBeispiel.plan);
        setAktivesBeispiel(passendesBeispiel.identifier);
      } else {
        setPlan(initialerPlan);
        setAktivesBeispiel(EigenePlanung);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const leererPlan = {
        ausgangslage: ausgangslage,
        lebensmonate: {},
      };

      setPlan(initialerPlan || leererPlan);
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
