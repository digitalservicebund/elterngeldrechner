import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import type {
  Elterngeldbezug,
  ElterngeldbezuegeFuerElternteil,
} from "@/features/planer/domain/Elterngeldbezug";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { aktualisiereElterngeldbezuege as aktualisiereElterngeldbezuegeInLebensmonaten } from "@/features/planer/domain/lebensmonate";

export function aktualisiereElterngeldbezuege<A extends Ausgangslage>(
  plan: Plan<A>,
  elternteil: ElternteileByAusgangslage<A>,
  elterngeldbezuege: ElterngeldbezuegeFuerElternteil,
): Plan<A> {
  return {
    ...plan,
    lebensmonate: aktualisiereElterngeldbezuegeInLebensmonaten(
      plan.lebensmonate,
      elternteil,
      elterngeldbezuege,
    ),
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const ausgangslage = {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 11),
          [Elternteil.Zwei]: monat(Variante.Plus, 12),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, 32),
        },
      };

      const planVorher = { ausgangslage, lebensmonate };
      const elterngeldbezuege = { 1: 100, 2: 200, 3: 300 };

      const plan = aktualisiereElterngeldbezuege(
        planVorher,
        Elternteil.Zwei,
        elterngeldbezuege,
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 11),
          [Elternteil.Zwei]: monat(Variante.Plus, 100),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus, 31),
          [Elternteil.Zwei]: monat(Variante.Bonus, 300),
        },
      });
    });

    const monat = function (
      gewaehlteOption: Auswahloption,
      elterngeldbezug: Elterngeldbezug,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    };

    const ANY_PSEUDONYME = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
  });
}
