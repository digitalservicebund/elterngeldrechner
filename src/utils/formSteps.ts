export interface FormStep {
  text: string;
  route: string;
}

export type FormSteps = Record<string, FormStep>;

export const formSteps: FormSteps = {
  allgemeinAngaben: {
    text: "Allgemeine Angaben",
    route: "/allgemeine-angaben",
  },
  nachwuchs: {
    text: "Ihr Nachwuchs",
    route: "/nachwuchs",
  },
  erwerbstaetigkeit: {
    text: "Erwerbstätigkeit",
    route: "/erwerbstaetigkeit",
  },
  einkommen: {
    text: "Ihr Einkommen",
    route: "/einkommen",
  },
  elterngeldvarianten: {
    text: "Elterngeldvarianten",
    route: "/elterngeldvarianten",
  },
  rechnerUndPlaner: {
    text: "Rechner und Planer",
    route: "/rechner-planer",
  },
  zusammenfassungUndDaten: {
    text: "Zusammenfassung",
    route: "/zusammenfassung-und-daten",
  },
};
