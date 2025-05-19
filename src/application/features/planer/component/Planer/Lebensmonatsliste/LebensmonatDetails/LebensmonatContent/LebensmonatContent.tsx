import { ReactNode } from "react";
import { AbschnittMitAuswahloptionen } from "./AbschnittMitAuswahloptionen";
import { AbschnittMitEinkommen } from "./AbschnittMitEinkommen";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat";
import { ZeitraumLabel } from "@/application/features/planer/component/common";
import {
  type GridColumnDefinition,
  useGridColumn,
  useGridLayout,
} from "@/application/features/planer/layout";
import { berechneZeitraumFuerLebensmonat } from "@/lebensmonatrechner";

export function LebensmonatContent(): ReactNode {
  const gridLayout = useGridLayout();
  const descriptionArea = useGridColumn(DESCRIPTION_COLUMN_DEFINITION);

  const { ausgangslage, lebensmonatszahl } = useInformationenZumLebensmonat();

  const zeitraum = berechneZeitraumFuerLebensmonat(
    ausgangslage.geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  return (
    <div
      className="pb-20 pt-8"
      style={gridLayout}
      data-testid="details-content"
    >
      <div className="mb-24 flex flex-col text-center" style={descriptionArea}>
        <span>{lebensmonatszahl}. Lebensmonat</span>
        <ZeitraumLabel zeitraum={zeitraum} prefix="Zeitraum" />
      </div>

      <AbschnittMitAuswahloptionen />
      <AbschnittMitEinkommen />
    </div>
  );
}

const DESCRIPTION_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-outside", "et2-outside"],
};
