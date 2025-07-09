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

/* Links for Bundesländer which use the Einheitlicher Antrag */
export const supportedBundeslaenderRessources = {
  Berlin:
    "https://www.berlin.de/sen/jugend/familie-und-kinder/finanzielle-leistungen/elterngeld-und-elternzeit/",
  Brandenburg:
    "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_id=100036807&bus_type=pst&bus_lng=de_DE#",
  Bremen: "https://www.service.bremen.de/elterngeld-beantragen-9743",
  Hamburg: "https://www.hamburg.de/service/info/11981756/n0/",
  Niedersachsen:
    "https://www.ms.niedersachsen.de/startseite/jugend_familie/familien_kinder_und_jugendliche/familien/elterngeld_elterngeld_plus/das-elterngeld-13791.html",
  "Rheinland-Pfalz":
    "https://mffki.rlp.de/themen/familie/gute-zukunft-fuer-alle-kinder-und-eltern/finanzielle-leistungen/elterngeld",
  Saarland:
    "https://www.saarland.de/las/DE/themen/elterngeldstelle/elterngeld_antrag",
  Sachsen:
    "https://amt24.sachsen.de/zufi/leistungen/6000384?plz=02625&ags=14625020",
  "Schleswig-Holstein":
    "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LASG/Aufgaben/KinderUndEltern/Download/BEEG-Formulare?nn=dbac10f9-1f25-4333-ab65-79d1c8ff830e",
  Thüringen:
    "https://landesverwaltungsamt.thueringen.de/soziales/elterngeld/formulare",
} as const;

/* Bundesländer which use their own PDFs */
export const unsupportedBundeslaender = [
  "Baden-Württemberg",
  "Bayern",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Nordrhein-Westfalen",
  "Sachsen-Anhalt",
] as const;

/* Links for Bundesländer which use their own PDFs */
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
} as const;

export const allBundeslaender = [
  ...supportedBundeslaender,
  ...unsupportedBundeslaender,
].sort();
