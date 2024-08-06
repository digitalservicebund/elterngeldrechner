import type { Elternteil } from "./Elternteil";
import type { InformationenZumMutterschutz } from "./InformationenZumMutterschutz";

export type Ausgangslage =
  | AusgangslageFuerEinElternteil
  | AusgangslageFuerZweiElternteile;

interface AusgangslageFuerEinElternteil
  extends BasisAusgangslage<Elternteil.Eins> {
  readonly anzahlElternteile: 1;
}

interface AusgangslageFuerZweiElternteile
  extends BasisAusgangslage<Elternteil.Eins | Elternteil.Zwei> {
  readonly anzahlElternteile: 2;
}

interface BasisAusgangslage<E extends Elternteil> {
  readonly anzahlElternteile: 1 | 2;
  readonly informationenZumMutterschutz?: InformationenZumMutterschutz<E>;
}

export type ElternteileByAusgangslage<A extends Ausgangslage> =
  A extends AusgangslageFuerEinElternteil
    ? Elternteil.Eins
    : A extends AusgangslageFuerZweiElternteile
      ? Elternteil.Eins | Elternteil.Zwei
      : never;
