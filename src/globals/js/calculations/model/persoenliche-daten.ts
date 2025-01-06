import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";
import { YesNo } from "./yes-no";

export type PersoenlicheDaten = {
  readonly wahrscheinlichesGeburtsDatum: Date;
  readonly anzahlKuenftigerKinder: number;
  /* TODO: readonly */ etVorGeburt: ErwerbsArt;
  /* TODO: readonly */ etNachGeburt: YesNo;
  readonly geschwister: Kind[];
};
