import { ReactNode } from "react";
import { BeispielVisualisierung } from "./BeispielVisualisierung";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import { Ausgangslage } from "@/monatsplaner";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly className?: string;
};

export function BeispielAuswahlbox({ beispiel }: Props): ReactNode {
  // Change to proper radio buttons with active states
  // Implement aria support for title and description

  return (
    <div className="flex w-[360px] flex-col rounded bg-off-white p-24">
      <h4 className="break-words">{beispiel.titel}</h4>
      <p className="break-words">{beispiel.beschreibung}</p>

      <div className="mt-16 h-[1px] w-full bg-grey" />

      <p className="pt-16">
        Elterngeld Summe
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          xx.xxx$
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
