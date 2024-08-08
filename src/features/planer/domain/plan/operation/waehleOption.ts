import { Elternteil } from "@/features/planer/domain/Elternteil";
import { erstelleInitialenLebensmonat } from "@/features/planer/domain/lebensmonat";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/Ausgangslage";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { waehleOption as waehleOptionInLebensmonaten } from "@/features/planer/domain/lebensmonate";
import { Variante } from "@/features/planer/domain/Variante";

export function waehleOption<A extends Ausgangslage>(
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption,
): Plan<A> {
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

  return { ...plan, lebensmonate: gewaehlteLebensmonate };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
    const ausgangslage = { anzahlElternteile: 2 as const };
    const lebensmonate = {
      1: {
        [Elternteil.Eins]: { imMutterschutz: false as const },
        [Elternteil.Zwei]: { imMutterschutz: false as const },
      },
      2: {
        [Elternteil.Eins]: { imMutterschutz: false as const },
        [Elternteil.Zwei]: { imMutterschutz: false as const },
      },
    };

    const plan = waehleOption(
      { ausgangslage, lebensmonate },
      1,
      Elternteil.Zwei,
      Variante.Plus,
    );

    const lebensmonatEins = plan.lebensmonate[1]!;
    const lebensmonatZwei = plan.lebensmonate[2]!;

    expect(lebensmonatEins[Elternteil.Eins].gewaehlteOption).toBeUndefined();
    expect(lebensmonatEins[Elternteil.Zwei].gewaehlteOption).toBe(
      Variante.Plus,
    );
    expect(lebensmonatZwei[Elternteil.Eins].gewaehlteOption).toBeUndefined();
    expect(lebensmonatZwei[Elternteil.Zwei].gewaehlteOption).toBeUndefined();
  });

  it("can set the Auswahloption even for an empty plan", () => {
    const ausgangslage = { anzahlElternteile: 1 as const };
    const lebensmonate = {};

    const plan = waehleOption(
      { ausgangslage, lebensmonate },
      1,
      Elternteil.Eins,
      Variante.Basis,
    );

    const lebensmonatEins = plan.lebensmonate[1];

    expect(lebensmonatEins).toBeDefined();
    expect(lebensmonatEins![Elternteil.Eins].gewaehlteOption).toBe(
      Variante.Basis,
    );
  });
}
