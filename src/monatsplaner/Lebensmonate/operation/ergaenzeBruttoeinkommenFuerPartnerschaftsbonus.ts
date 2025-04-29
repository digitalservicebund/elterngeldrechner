import { listeLebensmonateAuf } from "./listeLebensmonateAuf";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Einkommen } from "@/monatsplaner/Einkommen";
import { type Elternteil, isElternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonat } from "@/monatsplaner/Lebensmonat";
import { type Lebensmonate } from "@/monatsplaner/Lebensmonate";
import {
  type Lebensmonatszahl,
  isLebensmonatszahl,
} from "@/monatsplaner/Lebensmonatszahl";
import {
  type Monat,
  MonatHatBonusGewaehlt,
  MonatHatBruttoeinkommen,
  gebeEinkommenAn,
} from "@/monatsplaner/Monat";
import {
  mapRecordEntriesWithIntegerKeys,
  mapRecordEntriesWithStringKeys,
} from "@/monatsplaner/common/type-safe-records";

/**
 * Some automation utility operation. Probably useful to always incorporate with
 * other operations that allow to change a plan.
 *
 * The context is that Partnerschaftsbonus must have some income (read:
 * Bruttoeinkommen) for a valid plan. I can be tedious to fill out the
 * Bruttoeinkommen for each Monat separately. Under the assumption that the
 * income will probably not vary often between the consecutive Lebensmonate with
 * Partnerschaftsbonus, they get filled automatically once the first
 * Bruttoeinkommen was defined for any of these months. However, this still
 * allows to customize the Bruttoeinkommen just as before.
 */
export function ergaenzeBruttoeinkommenFuerPartnerschaftsbonus<
  E extends Elternteil,
>(lebensmonate: Lebensmonate<E>): Lebensmonate<E> {
  return mapLebensmonate(lebensmonate, (lebensmonat, lebensmonatszahl) =>
    mapLebensmonat(lebensmonat, (monat, elternteil) => {
      if (kannMonatErgaenztWerden(monat)) {
        const bruttoeinkommen = findeBruttoeinkommen(
          lebensmonate,
          lebensmonatszahl,
          elternteil,
        );

        return bruttoeinkommen
          ? gebeEinkommenAn(monat, bruttoeinkommen)
          : monat;
      } else {
        return monat;
      }
    }),
  );
}

function kannMonatErgaenztWerden(monat: Monat): boolean {
  return (
    MonatHatBonusGewaehlt.asPredicate(monat) &&
    !MonatHatBruttoeinkommen.asPredicate(monat)
  );
}

function findeBruttoeinkommen<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
): Einkommen | undefined {
  return listeLebensmonateAuf(lebensmonate)
    .map<[Lebensmonatszahl, Monat]>(([lebensmonatszahl, lebensmonat]) => [
      lebensmonatszahl,
      lebensmonat[elternteil],
    ])
    .filter(([, monat]) =>
      MonatHatBonusGewaehlt.and(MonatHatBruttoeinkommen).asPredicate(monat),
    )
    .toSorted(([left], [right]) =>
      compareByDistanceToReferenceLebensmonatszahl(
        lebensmonatszahl,
        left,
        right,
      ),
    )[0]?.[1].bruttoeinkommen;
}

/**
 * Example:
 * ```
 * [1, 4, 7].sort(compareByDistanceToReferenceLebensmonatszahl.bind(null, 5)) // [4, 7, 1]
 * ```
 */
function compareByDistanceToReferenceLebensmonatszahl(
  reference: Lebensmonatszahl,
  left: Lebensmonatszahl,
  right: Lebensmonatszahl,
): number {
  return Math.abs(left - reference) - Math.abs(right - reference);
}

function mapLebensmonate<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  transfom: (
    lebensmonat: Lebensmonat<E>,
    lebensmonatszahl: Lebensmonatszahl,
  ) => Lebensmonat<E>,
): Lebensmonate<E> {
  return mapRecordEntriesWithIntegerKeys(
    lebensmonate,
    isLebensmonatszahl,
    transfom,
  );
}

function mapLebensmonat<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  transfom: (monat: Monat, elternteil: E) => Monat,
): Lebensmonat<E> {
  return mapRecordEntriesWithStringKeys(lebensmonat, isElternteil, transfom);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ergaenze Bruttoeinkommen für Partnerschaftsbonus", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner/Monat");

    it("leaves any Monate without Partnerschaftsbonus untouched", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 11),
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Plus, 21),
          [Elternteil.Zwei]: monat(KeinElterngeld, 22),
        },
      };

      const lebensmonateNachher =
        ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(lebensmonateVorher);

      expect(lebensmonateNachher).toStrictEqual(lebensmonateVorher);
    });

    it("leaves any Monate with Partnerschaftsbonus untouched that already have some Bruttoeinkommen", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, 11),
          [Elternteil.Zwei]: monat(Variante.Bonus, 12),
        },
      };

      const lebensmonateNachher =
        ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(lebensmonateVorher);

      expect(lebensmonateNachher).toStrictEqual(lebensmonateVorher);
    });

    it("does nothing if no Monat with Partnerschaftsbonus of an Elternnteil has Bruttoeinkommen", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, undefined),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined),
        },
      };

      const lebensmonateNachher =
        ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(lebensmonateVorher);

      expect(lebensmonateNachher).toStrictEqual(lebensmonateVorher);
    });

    it("sets Bruttoeinkommen for Monate with Partnerschaftsbonus that have none set based on the Bruttoeinkommen of another Monat with Partnerschaftsbonus of the same Elternteil", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, 100),
          [Elternteil.Zwei]: monat(Variante.Bonus, 200),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, undefined),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined),
        },
      };

      const lebensmonateNachher =
        ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(lebensmonateVorher);

      expect(lebensmonateNachher).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, 100),
          [Elternteil.Zwei]: monat(Variante.Bonus, 200),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, 100),
          [Elternteil.Zwei]: monat(Variante.Bonus, 200),
        },
      });
    });

    it("sets Bruttoeinkommen based on the clostest Monat with Partnerschaftsbonus of the same Elternteil", () => {
      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, undefined),
          [Elternteil.Zwei]: monat(Variante.Bonus, 21),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, 21),
          [Elternteil.Zwei]: monat(Variante.Bonus, 22),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined),
        },
      };

      const lebensmonateNachher =
        ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(lebensmonateVorher);

      expect(lebensmonateNachher).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, 21),
          [Elternteil.Zwei]: monat(Variante.Bonus, 21),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus, 21),
          [Elternteil.Zwei]: monat(Variante.Bonus, 22),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, 22),
        },
      });
    });

    function monat(
      gewaehlteOption?: Auswahloption,
      bruttoeinkommen?: Einkommen,
    ) {
      return {
        gewaehlteOption,
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }
  });
}
