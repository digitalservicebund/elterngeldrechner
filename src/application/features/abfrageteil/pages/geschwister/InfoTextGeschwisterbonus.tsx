import type { ReactNode } from "react";
import { InfoText } from "@/application/features/components";

type Props = {
  readonly question: string;
};

export function InfoTextGeschwisterbonus({ question }: Props): ReactNode {
  return (
    <InfoText
      question={question}
      answer={
        <>
          <p>
            Wenn schon ein oder mehrere ältere Kinder in Ihrem Haushalt leben,
            können Sie mehr Geld bekommen. Das nennt man Geschwisterbonus.
          </p>
          <p className="mb-0">
            Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt
          </p>
          <ul>
            <li>
              mindestens <strong>ein weiteres Kind unter 3 Jahren</strong> lebt
              oder
            </li>
            <li>
              mindestens <strong>2 weitere Kinder unter 6 Jahren</strong> leben
              oder
            </li>
            <li>
              mindestens{" "}
              <strong>ein weiteres Kind mit Behinderung unter 14 Jahren</strong>{" "}
              lebt.
            </li>
          </ul>

          <p className="mt-20 font-bold">Wie viel Geld ist das?</p>
          <ul>
            <li>Ihr Elterngeld wird um 10 Prozent erhöht.</li>
            <li>Sie bekommen aber mindestens:</li>
          </ul>
          <ul className="pl-32">
            <li>75 € mehr im Monat beim Basis-Elterngeld</li>
            <li>37,50 € mehr im Monat beim ElterngeldPlus</li>
            <li>
              Sie bekommen den Geschwisterbonus, bis das ältere Kind die
              Alters-Grenze erreicht hat.
            </li>
          </ul>

          <p className="mt-20 font-bold">Haushaltszugehörigkeit:</p>
          <p>
            Damit der Partner oder die Partnerin Elterngeld beziehen kann, muss
            das Kind im gemeinsamen Haushalt angemeldet sein. In der
            Patchwork-Familie zählen hierzu auch die leiblichen Kinder des
            Partners/der Partnerin, sofern diese mit im gemeinsamen Haushalt
            leben.
          </p>

          <p className="mb-0 mt-20 font-bold">Besonderheit bei Adoption:</p>
          <p>
            Bei Adoptiv-Kindern zählt nicht der Geburtstag, sondern der Tag, an
            dem das Kind bei Ihnen eingezogen ist. Ab diesem Tag gilt das Kind
            für die nächsten 3 Jahre als „unter 3“ (bzw. für 6 Jahre als „unter
            6“), solange es bei Einzug noch keine 14 Jahre alt war.
          </p>
        </>
      }
    />
  );
}
