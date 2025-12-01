import { PersonPageRoutes } from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";
import { Antragstellende } from "@/application/features/abfrageteil/state";
import { Elternteil } from "@/monatsplaner";

export const personPageRouter = (
  direction: "forward" | "backward",
  currentPersonPageRoute: PersonPageRoutes,
  elternteil: Elternteil,
  antragstellende: Antragstellende | null,
  // flow: PersonPageFlow,
  // currentPersonFlowStep: PersonPageFlowStep,
  hasAusklammerungsgrund?: boolean,
  hasKeinEinkommen?: boolean,
  hasWeitereTaetigkeit?: boolean,
): {
  routingZuNaechstemFormStep: boolean;
  naechstePersonPageRoute?: PersonPageRoutes;
  // naechsterPersonFlowStep?: PersonPageFlowStep
} => {
  // const {
  //   routingZuNaechsterPageRoute,
  //   naechsterPersonFlowStep
  // } = personFlowRouter(
  //   direction,
  //   flow,
  //   currentPersonFlowStep,
  //   hasAusklammerungsgrund
  // )

  // const hasKeinEinkommen = flow === PersonPageFlow.keinEinkommen
  //   || flow === PersonPageFlow.sozialleistungen
  //   || flow === PersonPageFlow.sozialleistungenKeinEinkommen
  //   || flow === PersonPageFlow.nichtSelbststaendigKeinEinkommen
  //   || flow === PersonPageFlow.nichtSelbststaendigErsatzleistungen
  //   || flow === PersonPageFlow.nichtSelbststaendigBeides

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
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.WEITERE_TAETIGKEIT,
        };
      case PersonPageRoutes.WEITERE_TAETIGKEIT:
        if (hasWeitereTaetigkeit) {
          return {
            routingZuNaechstemFormStep: false,
            naechstePersonPageRoute: PersonPageRoutes.DETAILS_TAETIGKEIT,
          };
        }
        return { routingZuNaechstemFormStep: true };
      default:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: currentPersonPageRoute,
        };
    }
  }

  if (direction === "backward") {
    switch (currentPersonPageRoute) {
      case PersonPageRoutes.ANGABEN_PERSON:
        return { routingZuNaechstemFormStep: true };
      case PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.ANGABEN_PERSON,
        };
      case PersonPageRoutes.AUSKLAMMERUNGS_ZEITEN:
        return {
          routingZuNaechstemFormStep: false,
          naechstePersonPageRoute: PersonPageRoutes.AUSKLAMMERUNGS_GRUENDE,
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
      case PersonPageRoutes.DETAILS_TAETIGKEIT:
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
      case PersonPageRoutes.WEITERE_TAETIGKEIT:
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

  return {
    routingZuNaechstemFormStep: false,
    naechstePersonPageRoute: currentPersonPageRoute,
  };
};

// const personFlowRouter = (
//   direction: "forward" | "backward",
//   flow: PersonPageFlow,
//   currentPersonFlowStep: PersonPageFlowStep,
//   hasAusklammerungsgrund?: boolean
// ): {
//   routingZuNaechsterPageRoute: boolean,
//   naechsterPersonFlowStep?: PersonPageFlowStep
// } => {
//   if (direction === "forward") {
//     switch (currentPersonFlowStep) {
//       case PersonPageFlowStep.AUSKLAMMERUNGS_GRUENDE:
//         if (hasAusklammerungsgrund) {
//           return {
//             routingZuNaechsterPageRoute: false,
//             naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_ZEITEN
//           }
//         }
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.BMZ
//         }
//       case PersonPageFlowStep.AUSKLAMMERUNGS_ZEITEN:
//         if (flow === PersonPageFlow.selbststaendig || flow === PersonPageFlow.mischeinkuenfte) {
//           return {
//             routingZuNaechsterPageRoute: false,
//             naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_LOOP
//           }
//         }
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.BMZ
//         }
//       case PersonPageFlowStep.AUSKLAMMERUNGS_LOOP:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.BMZ
//         }
//       case PersonPageFlowStep.BMZ:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.EINKOMMEN
//         }
//       case PersonPageFlowStep.EINKOMMEN:
//         // if (timeDifference > 14) {
//         //   return {
//         //     routingZuNaechsterSeite: false,
//         //     naechsteRoute: KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK,
//         //   };
//         // } else {
//         //   return { routingZuNaechsterSeite: true };
//         // }
//         break
//       default:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: currentPersonFlowStep
//         }
//     }
//   }

//   if (direction === "backward") {
//     switch (currentPersonFlowStep) {
//       case PersonPageFlowStep.AUSKLAMMERUNGS_GRUENDE:
//         return { routingZuNaechsterPageRoute: true }
//       case PersonPageFlowStep.AUSKLAMMERUNGS_ZEITEN:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_GRUENDE
//         }
//       case PersonPageFlowStep.AUSKLAMMERUNGS_LOOP:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_ZEITEN
//         }
//       case PersonPageFlowStep.BMZ:
//         if (hasAusklammerungsgrund === false) {
//           return {
//             routingZuNaechsterPageRoute: false,
//             naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_GRUENDE
//           }
//         } else {
//           if (flow === PersonPageFlow.selbststaendig || flow === PersonPageFlow.mischeinkuenfte) {
//             return {
//               routingZuNaechsterPageRoute: false,
//               naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_LOOP
//             }
//           }
//           return {
//             routingZuNaechsterPageRoute: false,
//             naechsterPersonFlowStep: PersonPageFlowStep.AUSKLAMMERUNGS_ZEITEN
//           }
//         }
//       case PersonPageFlowStep.EINKOMMEN:
//         // if (timeDifference > 14) {
//         //   return {
//         //     routingZuNaechsterSeite: false,
//         //     naechsteRoute: KindPageRoutes.GEBURT_PLAUSIBILITAETSCHECK,
//         //   };
//         // } else {
//         //   return { routingZuNaechsterSeite: true };
//         // }
//         break
//       default:
//         return {
//           routingZuNaechsterPageRoute: false,
//           naechsterPersonFlowStep: currentPersonFlowStep
//         }
//     }
//   }

//   return {
//     routingZuNaechsterPageRoute: false,
//     naechsterPersonFlowStep: currentPersonFlowStep
//   }
// };
