import type { Elternteil } from "./Elternteil";
import type { InformationenZumMutterschutz } from "./InformationenZumMutterschutz";

export type Ausgangslage =
  | AusgangslageFuerEinElternteil
  | AusgangslageFuerZweiElternteile;

export interface AusgangslageFuerEinElternteil
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
  readonly hatBehindertesGeschwisterkind?: boolean;
  readonly sindMehrlinge?: boolean;
}

export type ElternteileByAusgangslage<A extends Ausgangslage> =
  A extends AusgangslageFuerEinElternteil
    ? Elternteil.Eins
    : A extends AusgangslageFuerZweiElternteile
      ? Elternteil.Eins | Elternteil.Zwei
      : never;
