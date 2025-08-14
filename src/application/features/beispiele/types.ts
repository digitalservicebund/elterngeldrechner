import { Auswahloption, KeinElterngeld, Variante } from "@/monatsplaner";

// Re-exporting them does not feel quite right also because they're
// listed explicitly in the type guard.

export type BeispielVariante = Exclude<Auswahloption, Variante.Bonus>;

export function isBeispielVariante(value: unknown): value is BeispielVariante {
  return (
    value == Variante.Basis || value == Variante.Plus || value == KeinElterngeld
  );
}
