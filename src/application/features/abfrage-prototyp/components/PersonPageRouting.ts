export const personPageSteps = {
  angabenPerson: "Angaben Person",
  einkommenArt: "Art des Einkommens",
  zeitraumKeinEinkommen: "Zeitraum kein Einkommen",
  zeitraumErsatzleistungen: "Zeitraum Sozial-/Ersatzleistungen",
  ausklammerungGruende: "Gründe weniger Einkommen",
  ausklammerungZeiten: "Daten weniger Einkommen",
  bmz: "Bemessungszeitraum",
} as const;

export type PersonPageStepKey = keyof typeof personPageSteps;

export enum PersonPageFlow {
  noFlow,
  selbststaendig,
  mischeinkuenfte,
  nichtSelbststaendig,
  keinEinkommen,
  sozialleistungen,
  sozialleistungenKeinEinkommen,
  nichtSelbststaendigKeinEinkommen,
  nichtSelbststaendigErsatzleistungen,
  nichtSelbststaendigBeides,
}

export function getNextStep(
  currentStep: PersonPageStepKey,
  flow: PersonPageFlow | undefined,
  hasAusklammerungsgrund: boolean | undefined,
): PersonPageStepKey | "routingEnded" {
  if (currentStep === "angabenPerson" || flow === undefined) {
    return "einkommenArt";
  } else if (currentStep === "einkommenArt") {
    if (
      flow === PersonPageFlow.keinEinkommen ||
      flow === PersonPageFlow.sozialleistungenKeinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigKeinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigBeides
    ) {
      return "zeitraumKeinEinkommen";
    } else if (
      flow === PersonPageFlow.sozialleistungen ||
      flow === PersonPageFlow.nichtSelbststaendigErsatzleistungen
    ) {
      return "zeitraumErsatzleistungen";
    }
    return "ausklammerungGruende";
  } else if (currentStep === "ausklammerungGruende") {
    if (hasAusklammerungsgrund) {
      return "ausklammerungZeiten";
    }
    return "bmz";
  } else if (currentStep === "ausklammerungZeiten") {
    return "bmz";
  } else if (currentStep === "zeitraumKeinEinkommen") {
    if (flow === PersonPageFlow.keinEinkommen) {
      return "routingEnded";
    } else if (
      flow === PersonPageFlow.sozialleistungenKeinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigBeides
    ) {
      return "zeitraumErsatzleistungen";
    }
    return "ausklammerungGruende";
  } else if (currentStep === "zeitraumErsatzleistungen") {
    if (
      flow === PersonPageFlow.sozialleistungen ||
      flow === PersonPageFlow.sozialleistungenKeinEinkommen
    ) {
      return "routingEnded";
    }
    return "ausklammerungGruende";
  }
  return "routingEnded";
}

export function getLastStep(
  currentStep: PersonPageStepKey,
  flow: PersonPageFlow | undefined,
  hasAusklammerungsgrund: boolean | undefined,
): PersonPageStepKey {
  if (currentStep === "bmz") {
    if (hasAusklammerungsgrund && hasAusklammerungsgrund === true) {
      return "ausklammerungZeiten";
    }
    return "ausklammerungGruende";
  } else if (currentStep === "ausklammerungZeiten") {
    return "ausklammerungGruende";
  } else if (currentStep === "ausklammerungGruende") {
    if (
      flow === PersonPageFlow.keinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigKeinEinkommen
    ) {
      return "zeitraumKeinEinkommen";
    } else if (
      flow === PersonPageFlow.sozialleistungen ||
      flow === PersonPageFlow.sozialleistungenKeinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigErsatzleistungen ||
      flow === PersonPageFlow.nichtSelbststaendigBeides
    ) {
      return "zeitraumErsatzleistungen";
    }
    return "einkommenArt";
  } else if (currentStep === "zeitraumKeinEinkommen") {
    return "einkommenArt";
  } else if (currentStep === "zeitraumErsatzleistungen") {
    if (
      flow === PersonPageFlow.sozialleistungenKeinEinkommen ||
      flow === PersonPageFlow.nichtSelbststaendigBeides
    ) {
      return "zeitraumKeinEinkommen";
    }
    return "einkommenArt";
  }
  return "angabenPerson";
}
