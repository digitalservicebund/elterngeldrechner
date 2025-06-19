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
  "Baden-Würtemberg",
  "Bayern",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Nordrhein-Westfalen",
  "Sachsen-Anhalt",
] as const;

export const allBundeslaender = [
  ...supportedBundeslaender,
  ...unsupportedBundeslaender,
].sort();
