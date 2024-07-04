import { ElterngeldType } from "@/monatsplaner";

export type { ElternteilType, Month } from "@/monatsplaner";

export interface PlanungsdatenFuerElternteil {
  name: string;
  totalNumberOfMonths: number;
  geldInsgesamt: number;
  zeitraeueme: Zeitraum[];
  details: VariantenDetails;
  lebensmonate: Lebensmonat[];
}

export type Variante = Exclude<ElterngeldType, "None">;
export type VariantenDetails = Record<Variante, DetailsOfVariante>;

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
  type: ElterngeldType;
  isMutterschutzMonth: boolean;
  elterngeld: number;
  nettoEinkommen: number;
  verfuegbaresEinkommen: number;
}
