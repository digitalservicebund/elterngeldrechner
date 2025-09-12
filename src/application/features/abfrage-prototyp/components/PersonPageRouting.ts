export const personPageSteps = {
  angabenPerson: "Angaben Person",
  einkommenArt: "Art des Einkommens",
  zeitraumKeinEinkommen: "Zeitraum kein Einkommen",
  ausklammerungGruende: "Gründe weniger Einkommen",
  ausklammerungZeiten: "Daten weniger Einkommen",
  bmz: "Bemessungszeitraum",
} as const;

export type PersonPageStepKey = keyof typeof personPageSteps;

export enum PersonPageFlow {
  selbststaendig,
  mischeinkuenfte,
  nichtSelbststaendig,
  keinEinkommen,
  sozialleistungen,
}

export function getNextStep(
  currentStep: PersonPageStepKey,
  flow: PersonPageFlow | undefined,
): PersonPageStepKey | "routingEnded" {
  if (currentStep === "angabenPerson" || !flow) {
    return "einkommenArt";
  } else if (currentStep === "einkommenArt") {
    if (
      flow === PersonPageFlow.keinEinkommen ||
      flow === PersonPageFlow.sozialleistungen
    ) {
      return "zeitraumKeinEinkommen";
    }
    return "ausklammerungGruende";
  } else if (currentStep === "ausklammerungGruende") {
    return "ausklammerungZeiten";
  } else if (currentStep === "ausklammerungZeiten") {
    return "bmz";
  } else if (currentStep === "zeitraumKeinEinkommen") {
    return "ausklammerungGruende";
  } else {
    return "routingEnded";
  }
}

export function getLastStep(
  currentStep: PersonPageStepKey,
  flow: PersonPageFlow | undefined,
): PersonPageStepKey {
  if (currentStep === "bmz") {
    return "ausklammerungZeiten";
  } else if (currentStep === "ausklammerungZeiten") {
    return "ausklammerungGruende";
  } else if (currentStep === "ausklammerungGruende") {
    if (
      flow === PersonPageFlow.keinEinkommen ||
      flow === PersonPageFlow.sozialleistungen
    ) {
      return "zeitraumKeinEinkommen";
    }
    return "einkommenArt";
  } else if (currentStep === "zeitraumKeinEinkommen") {
    return "einkommenArt";
  }
  return "angabenPerson";
}
