import type { PseudonymeDerElternteile } from "@/features/planer/domain/PseudonymeDerElternteile";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { InformationenZumMutterschutz } from "@/features/planer/domain/InformationenZumMutterschutz";

export type Ausgangslage =
  | AusgangslageFuerEinElternteil
  | AusgangslageFuerZweiElternteile;

export type AusgangslageFuerEinElternteil = BasisAusgangslage<Elternteil.Eins>;

type AusgangslageFuerZweiElternteile = BasisAusgangslage<
  Elternteil.Eins | Elternteil.Zwei
>;

type BasisAusgangslage<E extends Elternteil> = {
  readonly anzahlElternteile: [E] extends [Elternteil.Eins] ? 1 : 2;
  readonly geburtsdatumDesKindes: Date;
  readonly informationenZumMutterschutz?: InformationenZumMutterschutz<E>;
  readonly hatBehindertesGeschwisterkind?: boolean;
  readonly sindMehrlinge?: boolean;
  readonly istAlleinerziehend?: [E] extends [Elternteil.Eins] ? boolean : false;
} & ([E] extends [Elternteil.Eins]
  ? { pseudonymeDerElternteile?: PseudonymeDerElternteile<E> }
  : { pseudonymeDerElternteile: PseudonymeDerElternteile<E> });

export type ElternteileByAusgangslage<A extends Ausgangslage> =
  A extends AusgangslageFuerEinElternteil
    ? Elternteil.Eins
    : A extends AusgangslageFuerZweiElternteile
      ? Elternteil.Eins | Elternteil.Zwei
      : never;
