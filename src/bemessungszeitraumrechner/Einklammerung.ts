export type Einklammerung = {
  von: Date;
  bis: Date;
  monate: Monatseintrag[];
};

export type Monatseintrag = {
  monatsIndex: number;
  monatsDatum: Date;
};
