export interface FormStep {
  heading: string;
  route: string;
}

type FormSteps = Record<Step, FormStep>;

export const formSteps: FormSteps = {
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
  elterngeldvarianten: {
    heading: "Elterngeldvarianten",
    route: "/elterngeldvarianten",
  },
  rechnerUndPlaner: {
    heading: "Monatsplaner",
    route: "/rechner-planer",
  },
  zusammenfassungUndDaten: {
    heading: "Zusammenfassung",
    route: "/zusammenfassung-und-daten",
  },
} as const;

enum Step {
  ALLGEMEINE_ANGABEN = "allgemeinAngaben",
  NACHWUCHS = "nachwuchs",
  ERWERBSTAETIGKEIT = "erwerbstaetigkeit",
  EINKOMMEN = "einkommen",
  ELTERNGELDVARIANTEN = "elterngeldvarianten",
  RECHNER_UND_PLANER = "rechnerUndPlaner",
  ZUSAMMENFASSUNG_UND_DATEN = "zusammenfassungUndDaten",
}
