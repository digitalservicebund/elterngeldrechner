export interface FormStep {
  heading: string;
  shortName?: string;
  route: string;
}

export type StepRoute = (typeof formSteps)[keyof typeof formSteps]["route"];

export const formSteps = {
  einfuehrung: {
    heading: "So nutzen Sie den Elterngeldrechner mit Planer",
    shortName: "Einführungsseite",
    route: "/einfuehrung",
  },
  kind: {
    heading: "1. Angaben zum Kind",
    route: "/kind",
  },
  familie: {
    heading: "2. Angaben zur Familie",
    route: "/familie",
  },
  person: {
    heading: "3. Angaben Person",
    route: "/person",
  },

  allgemeinAngaben: {
    heading: "Allgemeine Angaben",
    route: "/allgemeine-angaben",
  },
  nachwuchs: {
    heading: "Ihr Nachwuchs",
    route: "/nachwuchs",
  },
  erwerbstaetigkeit: {
    heading: "Erwerbstätigkeit",
    route: "/erwerbstaetigkeit",
  },
  einkommen: {
    heading: "Ihr Einkommen",
    route: "/einkommen",
  },
  beispiele: {
    heading: "Wie stellen Sie sich Ihre Elternzeit vor?",
    shortName: "Planung starten",
    route: "/beispiele",
  },
  rechnerUndPlaner: {
    heading: "Planen Sie Ihr Elterngeld",
    shortName: "Monatsplaner",
    route: "/rechner-planer",
  },
  datenuebernahmeAntrag: {
    heading: "Übernahme Planung in den PDF Antrag auf Elterngeld",
    shortName: "Datenübernahme Antrag",
    route: "/datenuebernahme-antrag",
  },
} as const;
