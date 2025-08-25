import { Visualisierung } from "./Visualisierung";
import { Geldbetrag } from "@/application/components";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import {
  Ausgangslage,
  BerechneElterngeldbezuegeByPlanCallback,
  isLebensmonatszahl,
} from "@/monatsplaner";
import { getRecordEntriesWithIntegerKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeByPlanCallback<Ausgangslage>;
};

export function Beschreibung({ beispiel, berechneElterngeldbezuege }: Props) {
  const gesamtbezuege = getRecordEntriesWithIntegerKeys(
    berechneElterngeldbezuege(beispiel.plan),
    isLebensmonatszahl,
  ).reduce((acc, [_, value]) => acc + (value ?? 0), 0);

  return (
    <>
      <p className="col-span-2 pt-16">
        Elterngeld Summe
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          <Geldbetrag betrag={gesamtbezuege} />
        </span>
      </p>

      <p className="col-span-2 pt-16">
        Elterngeld bis
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          13. Lebensmonat
        </span>
      </p>

      <Visualisierung beispiel={beispiel} className="col-span-2 mt-auto" />
    </>
  );
}
