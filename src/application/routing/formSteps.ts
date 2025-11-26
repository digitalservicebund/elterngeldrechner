export interface FormStep {
  heading: string;
  shortName?: string;
  route: string;
}

export type StepRoute = (typeof formSteps)[keyof typeof formSteps]["route"];

export const formSteps = {
  einfuehrung: {
    heading: "So nutzen Sie den Elterngeldrechner mit Planer",
    shortName: "Übersicht",
    route: "/einfuehrung",
  },
  familie: {
    heading: "Angaben zur Familie",
    shortName: "Angaben zur Familie",
    route: "/familie",
  },
  kind: {
    heading: "Angaben zum Kind",
    shortName: "Angaben zum Kind",
    route: "/kind",
  },
  geschwister: {
    heading: "Angaben zu Geschwistern",
    shortName: "Angaben zu Geschwistern",
    route: "/geschwister",
  },
  person1: {
    heading: "Angaben Person 1",
    shortName: "Angaben Person 1",
    route: "/person1",
  },
  person2: {
    heading: "Angaben Person 2",
    shortName: "Angaben Person 2",
    route: "/person2",
  },

  // allgemeinAngaben: {
  //   heading: "Allgemeine Angaben",
  //   route: "/allgemeine-angaben",
  // },
  // nachwuchs: {
  //   heading: "Ihr Nachwuchs",
  //   route: "/nachwuchs",
  // },
  // erwerbstaetigkeit: {
  //   heading: "Erwerbstätigkeit",
  //   route: "/erwerbstaetigkeit",
  // },
  // einkommen: {
  //   heading: "Ihr Einkommen",
  //   route: "/einkommen",
  // },
  beispiele: {
    heading: "Planung starten",
    shortName: "Planung starten",
    route: "/beispiele",
  },
  rechnerUndPlaner: {
    heading: "Planen Sie Ihr Elterngeld",
    shortName: "Planung und Berechnung",
    route: "/rechner-planer",
  },
  datenuebernahmeAntrag: {
    heading: "Übernahme Planung in den PDF Antrag auf Elterngeld",
    shortName: "Übernahme Planung in Antrag",
    route: "/datenuebernahme-antrag",
  },
} as const;
