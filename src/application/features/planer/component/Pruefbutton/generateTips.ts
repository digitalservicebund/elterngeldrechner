import { findeLetztenVerplantenLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/findeLetztenVerplantenLebensmonat";
import {
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

  function pluralize(singular: string, plural: string, count: number) {
    return count === 1 ? singular : plural;
  }
  const remainingMonthsString = (amount: number) => {
    return `${amount} ${pluralize("Monat", "Monate", amount)}`;
  };

  const tipForBasisAndPlusLeft = `Sie können noch ${remainingMonthsString(remainingBasis)} Basiselterngeld oder noch ${remainingMonthsString(remainingPlus)} ElterngeldPlus verteilen.`;
  const tipForPlusLeft = `Sie können noch ${remainingMonthsString(remainingPlus)} ElterngeldPlus verteilen.`;
  const tipForBonusLeft = (istAlleinerziehend?: boolean) => {
    if (istAlleinerziehend) {
      return `Sie können noch ${remainingMonthsString(remainingBonus)} Partnerschaftsbonus verteilen.`;
    } else {
      return `Jede bzw. jeder von Ihnen kann noch ${remainingMonthsString(remainingBonus / 2)} Partnerschaftsbonus verteilen.`;
    }
  };
  const tipForPlusBlocked = `Sie können noch ${remainingBonus} Monate Partnerschaftsbonus verteilen. Beachten Sie: Elterngeld muss ab dem 15. Lebensmonat fortlaufend und ohne Unterbrechung bezogen werden, darum ist Partnerschaftsbonus aktuell ausgegraut.`;

  if (hasBasisLeft || hasPlusLeft) {
    const tips = [];

    if (hasBasisLeft && hasPlusLeft) {
      tips.push(tipForBasisAndPlusLeft);
    } else {
      if (hasPlusLeft) {
        tips.push(tipForPlusLeft);
      }
    }

    if (hasBonusLeft) {
      tips.push(tipForBonusLeft(plan.ausgangslage.istAlleinerziehend));
    }

    return { normalTips: tips, hasSpecialBonusTip: false };
  } else if (hasBonusLeft) {
    if (prüfeBonusFreischaltenVerfuegbarkeit(plan)) {
      return { normalTips: [], hasSpecialBonusTip: true };
    } else if (verplantesKontingent[Variante.Bonus] === 0) {
      return {
        normalTips: [tipForPlusBlocked],
        hasSpecialBonusTip: false,
      };
    } else {
      return {
        normalTips: [tipForBonusLeft(plan.ausgangslage.istAlleinerziehend)],
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

  const istLetzterVerplanterLebensmonatKeinElterngeld = () => {
    if (!planungLetzterLebensmonat) return false;

    const gewaehlteOptionLetzterLebensmonat = [
      planungLetzterLebensmonat["Elternteil 1"]?.gewaehlteOption,
      ...(plan.ausgangslage.istAlleinerziehend
        ? []
        : [planungLetzterLebensmonat["Elternteil 2"]?.gewaehlteOption]),
    ];

    return gewaehlteOptionLetzterLebensmonat.includes("kein Elterngeld");
  };

  if (
    letzterVerplanterLebensmonat > 14 &&
    istLetzterVerplanterLebensmonatKeinElterngeld()
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
    it("generates tips for two parents with no months selected", () => {
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

    it("generates tips for two parents with both Basis with Plus and Bonus available", () => {
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

    it("generates tips for two parents with only Plus and Bonus available", () => {
      const expectedTips = {
        normalTips: [
          "Sie können noch 1 Monat ElterngeldPlus verteilen.",
          "Jede bzw. jeder von Ihnen kann noch 4 Monate Partnerschaftsbonus verteilen.",
        ],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 10, anzahlPlus: 7, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generated specialBonusTip when parents exhaust their contingent with 14 basis months", () => {
      const expectedTips = {
        normalTips: [],
        hasSpecialBonusTip: true,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 0 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates tips for two parents with only and all Bonus available but not available to activate", () => {
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

    it("generates tips for two parents with only but not all Bonus available", () => {
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

    it("generates tips for single parent with only but not all Bonus available", () => {
      const expectedTips = {
        normalTips: ["Sie können noch 2 Monate Partnerschaftsbonus verteilen."],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 2 });
      const actualPlan: PlanMitBeliebigenElternteilen = {
        ...plan,
        ausgangslage: {
          anzahlElternteile: 1 as const,
          mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
          geburtsdatumDesKindes: new Date(),
          istAlleinerziehend: true,
        },
      };
      const generatedTips = generateTips(actualPlan);

      expect(generatedTips).toEqual(expectedTips);
    });

    it("generates no tips for two parents with nothing available", () => {
      const expectedTips = {
        normalTips: [],
        hasSpecialBonusTip: false,
      };

      const plan = makePlan({ anzahlBasis: 14, anzahlPlus: 0, anzahlBonus: 8 });
      const generatedTips = generateTips(plan);

      expect(generatedTips).toEqual(expectedTips);
    });
  });

  describe("prüfeBonusFreischaltenVerfuegbarkeit", () => {
    it("returns true if no bonus months are selected", () => {
      const plan = makePlan({ anzahlBasis: 0, anzahlPlus: 0, anzahlBonus: 0 });

      expect(prüfeBonusFreischaltenVerfuegbarkeit(plan)).toBe(true);
    });

    it("returns false if bonus months are selected", () => {
      const plan = makePlan({ anzahlBasis: 0, anzahlPlus: 0, anzahlBonus: 2 });

      expect(prüfeBonusFreischaltenVerfuegbarkeit(plan)).toBe(false);
    });

    it("returns true if planung is longer than 14 months and not ends with kein Elterngeld", () => {
      const plan = makePlan({ anzahlBasis: 12, anzahlPlus: 4, anzahlBonus: 0 });

      expect(prüfeBonusFreischaltenVerfuegbarkeit(plan)).toBe(true);
    });

    it("returns false if planung is longer than 14 months and ends with kein Elterngeld for any parent", () => {
      const plan = makePlan({ anzahlBasis: 13, anzahlPlus: 1, anzahlBonus: 0 });

      const actualPlan: PlanMitBeliebigenElternteilen = {
        ...plan,
        lebensmonate: {
          ...plan.lebensmonate,
          [15]: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: "kein Elterngeld" as Variante,
              imMutterschutz: false as const,
            },
          },
        },
      };

      expect(prüfeBonusFreischaltenVerfuegbarkeit(actualPlan)).toBe(false);
    });

    it("returns true if planung is longer than 14 months, is for a single parent and Elternteil Eins not ends with kein Elterngeld", () => {
      const plan = makePlan({ anzahlBasis: 12, anzahlPlus: 3, anzahlBonus: 0 });

      const actualPlan: PlanMitBeliebigenElternteilen = {
        ausgangslage: {
          anzahlElternteile: 1 as const,
          mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
          geburtsdatumDesKindes: new Date(),
          istAlleinerziehend: true,
        },
        lebensmonate: {
          ...plan.lebensmonate,
          [16]: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: "kein Elterngeld" as Variante,
              imMutterschutz: false as const,
            },
          },
        },
      };

      expect(prüfeBonusFreischaltenVerfuegbarkeit(actualPlan)).toBe(true);
    });

    it("returns false if planung is longer than 14 months, is for a single parent and Elternteil Eins ends with kein Elterngeld", () => {
      const plan = makePlan({ anzahlBasis: 13, anzahlPlus: 1, anzahlBonus: 0 });

      const actualPlan: PlanMitBeliebigenElternteilen = {
        ausgangslage: {
          anzahlElternteile: 1 as const,
          mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
          geburtsdatumDesKindes: new Date(),
          istAlleinerziehend: true,
        },
        lebensmonate: {
          ...plan.lebensmonate,
          [15]: {
            [Elternteil.Eins]: {
              gewaehlteOption: "kein Elterngeld" as Variante,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
        },
      };

      expect(prüfeBonusFreischaltenVerfuegbarkeit(actualPlan)).toBe(false);
    });
  });
}

type MakePlanOptions = {
  anzahlBasis: number;
  anzahlPlus: number;
  anzahlBonus: number;
};

/** This method generates a simple plan with a certain amount of selected months
 * by inputting the amount of months for each variant. However, since it is
 * simply used to test the tip generation, it is not necessarily a valid plan.
 *
 * @param options MakePlanOptions: {anzahlBasis: number, anzahlPlus: number, anzahlBonus: number}
 */
function makePlan(options: MakePlanOptions): PlanMitBeliebigenElternteilen {
  const { anzahlBasis, anzahlPlus, anzahlBonus } = options;

  const segments = [
    {
      count: anzahlBasis,
      template: () => ({
        [Elternteil.Eins]: {
          gewaehlteOption: Variante.Basis,
          imMutterschutz: false as const,
        },
      }),
    },
    {
      count: anzahlPlus,
      template: () => ({
        [Elternteil.Eins]: {
          gewaehlteOption: Variante.Plus,
          imMutterschutz: false as const,
        },
      }),
    },
    {
      count: anzahlBonus / 2,
      template: () => ({
        [Elternteil.Eins]: {
          gewaehlteOption: Variante.Bonus,
          imMutterschutz: false as const,
        },
        [Elternteil.Zwei]: {
          gewaehlteOption: Variante.Bonus,
          imMutterschutz: false as const,
        },
      }),
    },
  ];

  const lebensmonate: PlanMitBeliebigenElternteilen["lebensmonate"] =
    Object.fromEntries(
      segments
        .flatMap(({ count, template }) =>
          Array.from({ length: count }, template),
        )
        .map((value, idx) => [(idx + 1) as Lebensmonatszahl, value]),
    );

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
