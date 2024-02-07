import Big from "big.js";

export interface ElternGeldSimulationErgebnisRow {
  vonLebensMonat: number;
  bisLebensMonat: number;
  basisElternGeld: Big;
  elternGeldPlus: Big;
  nettoEinkommen: Big;
}
