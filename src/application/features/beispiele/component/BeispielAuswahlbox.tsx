import { ReactNode } from "react";
import { BeispielVisualisierung } from "./BeispielVisualisierung";
import { Geldbetrag } from "@/application/components";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import { Ausgangslage, isLebensmonatszahl } from "@/monatsplaner";
import { BerechneElterngeldbezuegeByPlanCallback } from "@/monatsplaner/Elterngeldbezug";
import { getRecordEntriesWithIntegerKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeByPlanCallback<Ausgangslage>;
  readonly className?: string;
};

export function BeispielAuswahlbox({
  beispiel,
  berechneElterngeldbezuege,
}: Props): ReactNode {
  // Change to proper radio buttons with active states
  // Implement aria support for title and description

  const gesamtbezuege = getRecordEntriesWithIntegerKeys(
    berechneElterngeldbezuege(beispiel.plan),
    isLebensmonatszahl,
  ).reduce((acc, [_, value]) => acc + (value ?? 0), 0);

  return (
    <div className="flex flex-col rounded bg-off-white p-24">
      <h4 className="break-words">{beispiel.titel}</h4>
      <p className="break-words">{beispiel.beschreibung}</p>

      <div className="mt-16 h-[1px] w-full bg-grey" />

      <p className="pt-16">
        Elterngeld Summe
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          <Geldbetrag betrag={gesamtbezuege} />
        </span>
      </p>

      <p className="pt-16">
        Elterngeld bis
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          13. Lebensmonat
        </span>
      </p>

      <BeispielVisualisierung beispiel={beispiel} className="mt-auto" />
    </div>
  );
}
