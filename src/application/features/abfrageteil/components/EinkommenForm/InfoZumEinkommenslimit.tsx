import type { ReactNode } from "react";
import { InfoText } from "@/application/components";
import { MAX_EINKOMMEN } from "@/elterngeldrechner";

export function InfoZumEinkommenslimit(): ReactNode {
  return (
    <InfoText
      question="Was bedeutet Gesamteinkommen"
      answer={
        <p>
          Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld
          bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden
          Jahreseinkommen von mehr als {MAX_EINKOMMEN.toLocaleString()} Euro bei
          Alleinerziehenden, Paaren und getrennt Erziehenden.
          <br />
          Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid.
          <br />
          Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes
          Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das
          Einkommen beider Elternteile zusammen.
        </p>
      }
    />
  );
}
