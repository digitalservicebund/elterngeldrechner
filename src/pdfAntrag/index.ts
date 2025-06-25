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
  "Baden-Württemberg": {
    online: "https://www.l-bank.de/produkte/familienfoerderung/elterngeld.html",
    pdf: "https://www.l-bank.de/download/version/a3686665-d167-4a06-ac9b-bf494301ce6b/20250125_antragelterngeld_homepage_10.24_27-01-2025.pdf",
  },
  Bayern: {
    online: "https://www.elterngeld.bayern.de/onlineantrag/",
    pdf: "https://www.zbfs.bayern.de/imperia/md/content/zbfs_intranet/produktgruppe_i/formulare/beeg-antrag/elterngeldantrag_042024.pdf",
  },
  Hessen: {
    online: "https://elterngeld.hessen.de/Elterngeld-Onlineantrag/default.aspx",
    pdf: "https://www.familienatlas.de/fileadmin/familienatlas/Downloads/Elterngeld/Antrag_auf_Elterngeld_02.pdf",
  },
  "Mecklenburg-Vorpommern": {
    online: "https://elterngeld-digital.de/ams/Elterngeld",
    pdf: "https://www.lagus.mv-regierung.de/serviceassistent/download?id=1678098",
  },
  "Nordrhein-Westfalen": {
    online: "https://www.familienportal.nrw/de/elterngeld/antrag",
    pdf: "https://www.familienportal.nrw/sites/default/files/2025-03/Antragsformular%20BEEG%20NRW%20Stand%20Mai%202025.pdf",
  },
  "Sachsen-Anhalt": {
    online: "https://www.elterngeld-digital.de/ams/Elterngeld",
    pdf: "https://lvwa.sachsen-anhalt.de/fileadmin/Bibliothek/Politik_und_Verwaltung/LVWA/LVwA/Dokumente/5_famgesjugvers/502/Dateien_502.a/Elterngeld/Antrag_auf_Elterngeld_neu1.pdf",
  },
};

export const allBundeslaender = [
  ...supportedBundeslaender,
  ...unsupportedBundeslaender,
].sort();
