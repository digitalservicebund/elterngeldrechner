import { DetailsElterngeldvariante } from "./DetailsElterngeldvariante";
import { ReactNode } from "react";
import { Spinner } from "../../atoms";
import { usePayoutAmounts } from "./usePayoutAmounts";
import { PayoutAmountsForParent, PayoutAmoutForVariant } from "./types";

export function ElterngeldvariantenDescriptions(): ReactNode {
  const payoutAmounts = usePayoutAmounts();

  if (payoutAmounts === undefined) {
    return <Spinner />;
  } else {
    return (
      <>
        <DetailsElterngeldvariante
          summaryTitle="Basiselterngeld - 100% Elterngeld"
          summaryClassName="bg-Basis text-white"
          monthsAvailable={14}
          payoutAmounts={pickAmountsOfVariant(payoutAmounts, "basiselterngeld")}
        >
          <ul className="list-disc">
            <li>
              Mit dem Basiselterngeld können Sie insgesamt bis zu 12 Monate
              Elternzeit nehmen
            </li>
            <li>
              Wenn beide Eltern Elterngeld beantragen und mindestens ein
              Elternteil nach der Geburt weniger Einkommen hat, können Sie
              zusätzlich 2 Partnermonate bekommen. Das bedeutet, dass Sie bis zu
              14 Monate Elterngeld erhalten können
            </li>
            <li>
              Auch Alleinerziehende haben Anspruch auf die Partnermonate, wenn
              sie Elterngeld beantragen
            </li>
            <li>
              Zum Beispiel können Sie 7 Monate Basiselterngeld für sich und 7
              Monate Basiselterngeld für den anderen Elternteil beantragen oder
              14 Monate Basiselterngeld, wenn Sie alleinerziehend sind
            </li>
          </ul>
        </DetailsElterngeldvariante>
        <DetailsElterngeldvariante
          summaryTitle="ElterngeldPlus - 50% Elterngeld"
          summaryClassName="bg-Plus text-black"
          monthsAvailable={28}
          payoutAmounts={pickAmountsOfVariant(payoutAmounts, "elterngeldplus")}
        >
          <ul className="list-disc">
            <li>
              Statt eines Lebensmonats Basiselterngeld 2 Lebensmonate
              ElterngeldPlus
            </li>
            <li>Halb so hoch wie Basiselterngeld</li>
            <li>
              Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit
              arbeiten
            </li>
            <li>
              Auch nach dem 14. Lebensmonat, ab dann darf der Elterngeldbezug
              jedoch nicht mehr unterbrochen werden
            </li>
          </ul>
        </DetailsElterngeldvariante>
        <DetailsElterngeldvariante
          summaryTitle="+ Partnerschaftsbonus"
          summaryClassName="bg-Bonus text-black"
          monthsAvailable={4}
          payoutAmounts={pickAmountsOfVariant(
            payoutAmounts,
            "partnerschaftsbonus",
          )}
        >
          <ul className="list-disc">
            <li>
              zusätzliche Lebensmonate Elterngeld-Plus, die direkt aufeinander
              folgen
            </li>
            <li>Die Eltern nutzen den Partnerschaftsbonus gleichzeitig</li>
            <li>
              Beide arbeiten in dieser Zeit in Teilzeit, also mindestens 24 und
              höchstens 32 Stunden pro Woche
            </li>
            <li>
              Alleinerziehende können den Partnerschaftsbonus auch allein
              nutzen, wenn sie 24 bis 32 Stunden pro Woche arbeiten
            </li>
          </ul>
        </DetailsElterngeldvariante>
      </>
    );
  }
}

function pickAmountsOfVariant(
  payoutAmounts: PayoutAmountsForParent[],
  variant: "basiselterngeld" | "elterngeldplus" | "partnerschaftsbonus",
): PayoutAmoutForVariant[] {
  return payoutAmounts.map((entry) => ({
    name: entry.name,
    amount: entry[variant],
  }));
}
