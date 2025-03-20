import { type ReactNode, useId } from "react";
import { Variantenplakette } from "./Variantenplakette";
import { Button } from "@/application/components";
import { Variante } from "@/monatsplaner";

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

      <ul className="mb-16 list-inside list-disc">
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
      <div className="rounded bg-off-white p-16">
        <ul className="mb-16 flex flex-wrap gap-x-32 gap-y-16">
          <li className="flex items-center gap-8">
            <span>
              <Variantenplakette variante={Variante.Basis} />
            </span>
            <span className="whitespace-nowrap">= {Variante.Basis}</span>
          </li>

          <li className="flex items-center gap-8">
            <Variantenplakette variante={Variante.Plus} />
            <span className="whitespace-nowrap">= {Variante.Plus}</span>
          </li>

          <li className="flex items-center gap-8">
            <Variantenplakette variante={Variante.Bonus} />
            <span className="whitespace-nowrap">= {Variante.Bonus}</span>
          </li>
        </ul>

        <Button
          buttonStyle="link"
          label="Weitere Informationen wie Elterngeld funktioniert"
          onClick={onOpenErklaerung}
        />
      </div>
    </section>
  );
}
