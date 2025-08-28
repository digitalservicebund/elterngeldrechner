import { Beispiel, erstelleBeispiele } from "./erstelleBeispiele";
import type {
  Ausgangslage,
  AusgangslageFuerZweiElternteile,
  Auswahloption,
  BerechneElterngeldbezuegeCallback,
  Monat,
  Plan,
} from "@/monatsplaner";
import {
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
} from "@/monatsplaner";

export function findePassendesBeispiel<A extends Ausgangslage>(
  plan: Plan<A>,
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
): Beispiel<A> | undefined {
  const beispiele = erstelleBeispiele(
    plan.ausgangslage,
    berechneElterngeldbezuege,
  );

  return beispiele.find((beispiel) => {
    return sindAlleMonateGleich(
      listeMonateAuf(beispiel.plan),
      listeMonateAuf(plan),
    );
  });
}

function listeMonateAuf(plan: Plan<Ausgangslage>) {
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  const lebensmonate = listeLebensmonateAuf(plan.lebensmonate);

  const monate = lebensmonate.map(([_, lebensmonat]) => {
    return elternteile.map((elternteil) => lebensmonat[elternteil]);
  });

  return monate;
}

function sindAlleMonateGleich(left: Monat[][], right: Monat[][]): boolean {
  if (left.length !== right.length) return false;

  for (let i = 0; i < left.length; i++) {
    const leftRow = left[i];
    const rightRow = right[i];

    if (leftRow === undefined || rightRow === undefined) {
      return false;
    }

    if (leftRow.length !== rightRow.length) {
      return false;
    }

    for (let j = 0; j < leftRow.length; j++) {
      const leftCell = leftRow[j];
      const rightCell = rightRow[j];

      if (leftCell === undefined || rightCell === undefined) {
        return false;
      }

      if (!istMonatGleich(leftCell, rightCell)) {
        return false;
      }
    }
  }

  return true;
}

function istMonatGleich(left: Monat, right: Monat): boolean {
  return (
    left.bruttoeinkommen == right.bruttoeinkommen &&
    left.elterngeldbezug == right.elterngeldbezug &&
    left.gewaehlteOption == right.gewaehlteOption &&
    left.imMutterschutz == right.imMutterschutz
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  beforeEach(() => {
    vi.mock("./erstelleBeispiele");
  });

  describe("findePassendesBeispiel", async () => {
    const { Elternteil, Variante } = await import("@/monatsplaner");
    const { aktualisiereElterngeldbezuege } = await import("@/monatsplaner");
    const { erstelleBeispiele } = await import("./erstelleBeispiele");

    it("findet beispiel wenn monate genau gleich sind", () => {
      const plan: Plan<AusgangslageFuerZweiElternteile> = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          geburtsdatumDesKindes: new Date(),
        },
        lebensmonate: {
          1: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(undefined),
          },
          2: {
            [Elternteil.Eins]: monat(undefined),
            [Elternteil.Zwei]: monat(Variante.Basis),
          },
        },
      };

      vi.mocked(erstelleBeispiele).mockReturnValue([
        {
          titel: "Testbeispiel",
          identifier: "dce5b116",
          beschreibung: "Beispiel mit dem erstellen Plan",
          plan: plan,
        },
      ]);

      const berechneElterngeldbezuege = vi.fn();

      const beispiel = findePassendesBeispiel(plan, berechneElterngeldbezuege);

      expect(beispiel!.identifier).toEqual("dce5b116");
    });

    it("findet beispiel nicht bei abweichenden elterngeldbezuegen", () => {
      const plan: Plan<AusgangslageFuerZweiElternteile> = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          geburtsdatumDesKindes: new Date(),
        },
        lebensmonate: {
          1: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(undefined),
          },
          2: {
            [Elternteil.Eins]: monat(undefined),
            [Elternteil.Zwei]: monat(Variante.Basis),
          },
        },
      };

      vi.mocked(erstelleBeispiele).mockReturnValue([
        {
          titel: "Testbeispiel",
          identifier: "dce5b116",
          beschreibung: "Beispiel mit dem erstellen Plan",
          plan: plan,
        },
      ]);

      const berechneElterngeldbezuege = vi
        .fn()
        .mockReturnValue({ 1: 200, 2: 200 });

      const berechneKeineElterngeldbezuege = vi.fn();

      const planInklusiveElterngeldbezuegen = aktualisiereElterngeldbezuege(
        berechneElterngeldbezuege,
        plan,
      );

      const beispiel = findePassendesBeispiel(
        planInklusiveElterngeldbezuegen,
        berechneKeineElterngeldbezuege,
      );

      expect(beispiel).toBeUndefined();
    });

    function monat(gewaehlteOption: Auswahloption | undefined) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
