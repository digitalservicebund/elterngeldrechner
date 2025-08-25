import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { trackMetricsForEinBeispielWurdeAusgewaehlt } from "./tracking";
import { Button } from "@/application/components";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import { BeispielAuswahlbox } from "@/application/features/beispiele/component/BeispielAuswahlbox";
import { BeispielAuswahlboxBody } from "@/application/features/beispiele/component/BeispielAuswahlboxBody";
import { BeispielAuswahloptionLegende } from "@/application/features/beispiele/component/BeispielAuswahloptionLegende";
import {
  Beispiel,
  erstelleBeispiele,
} from "@/application/features/beispiele/hooks/erstelleBeispiele";
import { Page } from "@/application/pages/Page";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateWithPlan } from "@/application/pages/planungsteil/useNavigateWithPlan";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { Ausgangslage, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

export function BeispielePage() {
  // TODO: Implement keyboard navigation and test accessibility tree
  // TODO: Implement active option after navigating back from planer

  const store = useAppStore();
  const navigate = useNavigate();

  const { navigateWithPlanState } = useNavigateWithPlan();
  const { berechneElterngeldbezuegeByPlan } = useBerechneElterngeldbezuege();

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
    () => erstelleBeispiele(ausgangslage),
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
        <BeispielAuswahloptionLegende beispiele={beispiele} />

        <div
          className="grid grid-cols-1 gap-26 md:grid-cols-2"
          role="radiogroup"
          aria-label="Beispielauswahl"
        >
          {beispiele.map((beispiel) => (
            <BeispielAuswahlbox
              titel={beispiel.titel}
              key={beispiel.identifier}
              beschreibung={beispiel.beschreibung}
              checked={aktivesBeispiel === beispiel.identifier}
              onChange={() => handleBeispielChange(beispiel.identifier)}
            >
              <BeispielAuswahlboxBody
                beispiel={beispiel}
                berechneElterngeldbezuege={berechneElterngeldbezuegeByPlan}
              />
            </BeispielAuswahlbox>
          ))}

          <BeispielAuswahlbox
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
