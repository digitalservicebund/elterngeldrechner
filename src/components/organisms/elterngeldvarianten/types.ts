export interface PayoutAmounts {
  ET1: number;
  ET2: number;
}

export interface PayoutAmountsForAllVariants {
  basiselterngeld: PayoutAmounts;
  elterngeldplus: PayoutAmounts;
  partnerschaftsbonus: PayoutAmounts;
}
