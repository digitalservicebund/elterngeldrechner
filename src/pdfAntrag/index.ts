export type Bundesland = (typeof allBundeslaender)[number];
export type SupportedBundesland = (typeof supportedBundeslaender)[number];
export type UnsupportedBundesland = (typeof unsupportedBundeslaender)[number];

/* Bundesländer which use the Einheitlicher PDF(!) Antrag */
export const supportedBundeslaender = [
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Niedersachsen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Schleswig-Holstein",
  "Thüringen",
] as const;

/* Bundesländer which use their own PDFs */
export const unsupportedBundeslaender = [
  "Baden-Württemberg",
  "Bayern",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Nordrhein-Westfalen",
  "Sachsen-Anhalt",
] as const;

/* Online- and Pdf-Antrag for Bundesländer which use their own PDFs */
export const unsupportedBundeslaenderRessources = {
  "Baden-Württemberg":
    "https://www.l-bank.de/produkte/familienfoerderung/elterngeld.html",
  Bayern: "https://www.zbfs.bayern.de/familienleistungen/elterngeld/",
  Hessen: "https://familie.hessen.de/familie/geld-fuer-familien/elterngeld",
  "Mecklenburg-Vorpommern":
    "https://www.lagus.mv-regierung.de/Soziales/Elterngeld_ElterngeldPlus/",
  "Nordrhein-Westfalen": "https://www.familienportal.nrw/de/elterngeld",
  "Sachsen-Anhalt":
    "https://lvwa.sachsen-anhalt.de/das-lvwa/landesjugendamt/familien-und-frauen/elterngeld-und-elternzeit",
};

export const allBundeslaender = [
  ...supportedBundeslaender,
  ...unsupportedBundeslaender,
].sort();
