import { PersonPageRoutes } from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";

export const customPersonPageHeading = (
  // elternteil: Elternteil,
  name: string,
  currentPersonPageRoute: PersonPageRoutes,
  // currentPersonFlowStep?: PersonPageFlowStep,
  // currentIncomeIndex?: number
): string | undefined => {
  if (
    // elternteil === Elternteil.Eins &&
    currentPersonPageRoute === PersonPageRoutes.ANGABEN_PERSON
  ) {
    return undefined;
  }

  // if (
  //   elternteil === Elternteil.Zwei &&
  //   currentPersonPageRoute === PersonPageRoutes.ANGABEN_PERSON
  // ) {
  //   return "Sollen beide Elternteile Elterngeld bekommen?";
  // }

  // if (
  //   currentPersonPageRoute === PersonPageRoutes.FLOW && currentPersonFlowStep === PersonPageFlowStep.EINKOMMEN
  // ) {
  //   if (currentIncomeIndex) {
  //     return `Einkommen ${currentIncomeIndex}`;
  //   } else {
  //     return "Einkommen";
  //   }
  // }

  return `Finanzielle Situation ${name}`;
};
