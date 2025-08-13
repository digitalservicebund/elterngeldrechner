import type { ReactNode } from "react";
import {
  BeispielVariante,
  BeispielVariantenplakette,
} from "./BeispielVariantenplakette";
import { Variante } from "@/monatsplaner";

export function BeispielLegend(): ReactNode {
  const varianten: BeispielVariante[] = [
    Variante.Basis,
    Variante.Plus,
    "Kein Elterngeld",
  ];

  return (
    <ul className="flex gap-20">
      {varianten.map((variante, i) => (
        <li key={variante + i} className="flex items-center gap-10">
          <BeispielVariantenplakette variante={variante} />
          <strong>{variante}</strong>
        </li>
      ))}
    </ul>
  );
}
