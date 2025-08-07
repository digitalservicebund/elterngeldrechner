import { findeLetztenVerplantenLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/findeLetztenVerplantenLebensmonat";
import {
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

  const remainingBasis =
    verfuegbaresKontingent[Variante.Basis] -
    verplantesKontingent[Variante.Basis];
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
        `Sie können noch ${remainingBasis === 1 ? "ein Monat" : `${remainingBasis} Monate`} Basiselterngeld oder noch ${remainingPlus === 1 ? "ein Monat" : `${remainingPlus} Monate`} ElterngeldPlus verteilen`,
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
        `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
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
          `Jeder von Ihnen kann noch ${remainingBonus === 2 ? "ein Monat" : `${remainingBonus / 2} Monate`} Partnerschaftsbonus verteilen`,
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
