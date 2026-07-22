import SuccessIcon from "~icons/material-symbols/check-circle-outline";
import InfoIcon from "~icons/material-symbols/info-outline";
import { useNavigate } from "react-router";
import { InfoTextGeschwisterbonus } from "./InfoTextGeschwisterbonus";
import { Button } from "@/application/features/components";
import { Page } from "@/application/features/components";
import { findeGeburtsdatum } from "@/application/features/abfrageteil/domain/findeGeburtsdatum";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { berechneEnddatumDesGeschwisterbonus } from "@/elterngeldrechner/Geschwisterbonus";
import { Geburtstag } from "@/elterngeldrechner";
import { posthog } from "@/application/user-tracking";
import { formatiereGeschwisterbonusErklaerung } from "./formatiereGeschwisterbonusErklaerung";

export function GeschwisterbonusUebersichtPage() {
  const { dispatch, filtereValideEventHistorie } = useEventContext();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterbonusUebersicht;

  const eventStream = filtereValideEventHistorie();
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatum = findeGeburtsdatum(eventStream);

  const nameFormatter = new Intl.ListFormat("de", {
    style: "long",
    type: "conjunction",
  });
  const geschwisterkinderNamen = nameFormatter.format(
    geschwisterkinder.map((geschwisterkind) => geschwisterkind.name),
  );

  const geschwisterbonusErgebnis = berechneEnddatumDesGeschwisterbonus(
    geschwisterkinder.map((it) => ({
      geburtstag: new Geburtstag(it.geburtsdatum.toString()),
      istBehindert: it.hatBehinderung,
    })),
    new Geburtstag(geburtsdatum.toString()),
  );

  const geschwisterbonusEnddatum = geschwisterbonusErgebnis?.datum ?? null;

  const ausschlaggebendeGeburtstage = new Set(
    geschwisterbonusErgebnis?.ausschlaggebendeGeschwister.map((kind) =>
      kind.geburtstag.getTime(),
    ),
  );

  const ausschlaggebendeGeschwisterkinder = geschwisterkinder.filter((it) =>
    ausschlaggebendeGeburtstage.has(
      new Geburtstag(it.geburtsdatum.toString()).getTime(),
    ),
  );

  const navigateNextPage = async () => {
    const event: FormEvent = {
      route: currentRoute,
    };

    dispatch(event);

    posthog.register({ geschwisterbonus: geschwisterbonusEnddatum !== null });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  return (
    <Page heading="Angaben zu Geschwistern">
      <div className="content-container">
        {geschwisterbonusEnddatum ? (
          <div className="rounded border-solid border-success">
            <div className="flex rounded bg-success-background p-20 font-bold">
              <SuccessIcon className="mr-10 mt-6 shrink-0 text-success" />

              <h3>Super, Sie können den Geschwisterbonus erhalten</h3>
            </div>

            <div className="p-20 pt-0">
              <p>
                Wir haben die Geburtsdaten von {geschwisterkinderNamen}{" "}
                überprüft. Die Angaben haben ergeben, dass die Voraussetzungen
                für den Geschwisterbonus erfüllt sind.
              </p>
              <p className="font-bold">Das bedeutet für Sie:</p>
              <ul>
                <li>
                  Ihr monatlicher Elterngeldbetrag erhöht sich automatisch um 10
                  % (mindestens um 75 Euro pro Monat).
                </li>
                <li>
                  Der Geschwisterbonus gilt für beide Eltern, wenn Sie in dieser
                  Zeit Elterngeld beziehen.
                </li>
                <li>
                  {formatiereGeschwisterbonusErklaerung(
                    ausschlaggebendeGeschwisterkinder,
                    geschwisterbonusEnddatum,
                  )}
                </li>
                <li>
                  Der Geschwisterbonus wird automatisch erfasst und später in
                  Ihrer Elterngeld-Planung angezeigt.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded border-solid border-info">
            <div className="flex rounded bg-info-background p-20 font-bold">
              <InfoIcon className="mr-10 mt-6 shrink-0 text-info" />

              <h3>Sie erhalten keinen Geschwisterbonus</h3>
            </div>

            <div className="p-20 pt-10">
              <ul>
                <li>
                  Ihre Angaben haben ergeben, dass die Altersgrenze für den
                  Geschwisterbonus überschritten ist.
                </li>
              </ul>
            </div>
          </div>
        )}

        <InfoTextGeschwisterbonus question="Was ist der Geschwisterbonus?" />

        <div className="button-group">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button
            type="button"
            buttonStyle="primary"
            onClick={navigateNextPage}
          >
            Verstanden und weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
