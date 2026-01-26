import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";

export function Startseite() {
  const navigate = useNavigate();

  const navigateNextPage = () => {
    void navigate("/abfrageteil-v2/allgemeine-angaben");
  };

  return (
    <>
      <h2>So nutzen Sie den Elterngeldrechner mit Planer</h2>

      <h3>Voraussichtliche Höhe des Elterngeld</h3>
      <ul>
        <li>
          Der Rechner gibt einen Überblick, wie viel Elterngeld Sie
          voraussichtlich bekommen.
        </li>
      </ul>

      <h3>Monate aufteilen</h3>
      <ul>
        <li>
          Sie können die Monate für sich und den anderen Elternteil nach Wunsch
          aufteilen
        </li>

        <li>Der Planer überprüft ob Ihre Planung korrekt und gültig ist.</li>
      </ul>

      <h3>Arbeit während Sie Elterngeld bekommen</h3>
      <ul>
        Tragen Sie ein, ob Sie oder der andere Elternteil arbeiten möchten.
      </ul>

      <h3>Übersicht bekommen</h3>
      <ul>
        <li>
          Ergänzen Sie neben dem Elterngeld auch Ihr Einkommen, um eine
          Gesamtübersicht Ihrer Finanzen während der Elternzeit zu erhalten.
        </li>

        <li>Übertragen Sie die Planung in den PDF-Antrag auf Elterngeld.</li>
      </ul>

      <Button type="button" buttonStyle="primary" onClick={navigateNextPage}>
        Verstanden und weiter
      </Button>
    </>
  );
}
