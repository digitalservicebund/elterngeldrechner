import type { Elternteil } from "./Elternteil";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";

export type InformationenZumMutterschutz<Empfaenger extends Elternteil> = {
  readonly empfaenger: Empfaenger;
  readonly letzterLebensmonatMitSchutz: Lebensmonatszahl;
};
