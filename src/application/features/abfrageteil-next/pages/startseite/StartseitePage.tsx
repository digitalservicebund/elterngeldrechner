import { useNavigate } from "react-router";
import { Button } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  Route,
  generateAbfrageteilPath,
} from "@/application/features/abfrageteil-next/routing";

export function Startseite() {
  const { dispatch } = useEventContext();

  const navigate = useNavigate();

  const navigateNextPage = () => {
    dispatch({ route: Route.Startseite });

    void navigate(generateAbfrageteilPath(Route.AllgemeineAngaben));
  };

  return (
    <Page
      id="startseite-page"
      heading="So nutzen Sie den Elterngeldrechner mit Planer"
    >
      <div className="mt-40 flex flex-col gap-40">
        <div>
          <h5>Voraussichtliche Höhe von Elterngeld</h5>
          <ul className="list ml-32 list-disc pt-10">
            <li>
              Der Rechner gibt einen Überblick, wie viel Elterngeld Sie
              voraussichtlich bekommen.
            </li>
            <li>
              Je genauer Ihre Angaben sind, desto besser kann der Rechner das
              Elterngeld für Sie ausrechnen.
            </li>
          </ul>

          <h5 className="mt-32">Monate aufteilen</h5>
          <ul className="list ml-32 list-disc pt-10">
            <li>
              Sie können die Monate für sich und den anderen Elternteil nach
              Wunsch aufteilen.
            </li>
            <li>
              Der Planer überprüft, ob Ihre gewünschte Aufteilung korrekt und
              gültig ist.
            </li>
          </ul>

          <h5 className="mt-32">Arbeiten während Sie Elterngeld bekommen</h5>
          <ul className="list ml-32 list-disc pt-10">
            <li>
              Tragen Sie ein, ob Sie oder der andere Elternteil in Teilzeit
              arbeiten möchten.
            </li>
          </ul>

          <h5 className="mt-32">Übersicht bekommen</h5>
          <ul className="list ml-32 list-disc pt-10">
            <li>
              Ergänzen Sie neben dem Elterngeld auch Ihr Einkommen, um einen
              vollständigen Überblick über Ihre Finanzen während des
              Elterngeldbezugs zu erhalten.
            </li>
            <li>
              In einigen Bundesländern lässt sich die Planung direkt in den
              Papierantrag übertragen.
            </li>
          </ul>
        </div>

        <Alert headline="Hinweis">
          <span>
            Das Ergebnis ist nur eine Orientierung. Es ist rechtlich nicht
            verbindlich. Der tatsächliche Betrag kann abweichen. Den genauen
            Betrag erfahren Sie nach der Prüfung durch die Elterngeldstelle.
          </span>
        </Alert>

        <div className="mt-40">
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
