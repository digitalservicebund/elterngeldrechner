import {
  type PlanMitBeliebigenElternteilen,
  Variante,
  bestimmeVerfuegbaresKontingent,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";

export function generateTips(plan: PlanMitBeliebigenElternteilen): Tips {
  const verfuegbaresKontingent = bestimmeVerfuegbaresKontingent(
    plan.ausgangslage,
  );
  const verplantesKontingent = zaehleVerplantesKontingent(plan.lebensmonate);

  const remainingBasis =
    verfuegbaresKontingent[Variante.Basis] -
    verplantesKontingent[Variante.Basis];
  const remainingPlus =
    verfuegbaresKontingent[Variante.Plus] - verplantesKontingent[Variante.Plus];
  const remainingBonus =
    verfuegbaresKontingent[Variante.Bonus] -
    verplantesKontingent[Variante.Bonus];

  const availableBonus = verfuegbaresKontingent[Variante.Bonus];

  const hasBasisLeft = remainingBasis > 0.5;
  const hasPlusLeft = remainingPlus > 0;
  const hasBonusLeft = remainingBonus > 0;

  if (hasBasisLeft || hasPlusLeft) {
    const tips = [];

    if (hasBasisLeft && hasPlusLeft) {
      tips.push(
        `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld oder noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen`,
      );
    } else {
      if (hasBasisLeft) {
        tips.push(
          `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld verteilen.`,
        );
      }

      if (hasPlusLeft) {
        tips.push(
          `Sie können noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen.`,
        );
      }
    }

    if (hasBonusLeft) {
      tips.push(
        `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
      );
    }

    return { normalTips: tips, hasSpecialBonusTip: false };
  } else if (availableBonus > 0 && remainingBonus === availableBonus) {
    return { normalTips: [], hasSpecialBonusTip: true };
  } else if (remainingBonus > 0) {
    return {
      normalTips: [
        `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
      ],
      hasSpecialBonusTip: false,
    };
  } else {
    return { normalTips: [], hasSpecialBonusTip: false };
  }
}

export type Tips = {
  normalTips: string[];
  hasSpecialBonusTip: boolean;
};
