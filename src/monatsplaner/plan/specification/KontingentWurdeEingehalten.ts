import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import { Variante } from "@/monatsplaner/Variante";
import {
  Ausgangslage,
  bestimmeVerfuegbaresKontingent,
} from "@/monatsplaner/ausgangslage";
import { Specification } from "@/monatsplaner/common/specification";
import { zaehleVerplantesKontingent } from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan/Plan";

export function KontingentWurdeEingehalten() {
  return KontingentFuerBasisWurdeEingehalten()
    .and(KontingentFuerPlusWurdeEingehalten())
    .and(
      KontingentFuerBonusWurdeEingehalten().withPrecondition(
        KeinBonusFuerNurEinElternteil(),
      ),
    );
}

export function KontingentFuerBasisWurdeEingehalten<A extends Ausgangslage>() {
  return KontingentFuerVarianteWurdeEingehalten<A>(Variante.Basis);
}

function KontingentFuerPlusWurdeEingehalten<A extends Ausgangslage>() {
  return KontingentFuerVarianteWurdeEingehalten<A>(Variante.Plus);
}

export function KontingentFuerBonusWurdeEingehalten<A extends Ausgangslage>() {
  return KontingentFuerVarianteWurdeEingehalten<A>(Variante.Bonus);
}

function KontingentFuerVarianteWurdeEingehalten<A extends Ausgangslage>(
  variante: Variante,
) {
  return Specification.fromPredicate(
    `Ihre verfügbaren ${variante} Monate sind aufgebraucht.`,
    (plan: Plan<A>) => {
      const verfuegbar = bestimmeVerfuegbaresKontingent(plan.ausgangslage)[
        variante
      ];
      const verplant = zaehleVerplantesKontingent(plan.lebensmonate)[variante];
      return verfuegbar >= verplant;
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("Kontingent wurde eingehalten", async () => {
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");
    const bestimmeVerfuegbaresKontingentModule = await import(
      "@/monatsplaner/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
    );
    const zaehleVerplantesKontingentModule = await import(
      "@/monatsplaner/lebensmonate/operation/zaehleVerplantesKontingent"
    );

    it("is satisfied if verplantes Kontingent remains below verfügbares Kontingent for defined Variante", () => {
      vi.spyOn(
        bestimmeVerfuegbaresKontingentModule,
        "bestimmeVerfuegbaresKontingent",
      ).mockReturnValue(kontingent(2, 4, 3));

      vi.spyOn(
        zaehleVerplantesKontingentModule,
        "zaehleVerplantesKontingent",
      ).mockReturnValue(kontingent(3, 3, 1));

      const specification = KontingentFuerVarianteWurdeEingehalten(
        Variante.Plus,
      );

      expect(specification.asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is satisfied if verplantes Kontingent fully used verfügbares Kontingent for defined Variante", () => {
      vi.spyOn(
        bestimmeVerfuegbaresKontingentModule,
        "bestimmeVerfuegbaresKontingent",
      ).mockReturnValue(kontingent(2, 4, 3));

      vi.spyOn(
        zaehleVerplantesKontingentModule,
        "zaehleVerplantesKontingent",
      ).mockReturnValue(kontingent(2, 5, 1));

      const specification = KontingentFuerVarianteWurdeEingehalten(
        Variante.Basis,
      );

      expect(specification.asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is unsatisfied if verplantes Kontingent is above verfügbares Kontingent for defined Variante", () => {
      vi.spyOn(
        bestimmeVerfuegbaresKontingentModule,
        "bestimmeVerfuegbaresKontingent",
      ).mockReturnValue(kontingent(2, 4, 3));

      vi.spyOn(
        zaehleVerplantesKontingentModule,
        "zaehleVerplantesKontingent",
      ).mockReturnValue(kontingent(1, 4, 4));

      const specification = KontingentFuerVarianteWurdeEingehalten(
        Variante.Bonus,
      );

      const violationMessages = specification.evaluate(ANY_PLAN).mapOrElse(
        () => [],
        (violations) => violations.map(({ message }) => message),
      );

      expect(violationMessages).toStrictEqual(
        expect.arrayContaining([
          "Ihre verfügbaren Partnerschaftsbonus Monate sind aufgebraucht.",
        ]),
      );
    });

    const kontingent = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
        [KeinElterngeld]: 0,
      };
    };

    const ANY_PLAN = {} as never;
  });
}
