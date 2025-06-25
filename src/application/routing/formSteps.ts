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
  rechnerUndPlaner: {
    heading: "Planen Sie Ihr Elterngeld",
    shortName: "Monatsplaner",
    route: "/rechner-planer",
  },
  zusammenfassungUndDaten: {
    heading: "Übernahme Ihrer Planung in den PDF Antrag auf Elterngeld",
    shortName: "Datenübernahme Antrag",
    route: "/zusammenfassung-und-daten",
  },
} as const;
