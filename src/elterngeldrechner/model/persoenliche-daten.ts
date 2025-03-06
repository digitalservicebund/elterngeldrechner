import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";

// TODO: mark fully readonly
export type PersoenlicheDaten = {
  readonly wahrscheinlichesGeburtsDatum: Date;
  readonly anzahlKuenftigerKinder: number;
  etVorGeburt: ErwerbsArt;
  hasEtNachGeburt?: boolean;
  readonly geschwister?: Kind[];
};
