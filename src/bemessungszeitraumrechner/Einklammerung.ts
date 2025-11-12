export type Einklammerung = {
  von: Date;
  bis: Date;
  beschreibung?: string;
  monate?: {
    monatsIndex: number;
    monatsName: string;
  }[];
};
