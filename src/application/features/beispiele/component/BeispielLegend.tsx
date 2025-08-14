import type { ReactNode } from "react";
import { BeispielVariantenplakette } from "./BeispielVariantenplakette";
import { BeispielVariante } from "@/application/features/beispiele/types";
import { KeinElterngeld, Variante } from "@/monatsplaner";

export function BeispielLegend(): ReactNode {
  const varianten: BeispielVariante[] = [
    Variante.Basis,
    Variante.Plus,
    KeinElterngeld,
  ];

  return (
    <ul className="flex flex-wrap gap-20">
      {varianten.map((variante, i) => (
        <li key={variante + i} className="flex items-center gap-10">
          <BeispielVariantenplakette
            variante={variante}
            className="h-[32px] w-[64px]"
          />
          <strong>{variante}</strong>
        </li>
      ))}
    </ul>
  );
}
