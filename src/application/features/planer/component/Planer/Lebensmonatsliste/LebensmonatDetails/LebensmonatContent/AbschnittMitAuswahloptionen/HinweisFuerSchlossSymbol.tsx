import type { ReactNode } from "react";
import { InfoText } from "@/application/components";
import {
  type GridColumnDefinition,
  useGridColumn,
} from "@/application/features/planer/layout";

type Props = {
  readonly className?: string;
};

export function HinweisFuerSchlossSymbol({ className }: Props): ReactNode {
  const columns = useGridColumn(COLUMN_DEFINITION);

  return (
    <InfoText
      className={className}
      style={columns}
      question="Warum ist ein Schloss Symbol vor Basis?"
      answer={
        <>
          <p>
            Sie haben angegeben, dass Sie Mutterschaftsleistungen beziehen. Die
            Monate des Mutterschutzes (in der Regel 8 Wochen nach Geburt) gelten
            als Monate mit Basiselterngeld und sind daher geblockt.
          </p>
          <ul className="ml-32 list-disc">
            <li>
              Die Mutterschaftsleistungen (von der Krankenkasse und vom
              Arbeitgeber) sind in der Regel so hoch, dass sie Ihr bisheriges
              Netto-Gehalt fast vollständig ersetzen. Das Elterngeld ersetzt
              dagegen nur rund 65% dieses Einkommens.
            </li>
            <li>
              Da die Mutterschaftsleistungen höher sind, wird für diese Monate
              kein Elterngeld gezahlt.
            </li>
            <li>Arbeiten ist während dieser Zeit nicht erlaubt.</li>
          </ul>
        </>
      }
    />
  );
}

const COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-outside", "et2-outside"],
};
