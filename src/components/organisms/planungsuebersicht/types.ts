import { ElterngeldType } from "@/monatsplaner";

export interface PlanungsdatenFuerElternteil {
  name: string;
  totalNumberOfMonths: number;
  geldInsgesamt: number;
  zeitraeueme: Zeitraum[];
  details: VariantenDetails;
  lebensmonate: Lebensmonat[];
}

export type Variante = ElterngeldType;
export type VariantenDetails = Record<
  Exclude<Variante, "None">,
  DetailsOfVariante
>;

export interface DetailsOfVariante {
  numberOfMonths: number;
  elterngeld: number;
  nettoEinkommen: number;
}

export interface Zeitraum {
  from: Date;
  to: Date;
}

export interface Lebensmonat {
  variante: Variante;
  isMutterschutzMonth: boolean;
  elterngeld: number;
  nettoEinkommen: number;
  verfuegbaresEinkommen: number;
}
