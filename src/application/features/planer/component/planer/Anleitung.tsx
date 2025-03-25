import { type ReactNode, useId } from "react";
import { Button } from "@/application/components";
import { Legende } from "@/application/features/planer/component/common";

type Props = {
  readonly onOpenErklaerung: () => void;
};

export function Anleitung({ onOpenErklaerung }: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier}>
      <h4 id={headingIdentifier} className="sr-only">
        Anleitung
      </h4>

      <p>
        Die ersten Schritte sind geschafft! Jetzt berechnen wir Ihr Elterngeld
        und zeigen Ihnen die nächsten Möglichkeiten.
      </p>

      <ul className="mb-16 list-disc pl-24">
        <li>
          Entscheiden Sie, in welchen Lebensmonaten Sie Elterngeld bekommen
          möchten
        </li>
        <li>Verteilen Sie das Elterngeld für sich</li>
        <li>Der Planer zeigt, wie Elterngeld aufgeteilt werden kann</li>
        <li>
          Geben Sie optional zusätzliches Einkommen an, um eine genauere
          Berechnung zu erhalten
        </li>
      </ul>

      <p>Dieses Elterngeld gibt es:</p>
      <Legende showBasis showPlus showBonus>
        <Button
          buttonStyle="link"
          label="Hier finden Sie weitere Informationen"
          onClick={onOpenErklaerung}
          className="text-left !text-base"
        />
      </Legende>
    </section>
  );
}
