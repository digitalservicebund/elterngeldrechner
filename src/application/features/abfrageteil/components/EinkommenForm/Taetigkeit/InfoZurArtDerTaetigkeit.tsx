import type { ReactNode } from "react";
import { InfoText } from "@/application/components";

export function InfoZurArtDerTaetigkeit(): ReactNode {
  return (
    <InfoText
      question="Was ist Art der Tätigkeit?"
      answer="Einkünfte aus nichtselbständiger Arbeit: z.B. Lohn Gehalt (auch aus einem Minijob) oder Gewinneinkünfte: Einkünfte aus einem Gewerbebetrieb (auch z.B. aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch z.B. aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft"
    />
  );
}
