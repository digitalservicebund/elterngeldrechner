import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";
import { YesNo } from "./yes-no";

// TODO: mark fully readonly
export type PersoenlicheDaten = {
  readonly wahrscheinlichesGeburtsDatum: Date;
  readonly anzahlKuenftigerKinder: number;
  etVorGeburt: ErwerbsArt;
  etNachGeburt: YesNo;
  readonly geschwister: Kind[];
};
