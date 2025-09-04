import { findeLetztenVerplantenLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/findeLetztenVerplantenLebensmonat";
import {
  Auswahloption,
  Elternteil,
  Lebensmonatszahl,
  type PlanMitBeliebigenElternteilen,
  Variante,
  bestimmeVerfuegbaresKontingent,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";

export type Tips = {
  normalTips: string[];
  hasSpecialBonusTip: boolean;
};

export function generateTips(plan: PlanMitBeliebigenElternteilen): Tips {
  const verfuegbaresKontingent = bestimmeVerfuegbaresKontingent(
    plan.ausgangslage,
  );
  const verplantesKontingent = zaehleVerplantesKontingent(plan.lebensmonate);

  const remainingBasis = Math.floor(
    verfuegbaresKontingent[Variante.Basis] -
      verplantesKontingent[Variante.Basis],
  );
  const remainingPlus =
    verfuegbaresKontingent[Variante.Plus] - verplantesKontingent[Variante.Plus];
  const remainingBonus =
    verfuegbaresKontingent[Variante.Bonus] -
    verplantesKontingent[Variante.Bonus];

  const hasBasisLeft = remainingBasis > 0.5;
  const hasPlusLeft = remainingPlus > 0;
  const hasBonusLeft = remainingBonus > 0;

  if (hasBasisLeft || hasPlusLeft) {
    const tips = [];

    if (hasBasisLeft && hasPlusLeft) {
      tips.push(
        `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld oder noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen.`,
      );
    } else {
      if (hasPlusLeft) {
        tips.push(
          `Sie können noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen.`,
        );
      }
    }

    if (hasBonusLeft) {
      tips.push(
        `Jede bzw. jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen.`,
      );
    }

    return { normalTips: tips, hasSpecialBonusTip: false };
  } else if (hasBonusLeft) {
    if (prüfeBonusFreischaltenVerfuegbarkeit(plan)) {
      return { normalTips: [], hasSpecialBonusTip: true };
    } else if (verplantesKontingent[Variante.Bonus] === 0) {
      return {
        normalTips: [
          "Sie können noch 8 Monate Partnerschaftsbonus verteilen. Beachten Sie: Elterngeld muss ab dem 15. Lebensmonat fortlaufend und ohne Unterbrechung bezogen werden, darum ist Partnerschaftsbonus aktuell ausgegraut.",
        ],
        hasSpecialBonusTip: false,
      };
    } else {
      return {
        normalTips: [
          `Jede bzw. jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen.`,
        ],
        hasSpecialBonusTip: false,
      };
    }
  } else {
    return { normalTips: [], hasSpecialBonusTip: false };
  }
}

function prüfeBonusFreischaltenVerfuegbarkeit(
  plan: PlanMitBeliebigenElternteilen,
) {
  const letzterVerplanterLebensmonat = findeLetztenVerplantenLebensmonat(
    plan.lebensmonate,
  ) as Lebensmonatszahl;
  const planungLetzterLebensmonat =
    plan.lebensmonate[letzterVerplanterLebensmonat];

  const verfuegbaresBonusKontingent = bestimmeVerfuegbaresKontingent(
    plan.ausgangslage,
  )[Variante.Bonus];
  const verplantesBonusKontingent = zaehleVerplantesKontingent(
    plan.lebensmonate,
  )[Variante.Bonus];

  if (
    letzterVerplanterLebensmonat > 14 &&
    planungLetzterLebensmonat &&
    (planungLetzterLebensmonat["Elternteil 1"].gewaehlteOption ===
      "kein Elterngeld" ||
      planungLetzterLebensmonat["Elternteil 2"].gewaehlteOption ===
        "kein Elterngeld")
  ) {
    return false;
  } else if (
    verfuegbaresBonusKontingent > 0 &&
    verplantesBonusKontingent === 0
  ) {
    return true;
  } else {
    return false;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("generateTips", () => {
    it("generates tips for two parents and no months selected", () => {
      const expectedTips = {
        normalTips: [
          "Sie können noch 14 Monate Basiselterngeld oder noch 28 Monate ElterngeldPlus verteilen.",
          "Jede bzw. jeder von Ihnen kann noch 4 Monate Partnerschaftsbonus verteilen.",
        ],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 0, anzahlPlus: 0, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents and both Basis and Plus and Bonus available", () => {
      const expectedTips = {
        normalTips: [
          "Sie können noch 10 Monate Basiselterngeld oder noch 21 Monate ElterngeldPlus verteilen.",
          "Jede bzw. jeder von Ihnen kann noch 4 Monate Partnerschaftsbonus verteilen.",
        ],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 2, anzahlPlus: 3, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents and only Plus and Bonus available", () => {
      const expectedTips = {
        normalTips: [
          "Sie können noch ein Monat ElterngeldPlus verteilen.",
          "Jede bzw. jeder von Ihnen kann noch 4 Monate Partnerschaftsbonus verteilen.",
        ],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 10, anzahlPlus: 7, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents and only and all Bonus available and available to activate", () => {
      const expectedTips = {
        normalTips: [],
        hasSpecialBonusTip: true,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents and only and all Bonus available but not available to activate", () => {
      const expectedTips = {
        normalTips: [
          "Sie können noch 8 Monate Partnerschaftsbonus verteilen. Beachten Sie: Elterngeld muss ab dem 15. Lebensmonat fortlaufend und ohne Unterbrechung bezogen werden, darum ist Partnerschaftsbonus aktuell ausgegraut.",
        ],
        hasSpecialBonusTip: false,
      };

      const initialPlan = makePlan({
        anzahlBasis: 14,
        anzahlPlus: 0,
        anzahlBonus: 0,
      });
      const plan: PlanMitBeliebigenElternteilen = {
        ...initialPlan,
        lebensmonate: {
          ...initialPlan.lebensmonate,
          15: {
            [Elternteil.Eins]: {
              imMutterschutz: false as const,
              gewaehlteOption: "kein Elterngeld",
            },
            [Elternteil.Zwei]: {
              imMutterschutz: false as const,
              gewaehlteOption: "kein Elterngeld",
            },
          },
        },
      };
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents and only but not all Bonus available", () => {
      const expectedTips = {
        normalTips: [
          "Jede bzw. jeder von Ihnen kann noch 3 Monate Partnerschaftsbonus verteilen.",
        ],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 2 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates no tips for two parents and nothing available", () => {
      const expectedTips = {
        normalTips: [],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 8 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });
  });
}

function makePlan({
  anzahlBasis,
  anzahlPlus,
  anzahlBonus,
}: {
  anzahlBasis: number;
  anzahlPlus: number;
  anzahlBonus: number;
}): PlanMitBeliebigenElternteilen {
  let month = 1;
  // eslint-disable-next-line
  const lebensmonate: Record<number, any> = {};

  const monat = (gewaehlteOption?: Auswahloption) => {
    return { gewaehlteOption, imMutterschutz: false as const };
  };

  const addMonth = (variante: Variante, anzahl: number) => {
    for (
      let i = 0;
      i < (variante === Variante.Bonus ? anzahl / 2 : anzahl);
      i++
    ) {
      if (variante === Variante.Bonus) {
        lebensmonate[month] = {
          [Elternteil.Eins]: monat(variante),
          [Elternteil.Zwei]: monat(variante),
        };
      } else {
        lebensmonate[month] = {
          [Elternteil.Eins]: monat(variante),
        };
      }
      month++;
    }
  };

  addMonth(Variante.Basis, anzahlBasis);
  addMonth(Variante.Plus, anzahlPlus);
  addMonth(Variante.Bonus, anzahlBonus);

  return {
    ausgangslage: {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jasper",
        [Elternteil.Zwei]: "Salome",
      },
      mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate,
  };
}
