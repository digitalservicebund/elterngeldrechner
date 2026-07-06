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

export function GeschwisterbonusUebersichtPage() {
  const { dispatch, filtereValideEventHistorie } = useEventContext();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterbonusUebersicht;

  const eventStream = filtereValideEventHistorie();
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatum = findeGeburtsdatum(eventStream);

  const geschwisterbonusEnddatum = berechneEnddatumDesGeschwisterbonus(
    geschwisterkinder.map((it) => ({
      geburtstag: new Geburtstag(it.geburtsdatum.toString()),
      istBehindert: it.hatBehinderung,
    })),
    new Geburtstag(geburtsdatum.toString()),
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
              <SuccessIcon className="mr-10 mt-8 shrink-0 text-success" />

              <h3>Super, Sie können den Geschwisterbonus erhalten</h3>
            </div>

            <div className="p-20">
              <ul className="ml-32 mt-4 list-disc">
                <li>
                  Ihre Angaben haben ergeben, dass die Voraussetzungen für den
                  Geschwisterbonus erfüllt sind
                </li>
                <li>
                  Der Geschwisterbonus wird bis zum Erreichen der{" "}
                  <strong>
                    Altersgrenze am{" "}
                    {geschwisterbonusEnddatum.toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </strong>{" "}
                  gezahlt
                </li>
                <li>
                  Die Erhöhung wird im Planer direkt bei ihrem Elterngeld
                  berücksichtigt
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded border-solid border-info">
            <div className="flex rounded bg-info-background p-20 font-bold">
              <InfoIcon className="mr-10 mt-8 shrink-0 text-info" />

              <h3>Sie erhalten keinen Geschwisterbonus</h3>
            </div>

            <div className=" p-20">
              <ul className="ml-32 mt-4 list-disc">
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
