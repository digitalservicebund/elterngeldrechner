import type { Geburtstag } from "./Geburtstag";
import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";

// TODO: mark fully readonly
export type PersoenlicheDaten = {
  readonly geburtstagDesKindes: Geburtstag;
  readonly anzahlKuenftigerKinder: number;
  etVorGeburt: ErwerbsArt;
  hasEtNachGeburt?: boolean;
  readonly geschwister?: Kind[];
};
