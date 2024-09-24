import type { PseudonymeDerElternteile } from "@/features/planer/domain/pseudonyme-der-elternteile";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { InformationenZumMutterschutz } from "@/features/planer/domain/InformationenZumMutterschutz";

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
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly geburtsdatumDesKindes: Date;
  readonly informationenZumMutterschutz?: InformationenZumMutterschutz<E>;
  readonly hatBehindertesGeschwisterkind?: boolean;
  readonly sindMehrlinge?: boolean;
  readonly istAlleinerziehend?: boolean;
}

export type ElternteileByAusgangslage<A extends Ausgangslage> =
  A extends AusgangslageFuerEinElternteil
    ? Elternteil.Eins
    : A extends AusgangslageFuerZweiElternteile
      ? Elternteil.Eins | Elternteil.Zwei
      : never;
