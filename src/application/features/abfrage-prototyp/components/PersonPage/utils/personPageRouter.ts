import { PersonPageRoutes } from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";
import { Antragstellende } from "@/application/features/abfrageteil/state";
import { Elternteil } from "@/monatsplaner";

export const personPageRouter = (
  direction: "forward" | "backward",
  currentPersonPageRoute: PersonPageRoutes,
  elternteil: Elternteil,
  antragstellende: Antragstellende | null,
  hasAusklammerungsgrund?: boolean,
  hasKeinEinkommen?: boolean,
  isSelbststaendigeTaetigkeit?: boolean,
  hasWeitereTaetigkeit?: boolean,
  isSelbststaendigenFlow?: boolean,
  isFirstIncomeInMischeinkuenfteFlow?: boolean,
): {
  routingZuNaechstemFormStep: boolean;
  naechstePersonPageRoute?: PersonPageRoutes;
} => {
  if (direction === "forward") {
    switch (currentPersonPageRoute) {
      case PersonPageRoutes.ANGABEN_PERSON:
        if (
          elternteil === Elternteil.Zwei &&
          antragstellende === "EinenElternteil"
        ) {
          return { routingZuNaechstemFormStep: true };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE,
        };
      case PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE:
        if (hasAusklammerungsgrund) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN,
          };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.ABFRAGE_TAETIGKEITEN,
        };
      case PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.ABFRAGE_TAETIGKEITEN,
        };
      case PersonPageRoutes.ABFRAGE_TAETIGKEITEN:
        if (hasKeinEinkommen) {
          return { routingZuNaechstemFormStep: true };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
        };
      case PersonPageRoutes.DETAILS_TAETIGKEIT:
        if (isFirstIncomeInMischeinkuenfteFlow) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
          };
        }
        if (isSelbststaendigeTaetigkeit) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT,
          };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.DETAILS_ANGESTELLT,
        };
      case PersonPageRoutes.DETAILS_ANGESTELLT:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.EINGABE_EINKOMMEN,
        };
      case PersonPageRoutes.EINGABE_EINKOMMEN:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT,
        };
      case PersonPageRoutes.WEITERE_TAETIGKEIT:
        if (hasWeitereTaetigkeit && isSelbststaendigenFlow) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT_ART,
          };
        }
        if (hasWeitereTaetigkeit) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
          };
        }
        return { routingZuNaechstemFormStep: true };
      case PersonPageRoutes.WEITERE_TAETIGKEIT_ART:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
        };
      default:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: currentPersonPageRoute,
        };
    }
  }

  if (direction === "backward") {
    switch (currentPersonPageRoute) {
      case PersonPageRoutes.WEITERE_TAETIGKEIT_ART:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT,
        };
      case PersonPageRoutes.WEITERE_TAETIGKEIT:
        if (isSelbststaendigeTaetigkeit) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
          };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.EINGABE_EINKOMMEN,
        };
      case PersonPageRoutes.EINGABE_EINKOMMEN:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.DETAILS_ANGESTELLT,
        };
      case PersonPageRoutes.DETAILS_ANGESTELLT:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
        };
      case PersonPageRoutes.DETAILS_TAETIGKEIT:
        if (isFirstIncomeInMischeinkuenfteFlow) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
          };
        }
        if (hasWeitereTaetigkeit && isSelbststaendigenFlow) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT_ART,
          };
        }
        if (hasWeitereTaetigkeit) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT,
          };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.ABFRAGE_TAETIGKEITEN,
        };
      case PersonPageRoutes.ABFRAGE_TAETIGKEITEN:
        if (hasAusklammerungsgrund) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN,
          };
        }
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE,
        };
      case PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE,
        };
      case PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.ANGABEN_PERSON,
        };
      case PersonPageRoutes.ANGABEN_PERSON:
        return { routingZuNaechstemFormStep: true };
      default:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: currentPersonPageRoute,
        };
    }
  }

  return {
    routingZuNaechstemFormStep: false,
    naechstePersonPageRoute: currentPersonPageRoute,
  };
};
