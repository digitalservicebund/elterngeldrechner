export interface FormStep {
  heading: string;
  shortName?: string;
  route: string;
}

export type StepRoute = (typeof formSteps)[keyof typeof formSteps]["route"];

export const formSteps = {
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
