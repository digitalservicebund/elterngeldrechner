import type { ReactNode } from "react";

export function InfoZumEinkommen(): ReactNode {
  return (
    <>
      <p>
        Wenn Sie Elterngeld bekommen, dürfen Sie zusätzlich bis zu 32 Stunden
        pro Woche arbeiten – unabhängig von der Elterngeldvariante.
        <br />
        Beachten Sie folgendes:
      </p>

      <ul className="ml-16 list-inside list-disc">
        <li>Ihr Einkommen beeinflusst die Höhe Ihres Elterngeldes</li>
        <li>
          Von dem Bruttoeinkommen, dass Sie eingeben werden in pauschaler Form
          Steuern und Sozialabgaben abgezogen
        </li>
      </ul>

      <p>
        Als Ergebnis erhält man das Elterngeld-Netto. Davon werden maximal 2.770
        Euro berücksichtigt.
        <br />
        Bitte beachten Sie: Wir berechnen Ihnen nur Ihr ungefähres
        Nettoeinkommen.
      </p>
    </>
  );
}
