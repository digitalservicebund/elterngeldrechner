import { ElterngeldType } from "@/monatsplaner";

export interface PlanungsdatenFuerElternteil {
  name: string;
  lebensmonate: Lebensmonat[];
}

export type Variante = ElterngeldType;

export interface Lebensmonat {
  variante: Variante;
  isMutterschutzMonth: boolean;
  elterngeld: number;
  nettoEinkommen: number;
  verfuegbaresEinkommen: number;
}
