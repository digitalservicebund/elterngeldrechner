import { aktualisiereElterngeldbezuege } from "./aktualisiereElterngeldbezuege";
import { teileLebensmonateBeiElternteileAuf } from "./teileLebensmonateBeiElternteileAuf";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { BerechneElterngeldbezuegeCallback } from "@/features/planer/domain/Elterngeldbezug";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { Result } from "@/features/planer/domain/common/Result";
import type { SpecificationViolation } from "@/features/planer/domain/common/specification";
import { erstelleInitialenLebensmonat } from "@/features/planer/domain/lebensmonat";
import { waehleOption as waehleOptionInLebensmonaten } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { VorlaeufigGueltigerPlan } from "@/features/planer/domain/plan/specification";

export function waehleOption<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption,
): Result<Plan<A>, SpecificationViolation[]> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    lebensmonatszahl,
  );

  const gewaehlteLebensmonate = waehleOptionInLebensmonaten(
    plan.lebensmonate,
    lebensmonatszahl,
    elternteil,
    option,
    ungeplanterLebensmonat,
  );

  const gewaehlterPlan: Plan<A> = {
    ...plan,
    lebensmonate: gewaehlteLebensmonate,
  };

  return VorlaeufigGueltigerPlan<A>()
    .evaluate(gewaehlterPlan)
    .mapOrElse(
      () =>
        Result.ok(
          berechneUndAktualisiereElterngeldbezuege(
            berechneElterngeldbezuege,
            gewaehlterPlan,
            elternteil,
          ),
        ),
      (violations) => Result.error(violations),
    );
}

function berechneUndAktualisiereElterngeldbezuege<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  elternteil: ElternteileByAusgangslage<A>,
): Plan<A> {
  const monate = teileLebensmonateBeiElternteileAuf(plan)[elternteil];
  const elterngeldbezuege = berechneElterngeldbezuege(elternteil, monate);
  return aktualisiereElterngeldbezuege(plan, elternteil, elterngeldbezuege);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Specification } = await import(
      "@/features/planer/domain/common/specification"
    );

    beforeEach(() => {
      vi.mocked(VorlaeufigGueltigerPlan).mockReturnValue(
        Specification.fromPredicate("", () => true),
      );
    });

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      const planVorher = {
        ...ANY_PLAN,
        lebensmonate,
      };

      const plan = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        planVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
      ).unwrapOrElse(() => planVorher);

      expectOption(plan, 1, Elternteil.Eins).toBeUndefined();
      expectOption(plan, 1, Elternteil.Zwei).toBe(Variante.Plus);
      expectOption(plan, 2, Elternteil.Eins).toBeUndefined();
      expectOption(plan, 2, Elternteil.Zwei).toBeUndefined();
    });

    it("can set the Auswahloption even for an empty plan", () => {
      const planVorher = {
        ...ANY_PLAN,
        lebensmonate: {},
      };

      const plan = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        planVorher,
        1,
        Elternteil.Eins,
        Variante.Basis,
      ).unwrapOrElse(() => planVorher);

      expectOption(plan, 1, Elternteil.Eins).toBe(Variante.Basis);
    });

    it("forwards the violations if the resulting Plan is not gültig", () => {
      vi.mocked(VorlaeufigGueltigerPlan).mockReturnValue(
        Specification.fromPredicate("ungültig", () => false),
      );

      const violations = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        ANY_PLAN,
        ANY_LEBENSMONATSZAHL,
        ANY_ELTERNTEIL,
        ANY_AUSWAHLOPTION,
      ).mapOrElse(
        () => [],
        (violations) => violations,
      );

      expect(violations).toEqual([{ message: "ungültig" }]);
    });

    it("updates the Elterngeldbezüge of the Elternteil using the given callback", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Plus, 112, 114),
          [Elternteil.Zwei]: monat(Variante.Basis, 121, 124),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis, 311, 314),
          [Elternteil.Zwei]: monat(undefined, undefined, 324),
        },
      };
      const planVorher = { ...ANY_PLAN, lebensmonate };

      const berechneElterngeldbezuege = vi
        .fn()
        .mockReturnValue({ 1: 1000, 2: 2000, 3: 3000 });

      const plan = waehleOption(
        berechneElterngeldbezuege,
        planVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
      ).unwrapOrElse(() => planVorher);

      expect(berechneElterngeldbezuege).toHaveBeenCalledOnce();
      expect(berechneElterngeldbezuege).toHaveBeenLastCalledWith(
        Elternteil.Zwei,
        {
          1: monat(Variante.Plus, undefined, 124),
          3: monat(undefined, undefined, 324),
        },
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Plus, 112, 114),
          [Elternteil.Zwei]: monat(Variante.Plus, 1000, 124),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis, 311, 314),
          [Elternteil.Zwei]: monat(undefined, undefined, 324),
        },
      });
    });

    vi.mock(
      import(
        "@/features/planer/domain/plan/specification/VorlaeufigGueltigerPlan"
      ),
    );

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      elterngeldbezug?: number,
      bruttoeinkommen?: number,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };

    const ANY_LEBENSMONATSZAHL = 1;
    const ANY_ELTERNTEIL = Elternteil.Eins;
    const ANY_AUSWAHLOPTION = Variante.Basis;
    const ANY_BERECHNE_ELTERNGELDBEZUEGE = () => ({});

    function expectOption<A extends Ausgangslage>(
      plan: Plan<A>,
      lebensmonatszahl: Lebensmonatszahl,
      elternteil: ElternteileByAusgangslage<A>,
    ) {
      return expect(
        plan.lebensmonate[lebensmonatszahl]?.[elternteil].gewaehlteOption,
      );
    }
  });
}
