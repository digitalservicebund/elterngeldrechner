import { Visualisierung } from "./Visualisierung";
import { Geldbetrag } from "@/application/components";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
import { Ausgangslage, berechneGesamtsumme } from "@/monatsplaner";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
};

export function Beschreibung({ beispiel }: Props) {
  const gesamtbezug = berechneGesamtsumme(beispiel.plan).elterngeldbezug;

  // TODO: Implement white background for gesamtbezug if item is selected

  return (
    <>
      <p className="col-span-2 pt-16">
        Elterngeld Summe
        <span className="ml-10 rounded bg-primary-light px-10 py-2">
          <Geldbetrag betrag={gesamtbezug} />
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
