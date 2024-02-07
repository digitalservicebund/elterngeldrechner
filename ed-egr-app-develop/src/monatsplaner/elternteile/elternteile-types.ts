export type ElterngeldType = "BEG" | "EG+" | "PSB" | "None";
export type ElternteilType = "ET1" | "ET2";

export interface Geburtstag {
  readonly errechnet: string;
  readonly geburt: string;
}

export interface Month {
  readonly type: ElterngeldType;
  readonly isMutterschutzMonth: boolean;
}

export interface Elternteil {
  readonly months: readonly Month[];
}

export interface RemainingMonthByType {
  readonly basiselterngeld: number;
  readonly elterngeldplus: number;
  readonly partnerschaftsbonus: number;
}

export interface Elternteile {
  readonly remainingMonths: RemainingMonthByType;
  readonly ET1: Elternteil;
  readonly ET2: Elternteil;
}
