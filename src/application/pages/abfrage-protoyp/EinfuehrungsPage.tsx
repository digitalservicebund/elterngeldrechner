import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";

export function EinfuehrungsPage() {
  const navigate = useNavigate();

  return (
    <Page step={formSteps.einfuehrung}>
      <div className="mt-40 flex flex-col gap-40">
        <Alert headline="Hinweis">
          <span>
            Die Ergebnisse des Elterngeldrechners sind unverbindlich. Ihre
            zuständige Elterngeldstelle entscheidet nach Ihrem Antrag über die
            exakte Höhe Ihres Elterngeldes. Den Antrag stellen Sie nach der
            Geburt Ihres Kindes.
          </span>
        </Alert>
        <div>
          <h5>Voraussichtliche Höhe von Elterngeld</h5>
          <ul className="list list-disc pt-10">
            <li className="ml-32">
              Der Rechner gibt einen Überblick, wie viel Elterngeld Sie
              voraussichtlich bekommen.
            </li>
          </ul>

          <h5 className="mt-32">Monate aufteilen</h5>
          <ul className="list list-disc pt-10">
            <li className="ml-32">
              Sie können die Monate für sich und den anderen Elternteil nach
              Wunsch aufteilen
            </li>
            <li className="ml-32">
              Der Planer überprüft ob Ihre Planung korrekt und gültig ist.
            </li>
          </ul>

          <h5 className="mt-32">Arbeiten während Sie Elterngeld bekommen</h5>
          <ul className="list list-disc pt-10">
            <li className="ml-32">
              Tragen Sie ein, ob Sie oder der andere Elternteil arbeiten
              möchten.
            </li>
          </ul>

          <h5 className="mt-32">Übersicht bekommen</h5>
          <ul className="list list-disc pt-10">
            <li className="ml-32">
              Ergänzen Sie neben dem Elterngeld auch Ihr Einkommen, um eine
              Gesamtübersicht Ihrer Finanzen während der Elternzeit zu erhalten.
            </li>
            <li className="ml-32">
              Übertragen Sie die Planung in den PDF-Antrag auf Elterngeld.
            </li>
          </ul>
        </div>

        <div className="mt-40">
          <Button
            type="submit"
            onClick={() => navigate(formSteps.familie.route)}
          >
            Verstanden und Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
