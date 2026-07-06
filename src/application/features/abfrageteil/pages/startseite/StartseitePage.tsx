import { useNavigate } from "react-router";
import { Button } from "@/application/features/components";
import { Alert } from "@/application/features/components/Alert";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { Route, generateAbfrageteilPath } from "@/application/routing";

export function Startseite() {
  const { dispatch } = useEventContext();

  const navigate = useNavigate();

  const navigateNextPage = async () => {
    dispatch({ route: Route.Startseite });

    await navigate(generateAbfrageteilPath(Route.AllgemeineAngaben));
  };

  return (
    <Page
      id="startseite-page"
      heading="So nutzen Sie den Elterngeldrechner mit Planer"
    >
      <div className="content-container">
        <div className="text-container">
          <p className="font-bold">Voraussichtliche Höhe von Elterngeld</p>
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

          <p className="mt-32 font-bold">Monate aufteilen</p>
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

          <p className="mt-32 font-bold">
            Arbeiten während Sie Elterngeld bekommen
          </p>
          <ul className="list ml-32 list-disc pt-10">
            <li>
              Tragen Sie ein, ob Sie oder der andere Elternteil in Teilzeit
              arbeiten möchten.
            </li>
          </ul>

          <p className="mt-32 font-bold">Übersicht bekommen</p>
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

        <div className="button-group">
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
