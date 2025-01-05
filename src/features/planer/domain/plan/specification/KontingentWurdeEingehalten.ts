import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import { Variante } from "@/features/planer/domain/Variante";
import {
  Ausgangslage,
  bestimmeVerfuegbaresKontingent,
} from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import { SpecificationResult } from "@/features/planer/domain/common/specification/SpecificationResult";
import { zaehleVerplantesKontingent } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";

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
  return new KontingentFuerVarianteWurdeEingehalten<A>(Variante.Basis);
}

function KontingentFuerPlusWurdeEingehalten<A extends Ausgangslage>() {
  return new KontingentFuerVarianteWurdeEingehalten<A>(Variante.Plus);
}

export function KontingentFuerBonusWurdeEingehalten<A extends Ausgangslage>() {
  return new KontingentFuerVarianteWurdeEingehalten<A>(Variante.Bonus);
}

class KontingentFuerVarianteWurdeEingehalten<
  A extends Ausgangslage,
> extends Specification<Plan<A>> {
  constructor(private readonly variante: Variante) {
    super();
  }

  evaluate(plan: Plan<A>): SpecificationResult {
    const verfuegbar = bestimmeVerfuegbaresKontingent(plan.ausgangslage)[
      this.variante
    ];
    const verplant = zaehleVerplantesKontingent(plan.lebensmonate)[
      this.variante
    ];
    const istKontingentEingehalten = verfuegbar >= verplant;

    return istKontingentEingehalten
      ? SpecificationResult.satisfied
      : SpecificationResult.unsatisfied({
          message: `Ihre verfügbaren ${this.variante} Monate sind aufgebraucht.`,
        });
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Kontingent wurde eingehalten", async () => {
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if verplantes Kontingent remains below verfügbares Kontingent for defined Variante", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(3, 3, 1),
      );
      const specification = new KontingentFuerVarianteWurdeEingehalten(
        Variante.Plus,
      );

      expect(specification.asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is satisfied if verplantes Kontingent fully used verfügbares Kontingent for defined Variante", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(2, 5, 1),
      );
      const specification = new KontingentFuerVarianteWurdeEingehalten(
        Variante.Basis,
      );

      expect(specification.asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is unsatisfied if verplantes Kontingent is above verfügbares Kontingent for defined Variante", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(1, 4, 4),
      );
      const specification = new KontingentFuerVarianteWurdeEingehalten(
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

    vi.mock(
      import(
        "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent"
      ),
    );
    vi.mock(
      import(
        "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
      ),
    );
  });
}
