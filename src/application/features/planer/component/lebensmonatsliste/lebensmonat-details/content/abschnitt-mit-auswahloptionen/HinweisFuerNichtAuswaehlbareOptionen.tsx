import InfoOutlinedIcon from "@digitalservicebund/icons/InfoOutlined";
import type { ReactNode } from "react";
import { InfoText } from "@/application/components";
import {
  type GridColumnDefinition,
  useGridColumn,
} from "@/application/features/planer/layout/grid-layout";

type Props = {
  readonly className?: string;
};

export function HinweisFuerNichtAuswaehlbareOptionen({
  className,
}: Props): ReactNode {
  const columns = useGridColumn(COLUMN_DEFINITION);

  return (
    <InfoText
      className={className}
      style={columns}
      question="Warum sind einige Auswahlmöglichkeiten grau?"
      answer={
        <p>
          Bitte öffnen Sie die Hilfe <InfoOutlinedIcon /> um den Grund zu sehen.
          Meist haben Sie schon die gesamte Menge Ihres Elterngelds in den
          Lebensmonaten verplant. Um Elterngeld hinzuzufügen, müssen Sie an
          anderer Stelle Elterngeld aus einem Lebensmonat wegnehmen.
        </p>
      }
    />
  );
}

const COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-middle", "et2-middle"],
};
